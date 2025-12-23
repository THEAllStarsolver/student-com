'use client';

import { useState, useRef } from 'react';
import { callLLM } from '@/lib/llm';
import { searchYouTube, getCareerQuery, getSkillQuery, getExamQuery, YouTubeVideo } from '@/lib/youtube';
import { searchNearbyPlaces, detectPlaceType, Place } from '@/lib/places';
import GlassCard from './ui/GlassCard';
import PrimaryButton from './ui/PrimaryButton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  videos?: YouTubeVideo[];
  places?: Place[];
}

export default function Chatbot({ initialPrompt }: { initialPrompt?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);

  // Location persistence
  const userLocation = useRef<{ lat: number; lng: number } | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const lowerInput = input.toLowerCase();
      let response = '';
      let videos: YouTubeVideo[] = [];
      let places: Place[] = [];

      // 1. Check for ID/Keywords for specialized actions
      const isVideoRequest = lowerInput.includes('video') || lowerInput.includes('youtube') || lowerInput.includes('watch');
      const isPlaceRequest = lowerInput.includes('near') || lowerInput.includes('place') || lowerInput.includes('restaurant') || lowerInput.includes('cafe') || lowerInput.includes('library');

      // 2. Handle Places
      if (isPlaceRequest) {
        const placeType = detectPlaceType(input) || 'point_of_interest';

        // Get Location if not already known
        if (!userLocation.current) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            userLocation.current = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
          } catch (error) {
            console.log("Geolocation denied or error");
          }
        }

        if (userLocation.current) {
          places = await searchNearbyPlaces(placeType, userLocation.current.lat, userLocation.current.lng);
        }
      }

      // 3. Handle Videos
      if (isVideoRequest) {
        // Extract a query for video or just use the input
        // Simple extraction: remove "video", "youtube" words
        const videoQuery = input.replace(/video|youtube|watch/gi, '').trim();
        videos = await searchYouTube(videoQuery || input);
      }

      // 4. Always get LLM Text Response
      // We can append context about what we found
      let prompt = input;
      if (places.length > 0) {
        prompt += `\n[System Note: I found ${places.length} places nearby. Mention them briefly.]`;
      }
      if (videos.length > 0) {
        prompt += `\n[System Note: I found ${videos.length} videos. Mention them briefly.]`;
      }

      response = await callLLM(prompt);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        videos: videos.length > 0 ? videos : undefined,
        places: places.length > 0 ? places : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="h-[600px] flex flex-col">
      <h2 className="text-2xl font-bold mb-4">AI Companion Chat 💬</h2>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <p>Ask me about careers, skills, exams, or nearby places!</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div
              className={`inline-block p-3 rounded-2xl max-w-[80%] ${msg.role === 'user'
                ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                : 'bg-white/10 border border-white/20'
                }`}
            >
              <div className="text-sm prose prose-invert max-w-none">
                {msg.role === 'assistant' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                      li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-bold text-neon-cyan" {...props} />,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>

              {msg.videos && msg.videos.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.videos.map((video) => (
                    <a
                      key={video.id}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <img src={video.thumbnail} alt={video.title} className="w-20 h-14 rounded object-cover" />
                        <div className="flex-1 text-left">
                          <p className="text-xs font-semibold line-clamp-2">{video.title}</p>
                          <p className="text-xs text-gray-400">{video.channel}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {msg.places && msg.places.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.places.map((place, i) => (
                    <a
                      key={i}
                      href={place.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left"
                    >
                      <p className="text-xs font-semibold">{place.name}</p>
                      <p className="text-xs text-gray-400">{place.type} • ⭐ {place.rating || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{place.address}</p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-left">
            <div className="inline-block p-3 rounded-2xl bg-white/10 border border-white/20">
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none"
        />
        <PrimaryButton onClick={handleSend} disabled={loading}>
          Send
        </PrimaryButton>
      </div>
    </GlassCard>
  );
}
