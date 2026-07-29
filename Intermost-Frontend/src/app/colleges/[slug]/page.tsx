'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Award,
  BookOpen,
  ArrowLeft,
  CheckCircle,
  GraduationCap,
  ChevronRight,
  Shield,
  Layers,
  PhoneCall,
} from 'lucide-react';
import { collegesApi, coreApi } from '@/lib/services';
import type { College } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { createWhatsAppLink } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CollegeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('919058501818');

  useEffect(() => {
    const loadCollege = async () => {
      try {
        setLoading(true);
        const data = await collegesApi.getBySlug(slug);
        if (data) {
          setCollege(data);
        } else {
          toast.error('College not found');
          router.push('/countries');
        }
      } catch (error) {
        console.error('Error loading college details:', error);
        toast.error('Failed to load college details');
      } finally {
        setLoading(false);
      }
    };

    const loadSettings = async () => {
      try {
        const settings = await coreApi.getSettings();
        if (settings?.contact?.whatsapp) {
          setWhatsappNumber(settings.contact.whatsapp.replace(/[^0-9]/g, ''));
        }
      } catch (e) {
        console.debug('Failed to load whatsapp config', e);
      }
    };

    if (slug) {
      loadCollege();
      loadSettings();
    }
  }, [slug]);

  const handleApply = () => {
    if (!college) return;
    const link = createWhatsAppLink(
      whatsappNumber,
      `Hi! I'm interested in MBBS admission at ${college.name}. Please guide me on the admission process, eligibility, and fees.`
    );
    window.open(link, '_blank');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4" />
          <p className="text-sm font-semibold text-gray-500">Loading university details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!college) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 text-center p-6">
          <Building className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">College Not Found</h2>
          <p className="text-gray-500 mb-6">The requested medical university could not be located in our database.</p>
          <Link href="/countries" className="btn-primary">
            Browse Study Destinations
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // Fallbacks
  const bannerImage = college.banner_image || '/images/countries/russia.jpg';
  const logo = college.logo || '';
  const established = college.overview?.established_year || 'N/A';
  const description = college.overview?.short_description || 'No description available for this medical university.';
  const tuitionFee = college.fees?.tuition_fee_per_year || 'Contact for details';
  const hostelFee = college.fees?.hostel_fee_per_year || 'Contact for details';
  const totalPackage = college.fees?.total_package || 'Contact for details';
  const location = college.contact?.city || 'General';
  const worldRank = college.rankings?.world_rank || 'N/A';

  return (
    <>
      <Header />
      
      {/* College Banner Hero */}
      <section className="relative h-[45vh] min-h-[350px] flex items-end overflow-hidden bg-gray-900">
        <Image
          src={bannerImage}
          alt={college.name}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
        
        <div className="relative z-10 container-custom pb-8 text-white">
          <div className="max-w-4xl space-y-4">
            <Link
              href="/countries"
              className="inline-flex items-center gap-1 text-sm text-primary-300 hover:text-white transition-colors mb-2 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Study Destinations
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {logo ? (
                <div className="relative w-20 h-20 bg-white rounded-2xl p-2 shadow-xl shrink-0 overflow-hidden border border-white/20">
                  <Image
                    src={logo}
                    alt={`${college.name} logo`}
                    fill
                    className="object-contain p-1"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/20 shadow-xl">
                  <Building className="w-10 h-10 text-white" />
                </div>
              )}

              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-shadow-md leading-tight">
                  {college.name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary-400" />
                    {location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary-400" />
                    Est. {established}
                  </span>
                  {worldRank !== 'N/A' && (
                    <span className="flex items-center gap-1.5 bg-primary-500/20 text-primary-300 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                      World Rank: #{worldRank}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Area */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Overview, Approvals, Facilities */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Overview Card */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary-600" />
                  About the University
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>

              {/* Approval Badges */}
              {college.recognition && college.recognition.length > 0 && (
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary-600" />
                    Global Recognition & Approvals
                  </h3>
                  <p className="text-sm text-gray-500">
                    This university is fully certified and listed under leading international medical bodies:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {college.recognition.map((rec) => (
                      <div
                        key={rec.name}
                        className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-150 rounded-xl text-green-800 font-semibold text-sm transition-all"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                        <span>{rec.name} Approved</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities */}
              {college.facilities && college.facilities.length > 0 && (
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary-600" />
                    Campus & Student Facilities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {college.facilities.map((fac) => (
                      <div key={fac.name} className="flex items-start p-3 bg-gray-50 rounded-xl border border-gray-150">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center mr-3 shrink-0 text-primary-600">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm">{fac.name}</h4>
                          {fac.description && <p className="text-xs text-gray-500 mt-0.5">{fac.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Col: Pricing & CTA */}
            <div className="space-y-6">
              
              {/* Fee Structure Box */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary/10 text-primary px-4 py-1 text-xs font-bold uppercase rounded-bl-xl tracking-wider">
                  2026/27 Session
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                    <DollarSign className="w-5 h-5 text-primary-600" />
                    Fee Structure
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Approximate tuition & living expenses</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100 text-sm">
                    <span className="text-gray-500">Tuition Fee / Year</span>
                    <span className="font-semibold text-gray-800">{tuitionFee}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100 text-sm">
                    <span className="text-gray-500">Hostel & Mess / Year</span>
                    <span className="font-semibold text-gray-800">{hostelFee}</span>
                  </div>
                  {college.eligibility?.minimum_percentage && (
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 text-sm">
                      <span className="text-gray-500">Eligibility Minimum</span>
                      <span className="font-semibold text-gray-800">{college.eligibility.minimum_percentage}</span>
                    </div>
                  )}
                  
                  <div className="pt-2 bg-primary-50/50 rounded-xl p-4 border border-primary-100/50 text-center">
                    <p className="text-xs font-bold text-primary-600 uppercase tracking-wider">Total Package Cost</p>
                    <p className="text-2xl font-black text-primary-700 mt-1">{totalPackage}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Includes complete program duration tuition & lodging</p>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={handleApply}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-500/15 transition-all transform hover:scale-[1.01]"
                >
                  <PhoneCall className="w-5 h-5" />
                  Apply & Get Counselled
                </button>
              </div>

              {/* Quick Checklist */}
              <div className="bg-gray-900 rounded-2xl p-6 text-white space-y-4">
                <h4 className="font-bold text-base flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Intermost Direct Admission
                </h4>
                <ul className="space-y-2.5 text-xs text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span>Official university application processing & support.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span>Complete documentation, translation, and legalization help.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span>Proven track record of high student visa guidance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span>On-campus student reception & local support desk.</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
