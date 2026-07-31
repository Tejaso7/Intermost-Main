'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Users, 
  Award, 
  Globe, 
  Building, 
  CheckCircle,
  Phone,
  MapPin,
  ExternalLink,
  Mail,
  Linkedin,
  Twitter,
  Sparkles
} from 'lucide-react';
import { teamApi, coreApi } from '@/lib/services';
import AboutStats from '@/components/about/AboutStats';

const values = [
  {
    icon: Award,
    title: 'Quality Education',
    description: 'We partner only with NMC & WHO approved universities to ensure quality education.',
  },
  {
    icon: Users,
    title: 'Student-First Approach',
    description: 'Your success is our priority. We provide end-to-end support throughout your journey.',
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Strategic offices in UAE, India, Georgia, Ukraine and Uzbekistan.',
  },
  {
    icon: Building,
    title: 'Transparent Process',
    description: 'No hidden fees, clear documentation, and honest guidance at every step.',
  },
];

const organizations = [
  { country: 'India', name: 'Intermost Ventures LLP (Agra)' },
  { country: 'UAE', name: 'Ekam Marketing and Innovation Solutions FZ-LLC' },
  { country: 'Georgia', name: 'DSA-ISM Joint Venture LLC' },
  { country: 'Ukraine', name: 'PE "Intermost" Company' },
  { country: 'Uzbekistan', name: 'KONARK PHARM LLC FE' },
];

const fallbackTeamMembers = [
  {
    name: 'Mr. Nilesh Kulkarni',
    role: 'President of Intermost India',
    description: 'Study Abroad President with expertise in European universities.',
    phone: '+91 91583 74434',
    email: 'nilesh@intermost.in',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  },
  {
    name: 'Mr. Vinay Singh',
    role: 'Uttar Pradesh Head, India',
    description: 'Education Consultant specializing in international student admissions.',
    phone: '+91 90585 01818',
    email: 'vinay@intermost.in',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  },
  {
    name: 'Dr. Nikhil Chauhan',
    role: 'Punjab - Himachal Pradesh Head',
    description: 'Medical Career Advisor with 10+ years of experience.',
    phone: '+91 98880 13647',
    email: 'nikhil@intermost.in',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  },
  {
    name: 'Dr. Mohit Gurra',
    role: 'Haryana Head, India',
    description: 'Career Development Specialist for STEM fields.',
    phone: '+91 88140 47009',
    email: 'mohit@intermost.in',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  },
  {
    name: 'Dr. Dibya Giri Ranjan',
    role: 'Odisha Head, India',
    description: 'Career Development Specialist for STEM fields.',
    phone: '+91 97763 63007',
    email: 'dibya@intermost.in',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  },
  {
    name: 'Dr. Nilutpal Mondal',
    role: 'West Bengal Head, India',
    description: 'Career Development Specialist for STEM fields.',
    phone: '+91 96352 20301',
    email: 'nilutpal@intermost.in',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  },
  {
    name: 'Dr. Rahul Gautam',
    role: 'Delhi - NCR Head, India',
    description: 'Career Development Specialist for STEM fields.',
    phone: '+91 98375 33887',
    email: 'rahul@intermost.in',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  },
];

const fallbackOffices = [
  {
    title: 'Head Office - UAE',
    company: 'Ekam Marketing and Innovation Solutions FZ-LLC',
    address: 'Business Center 1, M Floor, The Meydan Hotel, Nad Al Sheba, Dubai, UAE',
    phone: '+971 542183166',
    email: 'admissionintermost@gmail.com',
  },
  {
    title: 'India Head Office',
    company: 'Intermost Ventures LLP',
    address: 'Shop no -1, First floor, Vinayak Mall, Deewani Crossing (Lotus Hospital Building), M G Road Agra, 282002 (U.P), India',
    phone: '+91 9058501818',
    email: 'admissionintermost@gmail.com',
  },
  {
    title: 'India Delhi Office',
    company: 'Intermost Ventures LLP',
    address: '3 G.F., B.D Chamber, 10/54, Desh Bandhu Gupta Road, Karol Bagh, New Delhi - 110005',
    phone: '+91 9837533887',
    email: 'admissionintermost@gmail.com',
  },
  {
    title: 'India Kerala Office',
    company: 'Intermost Ventures LLP',
    address: 'C/O KlickEdu, 1st Floor, MS Building, behind New Theatre, Aristo, Thampanoor, Thiruvananthapuram, Kerala, 695012',
    phone: '+91 8111996000',
    email: 'admissionintermost@gmail.com',
  },
  {
    title: 'India Jodhpur Office',
    company: 'Intermost Ventures LLP',
    address: 'C/O H.K.Hi-Tech College 4-7, Above Reliance Smart Point, Main PAL Road Jodhpur-342008',
    phone: '+91 6367644472',
    email: 'admissionintermost@gmail.com',
  },
];

export default function AboutPage() {
  const [teamMembersList, setTeamMembersList] = useState<any[]>(fallbackTeamMembers);
  const [officesList, setOfficesList] = useState<any[]>(fallbackOffices);
  const [aboutImages, setAboutImages] = useState<string[]>(['/images/about.jpg']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedTeam, fetchedOffices, settings] = await Promise.all([
          teamApi.getAll().catch(() => null),
          teamApi.getOffices().catch(() => null),
          coreApi.getSettings().catch(() => null),
        ]);

        if (fetchedTeam && fetchedTeam.length > 0) {
          setTeamMembersList(fetchedTeam.filter((m: any) => m.is_active !== false));
        }
        if (fetchedOffices && fetchedOffices.length > 0) {
          setOfficesList(fetchedOffices.filter((o: any) => o.is_active !== false));
        }
        if (settings && settings.about_images && settings.about_images.length > 0) {
          setAboutImages(settings.about_images);
        }
      } catch (error) {
        console.debug('Failed to fetch data for AboutPage', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container-custom relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/20 text-white mb-6">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              Empowering Future Doctors
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              About Intermost Ventures
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed font-light">
              Your trusted partner for MBBS education abroad. Connecting aspiring doctors with world-class medical institutions across the globe.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <AboutStats />

      {/* Story & Mission Section */}
      <section className="py-20 bg-gray-50/70">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                At Intermost Ventures, we&apos;re committed to transforming medical education by connecting aspiring doctors with world-class institutions. Our mission is to empower the next generation of healthcare professionals through accessible, high-quality global education.
              </p>

              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                To be the premier gateway for medical education abroad, recognized for our integrity, expertise, and commitment to student success in the global healthcare community.
              </p>

              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Global Presence</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                With strategic offices in UAE, India, Georgia, Ukraine and Uzbekistan, we serve students across South Asia, Middle East, and Africa, providing end-to-end support for their medical education journey.
              </p>

              {/* Organization Details */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-primary-900 mb-4">Our Global Entities</h3>
                <div className="space-y-3">
                  {organizations.map((org) => (
                    <div key={org.country} className="flex items-start border-b border-gray-100 pb-2.5 last:border-0">
                      <span className="font-bold text-primary-700 w-24 shrink-0">{org.country}</span>
                      <span className="text-gray-700 text-sm">{org.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4">
                  <a href="https://www.intermost.eu" target="_blank" rel="noopener noreferrer" className="flex items-center text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                    intermost.eu
                  </a>
                  <a href="https://www.intermost.in" target="_blank" rel="noopener noreferrer" className="flex items-center text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                    intermost.in
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Image Grid with Responsive Heights (Fixed h-96 Removed!) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-[380px]"
            >
              {aboutImages.length === 1 ? (
                <div className="sm:col-span-2 relative min-h-[360px] md:min-h-[420px] rounded-3xl overflow-hidden shadow-xl border border-gray-100 group">
                  <Image
                    src={aboutImages[0]}
                    alt="Intermost Ventures Team"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ) : aboutImages.length === 2 ? (
                aboutImages.map((img, idx) => (
                  <div key={idx} className="relative min-h-[280px] md:min-h-[360px] rounded-3xl overflow-hidden shadow-xl border border-gray-100 group">
                    <Image
                      src={img}
                      alt={`Intermost Ventures Team ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ))
              ) : (
                <>
                  <div className="sm:row-span-2 relative min-h-[280px] sm:min-h-[420px] rounded-3xl overflow-hidden shadow-xl border border-gray-100 group">
                    <Image
                      src={aboutImages[0]}
                      alt="Intermost Ventures Team 1"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-4 flex flex-col justify-between">
                    {aboutImages.slice(1, 3).map((img, idx) => (
                      <div key={idx} className="relative flex-1 min-h-[180px] rounded-3xl overflow-hidden shadow-xl border border-gray-100 group">
                        <Image
                          src={img}
                          alt={`Intermost Ventures Team ${idx + 2}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The core principles that guide our commitment to every medical aspirant
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-gray-50/80 border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                  <value.icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50/70">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              End-to-end guidance and support at every step of your international medical education
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Free Career Counseling',
              'University Selection',
              'Admission Processing',
              'Visa Assistance',
              'Travel Arrangements',
              'Accommodation Support',
              'Pre-Departure Orientation',
              'On-Campus Support',
              'FMGE/NEXT Coaching Support',
            ].map((service, idx) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ x: 4 }}
                className="flex items-center p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <CheckCircle className="w-6 h-6 text-green-500 mr-3.5 flex-shrink-0" aria-hidden="true" />
                <span className="font-semibold text-gray-900 text-sm sm:text-base">{service}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section with Social Links */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Meet Our Leadership Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experienced advisors and regional heads dedicated to guiding your medical study abroad path
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembersList.map((member: any, idx: number) => (
              <motion.div
                key={member._id || member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -8 }}
                className="bg-gray-50/80 border border-gray-100 rounded-3xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors overflow-hidden relative shadow-inner">
                  {member.photo ? (
                    <Image src={member.photo} alt={member.name} fill className="object-cover" />
                  ) : (
                    <Users className="w-10 h-10 text-primary-600" aria-hidden="true" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-primary-600 text-xs font-bold uppercase tracking-wider mb-2">
                  {member.designation || member.role}
                </p>
                <p className="text-gray-600 text-xs mb-4 line-clamp-3 leading-relaxed flex-grow">
                  {member.bio || member.specialization || member.description}
                </p>

                {/* Social & Contact Links */}
                <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-200/60 mt-auto">
                  {member.phone && (
                    <a 
                      href={`tel:${member.phone.replace(/\s/g, '')}`} 
                      aria-label={`Call ${member.name}`}
                      className="w-8 h-8 rounded-full bg-white hover:bg-primary-600 text-gray-600 hover:text-white flex items-center justify-center border border-gray-200 shadow-sm transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  )}
                  <a 
                    href={`mailto:${member.email || 'admissionintermost@gmail.com'}`}
                    aria-label={`Email ${member.name}`}
                    className="w-8 h-8 rounded-full bg-white hover:bg-primary-600 text-gray-600 hover:text-white flex items-center justify-center border border-gray-200 shadow-sm transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                  <a 
                    href={member.linkedin || 'https://linkedin.com'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="w-8 h-8 rounded-full bg-white hover:bg-blue-600 text-gray-600 hover:text-white flex items-center justify-center border border-gray-200 shadow-sm transition-all"
                  >
                    <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                  <a 
                    href={member.twitter || 'https://twitter.com'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on Twitter`}
                    className="w-8 h-8 rounded-full bg-white hover:bg-sky-500 text-gray-600 hover:text-white flex items-center justify-center border border-gray-200 shadow-sm transition-all"
                  >
                    <Twitter className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices Section with Interactive Map Links */}
      <section className="py-20 bg-gray-50/70">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Our Offices</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visit us for personalized counseling at any of our offices across India and UAE
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {officesList.map((office: any, idx: number) => (
              <motion.div 
                key={office._id || office.title || office.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{office.title || office.name}</h3>
                  <p className="text-primary-600 text-xs font-semibold uppercase tracking-wider mb-4">{office.company || office.company_name}</p>
                  <div className="space-y-3 text-gray-600 text-sm">
                    <p className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2.5 mt-0.5 text-primary-600 flex-shrink-0" aria-hidden="true" />
                      <span className="leading-relaxed">{office.address}</span>
                    </p>
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2.5 text-primary-600 flex-shrink-0" aria-hidden="true" />
                      <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="hover:text-primary-600 font-medium">
                        {office.phone}
                      </a>
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-2.5 text-primary-600 flex-shrink-0" aria-hidden="true" />
                      <a href={`mailto:${office.email}`} className="hover:text-primary-600 font-medium truncate">
                        {office.email}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg"
                  >
                    <MapPin className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                    View on Google Maps
                    <ExternalLink className="w-3 h-3 ml-1" aria-hidden="true" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-900 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Ready to Start Your MBBS Journey?
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              Take the first step towards your medical dream. Our expert counselors are ready to assist you through university selection, application, and visa processing.
            </p>
            <Link 
              href="/apply" 
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold py-3.5 px-8 rounded-full hover:bg-primary-50 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <span>Apply Now</span>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
