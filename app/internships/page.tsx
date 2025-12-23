'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { mockInternships } from '@/lib/internships';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function InternshipsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState('All');
  const [internships, setInternships] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const categories = ['All', 'Engineering', 'Marketing', 'Design', 'Business'];

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    const fetchInternships = async () => {
      setIsSearching(true);
      try {
        const query = filter === 'All' ? 'internships in India' : `${filter} internships in India`;
        const res = await fetch(`/api/internships?query=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (data.data) {
          setInternships(data.data);
        }
      } catch (error) {
        console.error('Failed to load internships', error);
      } finally {
        setIsSearching(false);
      }
    };

    if (user) {
      fetchInternships();
    }
  }, [filter, user]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Internships 💼</h1>
      <p className="text-xl text-slate-300 mb-12">Browse live internship opportunities</p>

      <div className="flex flex-wrap gap-4 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-3 rounded-xl transition-all font-medium ${filter === cat
              ? 'backdrop-blur-xl bg-white/20 border border-white/30 text-white shadow-lg'
              : 'backdrop-blur-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isSearching ? (
        <div className="text-center py-20">
          <div className="text-2xl text-slate-400 dark:text-gray-400 animate-pulse">Searching best opportunities...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {internships.map((job: any) => (
            <GlassCard key={job.job_id} className="h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 line-clamp-1 text-white" title={job.job_title}>{job.job_title}</h3>
                  <div className="flex items-center gap-2">
                    {job.employer_logo ? (
                      <img src={job.employer_logo} alt={job.employer_name} className="w-6 h-6 object-contain rounded" />
                    ) : (
                      <span className="text-2xl">🏢</span>
                    )}
                    <p className="text-blue-400 font-medium">{job.employer_name}</p>
                  </div>
                </div>
                {job.job_is_remote && (
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/20 dark:border-green-500/30">
                    REMOTE
                  </span>
                )}
              </div>

              <div className="space-y-3 text-slate-300 mb-6 flex-1">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span className="truncate">{job.job_city || 'Remote'}, {job.job_country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span>{job.job_employment_type?.toLowerCase().replace('_', ' ') || 'Part time'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span className="text-xs text-slate-400">Posted {new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}</span>
                </div>
                <p className="line-clamp-3 text-sm text-slate-400 mt-4 leading-relaxed">
                  {job.job_description}
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <PrimaryButton
                  onClick={() => window.open(job.job_apply_link, '_blank')}
                  className="w-full justify-center text-lg"
                >
                  Apply Now 🚀
                </PrimaryButton>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
