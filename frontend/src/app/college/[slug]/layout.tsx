import { Metadata } from 'next';
import { api } from '@/lib/api';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const college = await api.colleges.getById(slug);
    if (!college) {
      return {
        title: 'College Not Found | Campiq',
      };
    }

    const title = `${college.name} - Admissions, Fees, Placements 2024 | Campiq`;
    const description = `Get detailed information about ${college.name}, ${college.city}. Check 2024 fees, placement statistics, NIRF ranking, courses offered, and campus facilities.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    };
  } catch (e) {
    return {
      title: 'College Details | Campiq',
    };
  }
}

export default function CollegeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
