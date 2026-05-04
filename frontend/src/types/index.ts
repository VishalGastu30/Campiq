export type CollegeType = 'PRIVATE' | 'GOVERNMENT' | 'DEEMED' | 'CENTRAL';

export type Stream = 'ENGINEERING' | 'MANAGEMENT' | 'MEDICAL' | 'LAW' | 'ARTS' | 'SCIENCE' | 'COMMERCE' | 'DESIGN' | 'PHARMACY' | 'AGRICULTURE';

export interface Course {
  id: string;
  name: string;
  shortName?: string | null;
  degree: string;
  duration: number;
  fees: number | null;
  seats: number | null;
  eligibility?: string | null;
  stream: Stream;
  collegeId?: string;
}

export interface College {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  city: string;
  state: string;
  type: CollegeType;
  establishedYear: number | null;
  nirfRank: number | null;
  nirfScore: number | null;
  naacGrade: string | null;
  affiliatedTo: string | null;
  minFees: number | null;
  maxFees: number | null;
  placementPercent: number | null;
  avgPackage: number | null;
  highestPackage: number | null;
  topRecruiters: string[];
  examsAccepted: string[];
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  pincode: string | null;
  imageUrl: string | null;
  logoUrl: string | null;
  about: string | null;
  highlights: string[];
  streams: Stream[];
  totalStudents: number | null;
  totalFaculty: number | null;
  campusArea: number | null;
  rating?: number;
  totalRatings?: number;
  ugcApproved?: boolean;
  aiuMember?: boolean;
  courses?: Course[];
  reviews?: Review[];
  _count?: { savedByUsers: number };
}

export interface Review {
  id: string;
  userId: string;
  collegeId: string;
  rating: number;
  title: string | null;
  body: string | null;
  pros: string[];
  cons: string[];
  createdAt: string;
  user?: { name: string };
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
  streams: Stream[];
  types: CollegeType[];
  feeRanges: { label: string, min: number, max: number | null }[];
}
