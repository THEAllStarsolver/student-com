import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AnimationProvider } from '@/context/AnimationContext';
import ModernShell from '@/components/ModernShell';

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
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
            <AnimationProvider>
              <ModernShell>
                {children}
              </ModernShell>
            </AnimationProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
