import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './AuthContext';

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jetbrains-mono'
});

export const metadata: Metadata = {
  title: 'STARK_OS - Nightshade Protocol',
  description: 'Advanced AI-powered student companion with Iron Man HUD interface running Nightshade Protocol',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} font-hud`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
