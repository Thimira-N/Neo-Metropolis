import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'NeoMetropolis Security Response System',
  description: 'Cyber Security Response System for NeoMetropolis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen flex-col">
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}