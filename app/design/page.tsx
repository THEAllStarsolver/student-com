'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface DesignProject {
  id: string;
  userId: string;
  name: string;
  description: string;
  platform: string;
  projectUrl?: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  createdAt: any;
  updatedAt: any;
}

const designPlatforms = [
  {
    name: 'Onshape',
    url: 'https://www.onshape.com/',
    description: 'Professional CAD design platform',
    category: 'CAD'
  },
  {
    name: 'Tinkercad',
    url: 'https://www.tinkercad.com/',
    description: '3D design & electronics simulation',
    category: 'CAD'
  },
  {
    name: 'Figma',
    url: 'https://www.figma.com/',
    description: 'UI/UX design & prototyping',
    category: 'UI/UX'
  },
  {
    name: 'Canva',
    url: 'https://www.canva.com/',
    description: 'Graphic design & presentations',
    category: 'Graphics'
  },
  {
    name: 'CircuitLab',
    url: 'https://www.circuitlab.com/',
    description: 'Circuit simulation & analysis',
    category: 'Simulation'
  }
];

export default function DesignPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<DesignProject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<DesignProject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platform: '',
    projectUrl: ''
  });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const projectsQuery = query(
        collection(db, 'designProjects'),
        where('userId', '==', user!.uid)
      );
      const snapshot = await getDocs(projectsQuery);
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DesignProject[];
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        userId: user!.uid,
        status: 'Not Started' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (editingProject) {
        await updateDoc(doc(db, 'designProjects', editingProject.id), {
          ...formData,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, 'designProjects'), projectData);
      }
      
      setFormData({ name: '', description: '', platform: '', projectUrl: '' });
      setShowForm(false);
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const updateProjectStatus = async (projectId: string, status: DesignProject['status']) => {
    try {
      await updateDoc(doc(db, 'designProjects', projectId), {
        status,
        updatedAt: new Date()
      });
      fetchProjects();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'designProjects', id));
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const editProject = (project: DesignProject) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      platform: project.platform,
      projectUrl: project.projectUrl || ''
    });
    setShowForm(true);
  };

  const openPlatform = (platform: string, projectUrl?: string) => {
    const platformData = designPlatforms.find(p => p.name === platform);
    const url = projectUrl || platformData?.url || '#';
    window.open(url, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Started': return 'text-slate-400 border-slate-400';
      case 'In Progress': return 'text-yellow-400 border-yellow-400';
      case 'Completed': return 'text-green-400 border-green-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Design Workspace 🎨
        </h1>
        <p className="text-xl text-slate-300">Manage your design projects across platforms</p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="text-slate-300">
          <span className="text-neon-cyan font-semibold">{projects.length}</span> projects tracked
        </div>
        <PrimaryButton onClick={() => setShowForm(true)}>
          New Project
        </PrimaryButton>
      </div>

      {showForm && (
        <GlassCard className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">
            {editingProject ? 'Edit Project' : 'New Design Project'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Project name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white"
              required
            />
            <textarea
              placeholder="Project description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white h-24"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.platform}
                onChange={(e) => setFormData({...formData, platform: e.target.value})}
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white"
                required
              >
                <option value="">Select platform...</option>
                {designPlatforms.map((platform) => (
                  <option key={platform.name} value={platform.name}>{platform.name}</option>
                ))}
              </select>
              <input
                type="url"
                placeholder="Project URL (optional)"
                value={formData.projectUrl}
                onChange={(e) => setFormData({...formData, projectUrl: e.target.value})}
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-purple focus:outline-none text-white"
              />
            </div>
            <div className="flex gap-2">
              <PrimaryButton type="submit">
                {editingProject ? 'Update Project' : 'Create Project'}
              </PrimaryButton>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProject(null);
                  setFormData({ name: '', description: '', platform: '', projectUrl: '' });
                }}
                className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <GlassCard key={project.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{project.name}</h3>
                <p className="text-sm text-slate-400 mb-2">{project.platform}</p>
                <span className={`inline-block px-2 py-1 rounded-lg text-xs border ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </div>
            
            {project.description && (
              <p className="text-slate-300 text-sm mb-4">{project.description}</p>
            )}
            
            <div className="space-y-2">
              <PrimaryButton 
                onClick={() => openPlatform(project.platform, project.projectUrl)}
                className="w-full"
              >
                Open in {project.platform}
              </PrimaryButton>
              
              <div className="flex gap-2">
                <select
                  value={project.status}
                  onChange={(e) => updateProjectStatus(project.id, e.target.value as DesignProject['status'])}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <button
                  onClick={() => editProject(project)}
                  className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {projects.length === 0 && !showForm && (
        <GlassCard className="text-center py-12">
          <h3 className="text-xl font-bold text-white mb-2">No Projects Yet</h3>
          <p className="text-slate-400 mb-4">Create your first design project to get started</p>
          <PrimaryButton onClick={() => setShowForm(true)}>
            Create Project
          </PrimaryButton>
        </GlassCard>
      )}

      <GlassCard className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">Available Platforms</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {designPlatforms.map((platform) => (
            <button
              key={platform.name}
              onClick={() => openPlatform(platform.name)}
              className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-center"
            >
              <div className="text-2xl mb-2">🎨</div>
              <div className="text-sm font-semibold text-white">{platform.name}</div>
              <div className="text-xs text-slate-400">{platform.category}</div>
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}