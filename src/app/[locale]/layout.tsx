import { Inter, Poppins } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Sidebar from "@/components/Sidebar";
import VoiceAssistant from "@/components/VoiceAssistant";
import { ProgressProvider } from "./context/ProgressContext";
import { GameProvider } from "./context/GameContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Arch-Intelligence | AI Career Platform",
  description: "Roadmaps, Architecture, and Impact.",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} antialiased flex bg-surface`}>
        <NextIntlClientProvider messages={messages}>
          <ProgressProvider>
            <GameProvider>
              <Sidebar locale={locale} />
              <main className="flex-1 min-h-screen p-8 ml-64 overflow-y-auto">
                {children}
                <VoiceAssistant />
              </main>
            </GameProvider>
          </ProgressProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
