import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import AuthGuardWrapper from "@/app/login/authguardwrapper";
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'NeoMetropolis Cyber Security Response System',
  description: 'Cyber Security Response System for NeoMetropolis',
};

// Marking this as a client component to use usePathname
export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
      <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
      <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
      >
        <AuthGuardWrapper>{children}</AuthGuardWrapper>
          <Analytics />
        <Toaster />
      </ThemeProvider>
      </body>
      </html>
  );
}
