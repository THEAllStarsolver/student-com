'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userHostel: string;
  timestamp: any;
  channel: string;
}

const channels = [
  { id: 'general', name: 'General', icon: '💬' },
  { id: 'doubts', name: 'Doubts', icon: '❓' },
  { id: 'projects', name: 'Projects', icon: '💻' },
  { id: 'buysell', name: 'Buy/Sell', icon: '🛒' }
];

export default function CommunityPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState('general');
  const [userHostel, setUserHostel] = useState('');
  const [userName, setUserName] = useState('');
  const [showHostelSelect, setShowHostelSelect] = useState(false);

  const hostels = [
    'Hostel A', 'Hostel B', 'Hostel C', 'Hostel D', 'Hostel E',
    'PG 1', 'PG 2', 'PG 3', 'Off Campus'
  ];

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (user && userHostel) {
      const messagesQuery = query(
        collection(db, 'messages'),
        where('channel', '==', activeChannel),
        where('userHostel', '==', userHostel),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];
        setMessages(messagesData);
      });

      return () => unsubscribe();
    }
  }, [user, activeChannel, userHostel]);

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user!.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.name || 'Anonymous');
        setUserHostel(userData.hostel || '');
        if (!userData.hostel) {
          setShowHostelSelect(true);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const updateUserHostel = async (hostel: string) => {
    try {
      await updateDoc(doc(db, 'users', user!.uid), { hostel });
      setUserHostel(hostel);
      setShowHostelSelect(false);
    } catch (error) {
      console.error('Error updating hostel:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !userHostel) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        userId: user!.uid,
        userName,
        userHostel,
        channel: activeChannel,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const generateUPILink = (amount: number, note: string) => {
    const upiId = 'student@paytm'; // Replace with actual UPI ID
    return `upi://pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(note)}`;
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Community 👥
        </h1>
        <p className="text-xl text-slate-300">Connect with your hostel mates</p>
        {userHostel && (
          <p className="text-lg text-slate-400 mt-2">
            Hostel: <span className="text-neon-cyan font-semibold">{userHostel}</span>
            <button
              onClick={() => setShowHostelSelect(true)}
              className="ml-2 text-sm text-neon-purple hover:underline"
            >
              Change
            </button>
          </p>
        )}
      </div>

      {showHostelSelect && (
        <GlassCard className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Select Your Hostel</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {hostels.map((hostel) => (
              <button
                key={hostel}
                onClick={() => updateUserHostel(hostel)}
                className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                {hostel}
              </button>
            ))}
          </div>
        </GlassCard>
      )}

      {userHostel && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Channels Sidebar */}
          <div className="lg:col-span-1">
            <GlassCard>
              <h3 className="text-lg font-bold text-white mb-4">Channels</h3>
              <div className="space-y-2">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
                      activeChannel === channel.id
                        ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{channel.icon}</span>
                    {channel.name}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <GlassCard className="h-[70vh] flex flex-col">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">
                  {channels.find(c => c.id === activeChannel)?.icon} {channels.find(c => c.id === activeChannel)?.name}
                </h2>
                <span className="text-sm text-slate-400">{messages.length} messages</span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-neon-cyan">{message.userName}</span>
                      <span className="text-xs text-slate-500">
                        {message.timestamp?.toDate?.()?.toLocaleTimeString() || 'Just now'}
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <p className="text-white">{message.text}</p>
                      {activeChannel === 'buysell' && message.text.includes('₹') && (
                        <div className="mt-2">
                          <a
                            href={generateUPILink(100, `Payment to ${message.userName}`)}
                            className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-all"
                          >
                            Pay via UPI
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={`Message #${channels.find(c => c.id === activeChannel)?.name.toLowerCase()}...`}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white"
                />
                <PrimaryButton onClick={sendMessage}>
                  Send
                </PrimaryButton>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}