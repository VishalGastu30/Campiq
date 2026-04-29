export type CollegeType = 'PRIVATE' | 'GOVERNMENT' | 'DEEMED' | 'AUTONOMOUS';

export interface Course {
  id: string;
  name: string;
  degree: string;
  duration: number;
  fees: number;
  seats: number | null;
  category: string;
  eligibility: string | null;
}

export interface College {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  location: string;
  city: string;
  state: string;
  type: CollegeType;
  establishedYear: number;
  rating: number;
  totalRatings: number;
  minFees: number;
  maxFees: number;
  nirfRank: number | null;
  naacGrade: string | null;
  placementPercent: number | null;
  avgPackage: number | null;
  highestPackage: number | null;
  topRecruiters: string[];
  about: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  ugcApproved: boolean;
  aiuMember: boolean;
  courses: Course[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SavedCollege {
  id: string;
  collegeId: string;
  savedAt: string;
  college: College;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FilterMeta {
  states: string[];
  courseCategories: string[];
  types: CollegeType[];
}
