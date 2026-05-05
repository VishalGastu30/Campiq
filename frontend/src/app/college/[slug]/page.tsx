'use client';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { College } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { SkeletonLoader } from '@/components/ui/Skeleton';
import { formatFees, formatLPA, getInitials } from '@/lib/utils';
import { MapPin, Globe, Phone, Mail, Award, CheckCircle, GraduationCap, Trophy, Bookmark, PlusCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompare } from '@/context/CompareContext';
import { useAuth } from '@/context/AuthContext';
import { AISummaryCard } from '@/components/college/AISummaryCard';
import { PlacementChart } from '@/components/college/PlacementChart';
import { RelatedColleges } from '@/components/college/RelatedColleges';
import toast from 'react-hot-toast';

export default function CollegeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;
  
  const [college, setCollege] = useState<College | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'placements'>('overview');
  
  const { compareIds, addToCompare, removeFromCompare } = useCompare();
  const { user, token } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  const inCompare = college ? compareIds.includes(college.id) : false;

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const data = await api.colleges.getById(slug);
        if (!data) {
          notFound();
        } else {
          setCollege(data);
          
          // Check saved status
          if (user && token) {
            const saved = await api.saved.getAll(token);
            setIsSaved(saved.some(s => s.collegeId === data.id));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollege();
  }, [slug, user, token]);

  const handleSaveToggle = async () => {
    if (!user || !token || !college) {
      toast.error('Please login to save colleges');
      return;
    }
    try {
      if (isSaved) {
        await api.saved.remove(token, college.id);
        setIsSaved(false);
        toast.success('Removed from saved');
      } else {
        await api.saved.save(token, college.id);
        setIsSaved(true);
        toast.success('College saved');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to update status');
    }
  };

  const handleCompareToggle = () => {
    if (!college) return;
    if (inCompare) {
      removeFromCompare(college.id);
    } else {
      addToCompare(college.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-campiq-base pb-24">
        {/* Hero Section Skeleton */}
        <div className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-campiq-surface border border-campiq-border shadow-lg">
            <div className="h-48 md:h-64 bg-campiq-raised animate-pulse" />
            <div className="px-6 md:px-12 pb-8 pt-0 relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 md:-mt-20">
              <div className="h-32 w-32 shrink-0 rounded-2xl bg-campiq-raised border-4 border-campiq-base shadow-xl animate-pulse" />
              <div className="flex-1 min-w-0 pt-4 md:pt-0 w-full">
                <div className="flex gap-2 mb-3">
                  <SkeletonLoader width={80} height={24} borderRadius={999} />
                  <SkeletonLoader width={100} height={24} borderRadius={999} />
                </div>
                <SkeletonLoader width="60%" height={36} className="mb-3" />
                <div className="flex gap-4">
                  <SkeletonLoader width={120} height={20} />
                  <SkeletonLoader width={140} height={20} />
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                <SkeletonLoader width={140} height={40} borderRadius={8} />
                <SkeletonLoader width={120} height={40} borderRadius={8} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 border-b border-campiq-border">
            <div className="flex space-x-8 pb-4">
              <SkeletonLoader width={80} height={20} />
              <SkeletonLoader width={80} height={20} />
              <SkeletonLoader width={80} height={20} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <SkeletonLoader width={200} height={28} className="mb-4" />
                <div className="bg-campiq-surface border border-campiq-border rounded-2xl p-6">
                  <SkeletonLoader count={4} />
                </div>
              </section>
              <section>
                <SkeletonLoader width={250} height={28} className="mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <SkeletonLoader height={100} borderRadius={12} />
                  <SkeletonLoader height={100} borderRadius={12} />
                  <SkeletonLoader height={100} borderRadius={12} />
                  <SkeletonLoader height={100} borderRadius={12} />
                </div>
              </section>
            </div>
            
            <div className="space-y-6">
              <div className="bg-campiq-surface border border-campiq-border rounded-2xl overflow-hidden">
                <div className="bg-campiq-raised px-6 py-4 border-b border-campiq-border">
                  <SkeletonLoader width={100} height={20} />
                </div>
                <div className="p-6 space-y-5">
                  <div><SkeletonLoader width="40%" height={16} className="mb-2"/><SkeletonLoader width="70%" height={20} /></div>
                  <div><SkeletonLoader width="30%" height={16} className="mb-2"/><SkeletonLoader width="50%" height={20} /></div>
                  <div><SkeletonLoader width="50%" height={16} className="mb-2"/><SkeletonLoader width="40%" height={20} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!college) return null;

  return (
    <div className="min-h-screen bg-campiq-base pb-24">
      {/* Hero Section */}
      <div className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-campiq-surface border border-campiq-border shadow-lg">
          {/* Banner Fallback */}
          <div className="h-48 md:h-64 bg-gradient-sig opacity-40 relative">
            <div className="absolute inset-0 bg-campiq-base/30 backdrop-blur-3xl mix-blend-overlay" />
          </div>
          
          <div className="px-6 md:px-12 pb-8 pt-0 relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 md:-mt-20">
            {/* Logo */}
            <div className="h-24 w-24 md:h-32 md:w-32 shrink-0 rounded-2xl bg-campiq-surface border-4 border-campiq-base shadow-xl flex items-center justify-center text-3xl md:text-4xl font-bold text-campiq-teal">
              {getInitials(college.name)}
            </div>
            
            <div className="flex-1 min-w-0 pt-4 md:pt-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                {college.nirfRank && <Badge variant="amber">NIRF #{college.nirfRank}</Badge>}
                {college.naacGrade && <Badge variant="violet">NAAC {college.naacGrade}</Badge>}
                <Badge variant="default">{college.type}</Badge>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-campiq-text-primary mb-2 line-clamp-2">
                {college.name}
              </h1>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-campiq-text-secondary">
                <span className="flex items-center gap-1.5"><MapPin size={16} /> {college.city}, {college.state}</span>
                <span className="flex items-center gap-1.5"><StarRating rating={college.rating || 0} /> ({college.totalRatings || 0} reviews)</span>
                {college.establishedYear && <span className="flex items-center gap-1.5"><Award size={16} /> Est. {college.establishedYear}</span>}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto mt-4 md:mt-0">
              <Button 
                variant={isSaved ? "secondary" : "primary"}
                onClick={handleSaveToggle}
                className="flex-1 md:flex-none"
              >
                <Bookmark size={18} className="mr-2" fill={isSaved ? "currentColor" : "none"} />
                {isSaved ? "Saved" : "Save College"}
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleCompareToggle}
                className="flex-1 md:flex-none"
              >
                {inCompare ? <Check size={18} className="mr-2 text-campiq-teal" /> : <PlusCircle size={18} className="mr-2" />}
                Compare
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sticky Tabs */}
        <div className="sticky top-16 z-30 bg-campiq-base/80 backdrop-blur-xl border-b border-campiq-border mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <nav className="flex space-x-8 overflow-x-auto hide-scrollbar" aria-label="Tabs">
            {['overview', 'courses', 'placements'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`
                  relative py-4 px-1 text-sm font-medium whitespace-nowrap transition-colors outline-none
                  ${activeTab === tab ? 'text-campiq-teal' : 'text-campiq-text-secondary hover:text-campiq-text-primary'}
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-campiq-teal"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (Main Content based on tab) */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <section>
                      <h2 className="text-xl font-bold text-campiq-text-primary mb-4">About {getInitials(college.name)}</h2>
                      <div className="bg-campiq-surface border border-campiq-border rounded-2xl p-6 text-campiq-text-secondary leading-relaxed">
                        {college.about}
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-campiq-text-primary mb-4">Accreditations & Approvals</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-campiq-surface border border-campiq-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                          <CheckCircle className={college.ugcApproved ? "text-campiq-teal mb-2" : "text-campiq-text-muted mb-2"} size={28} />
                          <span className="text-sm font-medium text-campiq-text-primary">UGC Approved</span>
                        </div>
                        <div className="bg-campiq-surface border border-campiq-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                          <CheckCircle className={college.aiuMember ? "text-campiq-teal mb-2" : "text-campiq-text-muted mb-2"} size={28} />
                          <span className="text-sm font-medium text-campiq-text-primary">AIU Member</span>
                        </div>
                        {college.naacGrade && (
                          <div className="bg-campiq-surface border border-campiq-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                            <span className="text-2xl font-bold text-campiq-violet mb-1">{college.naacGrade}</span>
                            <span className="text-sm font-medium text-campiq-text-primary">NAAC Grade</span>
                          </div>
                        )}
                        {college.nirfRank && (
                          <div className="bg-campiq-surface border border-campiq-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                            <span className="text-2xl font-bold text-campiq-amber mb-1">#{college.nirfRank}</span>
                            <span className="text-sm font-medium text-campiq-text-primary">NIRF Rank</span>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* AI Summary */}
                    <AISummaryCard collegeId={college.id} existingSummary={(college as any).aiSummary} />
                  </div>
                )}

                {/* COURSES TAB */}
                {activeTab === 'courses' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-bold text-campiq-text-primary">Programs Offered</h2>
                      <Badge variant="teal">{(college.courses || []).length} Courses</Badge>
                    </div>
                    
                    <div className="overflow-x-auto rounded-2xl border border-campiq-border bg-campiq-surface shadow-sm">
                      <table className="w-full text-left text-sm text-campiq-text-secondary whitespace-nowrap">
                        <thead className="bg-campiq-raised text-campiq-text-primary uppercase text-xs">
                          <tr>
                            <th className="px-6 py-4 font-semibold">Course Name</th>
                            <th className="px-6 py-4 font-semibold">Duration</th>
                            <th className="px-6 py-4 font-semibold">Annual Fees</th>
                            <th className="px-6 py-4 font-semibold">Seats</th>
                            <th className="px-6 py-4 font-semibold">Eligibility</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-campiq-border">
                          {(college.courses || []).map(course => (
                            <tr key={course.id} className="hover:bg-campiq-raised/50 transition-colors">
                              <td className="px-6 py-4">
                                <p className="font-medium text-campiq-text-primary mb-1">{course.name}</p>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-campiq-base border border-campiq-border">{course.degree}</span>
                              </td>
                              <td className="px-6 py-4">{course.duration} Years</td>
                              <td className="px-6 py-4 font-medium text-campiq-teal">{formatFees(course.fees)}</td>
                              <td className="px-6 py-4">{course.seats || 'N/A'}</td>
                              <td className="px-6 py-4 text-xs">{course.eligibility || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* PLACEMENTS TAB */}
                {activeTab === 'placements' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-campiq-surface border border-campiq-border rounded-2xl p-6 text-center">
                        <p className="text-sm font-medium text-campiq-text-muted mb-2 uppercase tracking-wide">Placement Rate</p>
                        <p className="text-3xl md:text-4xl font-bold text-campiq-teal">{college.placementPercent || 'N/A'}%</p>
                      </div>
                      <div className="bg-campiq-surface border border-campiq-border rounded-2xl p-6 text-center">
                        <p className="text-sm font-medium text-campiq-text-muted mb-2 uppercase tracking-wide">Avg Package</p>
                        <p className="text-3xl md:text-4xl font-bold text-campiq-text-primary">{formatLPA(college.avgPackage)}</p>
                      </div>
                      <div className="bg-campiq-surface border border-campiq-border rounded-2xl p-6 text-center">
                        <p className="text-sm font-medium text-campiq-text-muted mb-2 uppercase tracking-wide">Highest Package</p>
                        <p className="text-3xl md:text-4xl font-bold text-campiq-amber">{college.highestPackage ? `₹${college.highestPackage} Cr` : 'N/A'}</p>
                      </div>
                    </div>

                    <section>
                      <h2 className="text-xl font-bold text-campiq-text-primary mb-4 flex items-center gap-2"><Trophy className="text-campiq-amber" /> Top Recruiters</h2>
                      <div className="flex flex-wrap gap-3 bg-campiq-surface border border-campiq-border p-6 rounded-2xl">
                        {college.topRecruiters.map(recruiter => (
                          <div key={recruiter} className="px-4 py-2 rounded-lg bg-campiq-raised border border-campiq-border text-campiq-text-primary font-medium flex items-center gap-2 hover:border-campiq-teal/50 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-campiq-teal" />
                            {recruiter}
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Placement Trend Chart */}
                    <PlacementChart collegeId={college.id} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6 lg:sticky lg:top-36">
            {/* Quick Facts Card */}
            <div className="bg-campiq-surface border border-campiq-border rounded-2xl overflow-hidden">
              <div className="bg-campiq-raised px-6 py-4 border-b border-campiq-border">
                <h3 className="font-bold text-campiq-text-primary">Quick Facts</h3>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-sm text-campiq-text-muted mb-1">Fees Range (Annual)</p>
                  <p className="font-medium text-campiq-text-primary">{formatFees(college.minFees)} - {formatFees(college.maxFees)}</p>
                </div>
                <div>
                  <p className="text-sm text-campiq-text-muted mb-1">Total Courses</p>
                  <p className="font-medium text-campiq-text-primary flex items-center gap-2">
                    <GraduationCap size={16} className="text-campiq-teal" /> {(college.courses || []).length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-campiq-text-muted mb-1">Institution Type</p>
                  <p className="font-medium text-campiq-text-primary capitalize">{college.type.toLowerCase()}</p>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-campiq-surface border border-campiq-border rounded-2xl overflow-hidden">
              <div className="bg-campiq-raised px-6 py-4 border-b border-campiq-border">
                <h3 className="font-bold text-campiq-text-primary">Contact Info</h3>
              </div>
              <div className="p-6 space-y-4">
                {college.website && (
                  <a href={college.website} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-campiq-text-secondary hover:text-campiq-teal transition-colors group">
                    <Globe size={18} className="mt-0.5 group-hover:text-campiq-teal" />
                    <span className="text-sm break-all">{college.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
                {college.phone && (
                  <div className="flex items-start gap-3 text-campiq-text-secondary">
                    <Phone size={18} className="mt-0.5" />
                    <span className="text-sm">{college.phone}</span>
                  </div>
                )}
                {college.email && (
                  <div className="flex items-start gap-3 text-campiq-text-secondary">
                    <Mail size={18} className="mt-0.5" />
                    <span className="text-sm break-all">{college.email}</span>
                  </div>
                )}
                {college.address && (
                  <div className="flex items-start gap-3 text-campiq-text-secondary pt-2 border-t border-campiq-border">
                    <MapPin size={18} className="mt-0.5 shrink-0" />
                    <span className="text-sm">{college.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Colleges */}
        <div className="mt-12">
          <RelatedColleges collegeId={college.id} />
        </div>
      </div>
    </div>
  );
}
