export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend: string;
  category: string;
  postedDate: string;
  applyLink: string;
}

export const mockInternships: Internship[] = [
  {
    id: '1',
    title: 'Full Stack Developer Intern',
    company: 'TechCorp Solutions',
    location: 'Remote',
    duration: '6 months',
    stipend: '₹15,000/month',
    category: 'Engineering',
    postedDate: '2 days ago',
    applyLink: 'https://internshala.com',
  },
  {
    id: '2',
    title: 'Data Science Intern',
    company: 'AI Innovations',
    location: 'Bangalore',
    duration: '3 months',
    stipend: '₹20,000/month',
    category: 'Data Science',
    postedDate: '1 day ago',
    applyLink: 'https://internshala.com',
  },
  {
    id: '3',
    title: 'Digital Marketing Intern',
    company: 'Brand Boost',
    location: 'Mumbai',
    duration: '4 months',
    stipend: '₹10,000/month',
    category: 'Marketing',
    postedDate: '3 days ago',
    applyLink: 'https://internshala.com',
  },
];
