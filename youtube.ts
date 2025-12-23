// YouTube Data API v3 Helper

export interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  url: string;
}

export async function searchYouTube(query: string, maxResults: number = 5): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(`/api/youtube?q=${encodeURIComponent(query)}&max=${maxResults}`);
    if (!response.ok) throw new Error('YouTube API failed');
    return await response.json();
  } catch (error) {
    console.error('YouTube search error:', error);
    return [];
  }
}

export function getCareerQuery(career: string): string {
  return `how to become ${career} roadmap tutorial`;
}

export function getSkillQuery(skill: string): string {
  return `${skill} tutorial for beginners complete course`;
}

export function getExamQuery(exam: string, subject?: string): string {
  return subject ? `${exam} ${subject} preparation best resources` : `${exam} preparation strategy`;
}
