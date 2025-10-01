import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '[EXAMPLE] Light API App',
  description: 'Example Light API app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full" style={{ overscrollBehaviorX: 'auto' }}>
        {children}
      </body>
    </html>
  );
}
