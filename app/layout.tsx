import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AnimationProvider } from '@/context/AnimationContext';
import Navigation from '@/components/navigation/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Student Companion - Your AI Study Buddy',
  description: 'Gen Z-friendly student companion with mood tracking, chatbot, travel, internships, and academics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AnimationProvider>
              {/* Mission Control Layout Grid */}
              <div className="mission-control-layout">
                <Navigation />
                <main className="mission-control-main">
                  {children}
                </main>
              </div>
            </AnimationProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
