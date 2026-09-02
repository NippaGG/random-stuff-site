import { getItems } from "@/lib/items-server";
import PageClientWrapper from "@/components/PageClientWrapper";
import GridBackground from "@/components/GridBackground";
import HeroSection from "@/components/HeroSection";
import ContentSection from "@/components/ContentSection";
import Footer from "@/components/Footer";
import MobileHeroSection from "@/components/MobileHeroSection";
import MobileContentSection from "@/components/MobileContentSection";
import PixelBlastClientWrapper from "@/components/PixelBlastClientWrapper";

export default async function Home() {
  const items = await getItems();

  return (
    <PageClientWrapper>
      {/* --- DESKTOP --- */}
      <main className="hidden md:flex relative min-h-screen text-white flex-col">
        <div className="fixed inset-0 z-[-1]">
          <GridBackground />
        </div>

        <HeroSection />

        <div className="relative -mt-[300vh] z-20 flex-grow">
          <ContentSection initialItems={items} />
        </div>

        <div className="relative z-30">
          <Footer />
        </div>
      </main>

      {/* --- MOBILE --- */}
      <main className="flex md:hidden relative min-h-screen text-white flex-col bg-[#0a0a0a] overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <PixelBlastClientWrapper />
        </div>

        <div className="relative z-10">
          <MobileHeroSection initialItemCount={items.length} />
          <MobileContentSection initialItems={items} />
        </div>
      </main>
    </PageClientWrapper>
  );
}
