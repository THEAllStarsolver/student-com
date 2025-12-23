'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Award, Calendar } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  internal: number;
  external: number;
  total: number;
  grade: string;
  credits: number;
}

export default function Academics() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with Firebase fetch
  useEffect(() => {
    const mockSubjects: Subject[] = [
      {
        id: '1',
        name: 'Machine Learning',
        internal: 85,
        external: 78,
        total: 163,
        grade: 'A',
        credits: 4
      },
      {
        id: '2',
        name: 'Data Structures',
        internal: 92,
        external: 88,
        total: 180,
        grade: 'A+',
        credits: 4
      },
      {
        id: '3',
        name: 'Database Systems',
        internal: 78,
        external: 82,
        total: 160,
        grade: 'A',
        credits: 3
      },
      {
        id: '4',
        name: 'Computer Networks',
        internal: 88,
        external: 75,
        total: 163,
        grade: 'A',
        credits: 3
      },
      {
        id: '5',
        name: 'Software Engineering',
        internal: 90,
        external: 85,
        total: 175,
        grade: 'A+',
        credits: 4
      }
    ];

    setTimeout(() => {
      setSubjects(mockSubjects);
      setLoading(false);
    }, 1000);
  }, []);

  const calculateGPA = () => {
    if (subjects.length === 0) return 0;
    
    const gradePoints = {
      'A+': 10,
      'A': 9,
      'B+': 8,
      'B': 7,
      'C+': 6,
      'C': 5,
      'D': 4,
      'F': 0
    };

    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
      totalPoints += (gradePoints[subject.grade as keyof typeof gradePoints] || 0) * subject.credits;
      totalCredits += subject.credits;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'text-stark-emerald';
      case 'A': return 'text-stark-cyan';
      case 'B+': return 'text-yellow-400';
      case 'B': return 'text-orange-400';
      default: return 'text-red-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-stark-cyan mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading academic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-stark flex items-center">
              <BookOpen className="mr-3" size={32} />
              Academic Performance
            </h1>
            <p className="text-gray-300 mt-2">Track your academic progress and achievements</p>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-stark-cyan">{calculateGPA()}</div>
            <div className="text-sm text-gray-400">Current GPA</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Subjects',
            value: subjects.length,
            icon: BookOpen,
            color: 'text-stark-cyan'
          },
          {
            label: 'Average Score',
            value: `${Math.round(subjects.reduce((acc, s) => acc + s.total, 0) / subjects.length)}%`,
            icon: TrendingUp,
            color: 'text-stark-emerald'
          },
          {
            label: 'A+ Grades',
            value: subjects.filter(s => s.grade === 'A+').length,
            icon: Award,
            color: 'text-yellow-400'
          },
          {
            label: 'Total Credits',
            value: subjects.reduce((acc, s) => acc + s.credits, 0),
            icon: Calendar,
            color: 'text-purple-400'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="glass-card p-6 stark-hover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon size={24} className={stat.color} />
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Subjects Table */}
      <motion.div
        className="glass-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="p-6 border-b border-stark-border">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Award className="mr-2 text-stark-cyan" size={20} />
            Subject-wise Performance
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Internal
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-300 uppercase tracking-wider">
                  External
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Credits
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stark-border">
              {subjects.map((subject, index) => (
                <motion.tr
                  key={subject.id}
                  className="stark-hover"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + 0.1 * index, duration: 0.4 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-white font-medium">{subject.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-gray-300">{subject.internal}/100</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-gray-300">{subject.external}/100</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-white font-semibold">{subject.total}/200</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium bg-white/10 ${getGradeColor(subject.grade)}`}>
                      {subject.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-gray-300">{subject.credits}</div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Performance Chart Placeholder */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <TrendingUp className="mr-2 text-stark-cyan" size={20} />
          Performance Trends
        </h3>
        
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-stark-border rounded-lg">
          <div className="text-center text-gray-400">
            <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
            <p>Performance chart will be implemented here</p>
            <p className="text-sm mt-2">Integration with charting library pending</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}