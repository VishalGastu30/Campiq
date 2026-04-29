import { HeroSection } from '@/components/home/HeroSection';
import { StatsBar } from '@/components/home/StatsBar';
import { FeaturedColleges } from '@/components/home/FeaturedColleges';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <StatsBar />
      <FeaturedColleges />
    </div>
  );
}
