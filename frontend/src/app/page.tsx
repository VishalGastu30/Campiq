import { HeroSection } from '@/components/home/HeroSection';
import { DecisionDashboard } from '@/components/home/DecisionDashboard';
import { StreamCarousel } from '@/components/home/StreamCarousel';
import { TrendingSearches } from '@/components/home/TrendingSearches';
import { Differentiators } from '@/components/home/Differentiators';
import { FeaturedColleges } from '@/components/home/FeaturedColleges';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <DecisionDashboard />
      <StreamCarousel />
      <TrendingSearches />
      <FeaturedColleges />
      <Differentiators />
    </div>
  );
}
