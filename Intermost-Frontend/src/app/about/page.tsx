import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Users, 
  Award, 
  Globe, 
  Building, 
  CheckCircle,
  Phone,
  MapPin,
  ExternalLink,
  Mail
} from 'lucide-react';
import { coreApi, teamApi } from '@/lib/services';

export const metadata: Metadata = {
  title: 'About Us - Intermost Ventures | Your Trusted MBBS Consultant',
  description: 'Learn about Intermost Ventures - Your gateway for medical education abroad with strategic offices in UAE, India, Georgia, Ukraine and Uzbekistan.',
};

// Initial fallback stats
let stats = [
  { value: '5500+', label: 'Students Placed', key: 'students_placed' },
  { value: '35+', label: 'Partner Universities', key: 'partner_universities' },
  { value: '21+', label: 'Years Experience', key: 'years_experience' },
  { value: '99%', label: 'Visa Success Rate', key: 'visa_success_rate' },
];

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

const teamMembers = [
  {
    name: 'Mr. Nilesh Kulkarni',
    role: 'President of Intermost India',
    description: 'Study Abroad President with expertise in European universities.',
    phone: '+91 91583 74434',
  },
  {
    name: 'Mr. Vinay Singh',
    role: 'Uttar Pradesh Head, India',
    description: 'Education Consultant specializing in international student admissions.',
    phone: '+91 90585 01818',
  },
  {
    name: 'Dr. Nikhil Chauhan',
    role: 'Punjab - Himachal Pradesh Head',
    description: 'Medical Career Advisor with 10+ years of experience.',
    phone: '+91 98880 13647',
  },
  {
    name: 'Dr. Mohit Gurra',
    role: 'Haryana Head, India',
    description: 'Career Development Specialist for STEM fields.',
    phone: '+91 88140 47009',
  },
  {
    name: 'Dr. Dibya Giri Ranjan',
    role: 'Odisha Head, India',
    description: 'Career Development Specialist for STEM fields.',
    phone: '+91 97763 63007',
  },
  {
    name: 'Dr. Nilutpal Mondal',
    role: 'West Bengal Head, India',
    description: 'Career Development Specialist for STEM fields.',
    phone: '+91 96352 20301',
  },
  {
    name: 'Dr. Rahul Gautam',
    role: 'Delhi - NCR Head, India',
    description: 'Career Development Specialist for STEM fields.',
    phone: '+91 98375 33887',
  },
];

const offices = [
  {
    title: 'Head Office - UAE',
    company: 'Ekam Marketing and Innovation Solutions FZ-LLC',
    address: 'UAE',
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

export default async function AboutPage() {
  let teamMembersList: any[] = teamMembers;
  let officesList: any[] = offices;

  try {
    const settings = await coreApi.getSettings();
    if (settings?.stats) {
      stats = [
        { value: `${settings.stats.students_placed}+`, label: 'Students Placed', key: 'students_placed' },
        { value: `${settings.stats.partner_universities}+`, label: 'Partner Universities', key: 'partner_universities' },
        { value: `${settings.stats.years_experience}+`, label: 'Years Experience', key: 'years_experience' },
        { value: `${settings.stats.visa_success_rate}%`, label: 'Visa Success Rate', key: 'visa_success_rate' },
      ];
    }

    const [fetchedTeam, fetchedOffices] = await Promise.all([
      teamApi.getAll(),
      teamApi.getOffices(),
    ]);

    if (fetchedTeam && fetchedTeam.length > 0) {
      teamMembersList = fetchedTeam.filter((m: any) => m.is_active !== false);
    }
    if (fetchedOffices && fetchedOffices.length > 0) {
      officesList = fetchedOffices.filter((o: any) => o.is_active !== false);
    }
  } catch (error) {
    console.debug('Failed to fetch data for AboutPage', error);
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Intermost Ventures</h1>
            <p className="text-xl text-primary-100">
              Your trusted partner for MBBS education abroad. 
              Connecting aspiring doctors with world-class institutions across the globe.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white -mt-10 relative z-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-2xl shadow-xl p-8">
            {stats.map((stat) => (
              <div key={stat.key} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600">
                  {stat.value}
                </div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                At Intermost Ventures, we&apos;re committed to transforming medical education 
                by connecting aspiring doctors with world-class institutions. Our mission 
                is to empower the next generation of healthcare professionals through 
                accessible, high-quality global education.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-gray-600 mb-6">
                To be the premier gateway for medical education abroad, recognized for 
                our integrity, expertise, and commitment to student success in the global 
                healthcare community.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">Global Presence</h2>
              <p className="text-gray-600 mb-6">
                With strategic offices in UAE, India, Georgia, Ukraine and Uzbekistan, 
                we serve students across South Asia, Middle East, and Africa, providing 
                end-to-end support for their medical education journey.
              </p>

              {/* Organization Details */}
              <div className="bg-primary-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-primary-800 mb-4">Our Global Entities</h3>
                <div className="space-y-3">
                  {organizations.map((org) => (
                    <div key={org.country} className="flex items-start border-b border-primary-100 pb-2 last:border-0">
                      <span className="font-semibold text-primary-700 w-24">{org.country}</span>
                      <span className="text-gray-700">{org.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-primary-100 flex gap-4">
                  <a href="https://www.intermost.eu" target="_blank" rel="noopener noreferrer" className="flex items-center text-primary-600 hover:text-primary-800">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    intermost.eu
                  </a>
                  <a href="https://www.intermost.in" target="_blank" rel="noopener noreferrer" className="flex items-center text-primary-600 hover:text-primary-800">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    intermost.in
                  </a>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/about.jpg"
                alt="Intermost Ventures Team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive support at every step of your journey
            </p>
          </div>

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
              'FMGE/NEXT Coaching',
            ].map((service) => (
              <div
                key={service}
                className="flex items-center p-4 bg-white rounded-xl shadow-sm"
              >
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-900">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experienced professionals dedicated to helping you achieve your medical career goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembersList.map((member: any) => (
              <div
                key={member._id || member.name}
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors overflow-hidden relative">
                  {member.photo ? (
                    <Image src={member.photo} alt={member.name} fill className="object-cover" />
                  ) : (
                    <Users className="w-10 h-10 text-primary-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 text-sm font-medium mb-2">{member.designation || (member as any).role}</p>
                <p className="text-gray-600 text-sm mb-3">{member.bio || member.specialization || (member as any).description}</p>
                {member.phone && (
                  <a 
                    href={`tel:${member.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    {member.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Offices</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visit us at any of our offices across India and UAE
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {officesList.map((office: any) => (
              <div key={office._id || office.title || office.name} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-1">{office.title || office.name}</h3>
                <p className="text-primary-600 text-sm font-medium mb-3">{office.company || office.company_name}</p>
                <div className="space-y-3 text-gray-600 text-sm">
                  <p className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 mt-1 text-primary-600 flex-shrink-0" />
                    {office.address}
                  </p>
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-primary-600" />
                    <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="hover:text-primary-600">
                      {office.phone}
                    </a>
                  </p>
                  <p className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-primary-600" />
                    <a href={`mailto:${office.email}`} className="hover:text-primary-600">
                      {office.email}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-primary-100 mb-6 max-w-xl mx-auto">
              Take the first step towards your dream of becoming a doctor. 
              Our expert counselors are here to guide you through every step.
            </p>
            <Link href="/apply" className="inline-block bg-white text-primary-600 font-semibold py-3 px-8 rounded-full hover:bg-primary-50 transition-colors">
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
