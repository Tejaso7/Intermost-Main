'use client';

import { useState, useEffect } from 'react';
import { teamApi, coreApi } from '@/lib/services';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Building2,
  Globe,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getWhatsAppLink } from '@/lib/utils';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  countryCode: z.string().default('+91'),
  qualification: z.string().min(1, 'Please select your qualification'),
  destination: z.string().min(1, 'Please select your preferred destination'),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const offices = [
  {
    city: 'Agra (India Head Office)',
    company: 'Intermost Ventures LLP',
    address: 'Shop no -1, First floor, Vinayak Mall, Deewani Crossing (Lotus Hospital Building), M G Road Agra, 282002 (U.P), India',
    phone: '+91 9058501818',
    email: 'admissionintermost@gmail.com',
    hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
  },
  {
    city: 'UAE (Head Office)',
    company: 'Ekam Marketing and Innovation Solutions FZ-LLC',
    address: 'UAE',
    phone: '+971 542183166',
    email: 'admissionintermost@gmail.com',
    hours: 'Sun - Thu: 9:00 AM - 6:00 PM',
  },
  {
    city: 'Delhi',
    company: 'Intermost Ventures LLP',
    address: '3 G.F., B.D Chamber, 10/54, Desh Bandhu Gupta Road, Karol Bagh, New Delhi - 110005',
    phone: '+91 9837533887',
    email: 'admissionintermost@gmail.com',
    hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
  },
  {
    city: 'Kerala',
    company: 'Intermost Ventures LLP',
    address: 'C/O KlickEdu, 1st Floor, MS Building, behind New Theatre, Aristo, Thampanoor, Thiruvananthapuram, Kerala, 695012',
    phone: '+91 8111996000',
    email: 'admissionintermost@gmail.com',
    hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
  },
  {
    city: 'Jodhpur',
    company: 'Intermost Ventures LLP',
    address: 'C/O  H.K.Hi-Tech College 4-7, Above Reliance Smart Point, Main PAL Road Jodhpur-342008',
    phone: '+91 6367644472',
    email: 'admissionintermost@gmail.com',
    hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
  },
];

const faqs = [
  {
    question: 'How can I apply for MBBS abroad?',
    answer:
      'You can apply through our website by filling the application form or contact us directly. Our counselors will guide you through the entire process.',
  },
  {
    question: 'What are the eligibility criteria?',
    answer:
      '50% marks in PCB (Physics, Chemistry, Biology) in 12th grade and NEET qualification. For reserved categories, the criteria may vary.',
  },
  {
    question: 'Is NEET score mandatory?',
    answer:
      'Yes, NEET qualification is mandatory as per NMC (National Medical Commission) guidelines for Indian students studying MBBS abroad.',
  },
  {
    question: 'How long does the admission process take?',
    answer:
      'The complete admission process typically takes 2-4 weeks, including document verification, university application, and visa processing.',
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const [contactDetails, setContactDetails] = useState({
    phone: '+91 9058501818',
    email: 'admissionintermost@gmail.com',
    whatsapp: '+91 91583 74434',
  });

  const [officesList, setOfficesList] = useState<any[]>(offices);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [settings, fetchedOffices] = await Promise.all([
          coreApi.getSettings(),
          teamApi.getOffices(),
        ]);

        if (settings && settings.contact) {
          setContactDetails({
            phone: settings.contact.phone || '+91 9058501818',
            email: settings.contact.email || 'admissionintermost@gmail.com',
            whatsapp: settings.contact.whatsapp || '+91 91583 74434',
          });
        }

        if (fetchedOffices && fetchedOffices.length > 0) {
          const activeOffices = fetchedOffices.filter((o: any) => o.is_active !== false);
          const mapped = activeOffices.map((o: any) => ({
            city: o.name || `${o.city} Office`,
            company: o.company_name || 'Intermost Ventures',
            address: o.address,
            phone: o.phone,
            email: o.email || 'admissionintermost@gmail.com',
            hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
          }));
          setOfficesList(mapped);
        }
      } catch (err) {
        console.debug('Failed to fetch dynamic contact options', err);
      }
    };
    loadData();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Message sent successfully! We will contact you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary-600 via-primary-800 to-secondary-600">
        <div className="absolute inset-0 bg-black/30" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto px-4">
              Have questions about studying MBBS abroad? We're here to help you
              every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-12 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: Phone,
                title: 'Call Us',
                info: contactDetails.phone,
                link: `tel:${contactDetails.phone.replace(/\s/g, '')}`,
              },
              {
                icon: Mail,
                title: 'Email Us',
                info: contactDetails.email,
                link: `mailto:${contactDetails.email}`,
              },
              {
                icon: MessageCircle,
                title: 'WhatsApp',
                info: contactDetails.whatsapp,
                link: `https://wa.me/${contactDetails.whatsapp.replace(/\D/g, '')}`,
              },
              {
                icon: Clock,
                title: 'Working Hours',
                info: 'Mon-Sat: 10AM - 7PM',
                link: null,
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.link ? (
                  <a
                    href={item.link}
                    className="block bg-white rounded-xl shadow-lg p-4 md:p-6 text-center hover:shadow-xl transition-shadow h-full"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.info}</p>
                  </a>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 text-center h-full">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <item.icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">{item.info}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Send us a Message
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and our team will get back to you within
                24 hours.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-page-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="contact-page-name"
                      {...register('name')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact-page-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      id="contact-page-email"
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-page-phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="flex">
                      <div className="relative w-24">
                        <select
                          id="contact-page-country-code"
                          aria-label="Country Code"
                          {...register('countryCode')}
                          className="w-full pl-3 pr-7 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:ring-2 focus:ring-primary appearance-none cursor-pointer text-sm"
                        >
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+971">+971</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                      </div>
                      <input
                        id="contact-page-phone"
                        {...register('phone')}
                        type="tel"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="9876543210"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact-page-qualification" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Qualification *
                    </label>
                    <div className="relative">
                      <select
                        id="contact-page-qualification"
                        {...register('qualification')}
                        className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer text-sm"
                      >
                        <option value="">Select your qualification</option>
                        <option value="12th">12th Pass / Appearing</option>
                        <option value="bsc">BSc / Graduation</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                    </div>
                    {errors.qualification && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.qualification.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-page-destination" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Study Destination *
                  </label>
                  <div className="relative">
                    <select
                      id="contact-page-destination"
                      {...register('destination')}
                      className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer text-sm"
                    >
                      <option value="">Select your preferred destination</option>
                      <option value="uzbekistan">Uzbekistan</option>
                      <option value="georgia">Georgia</option>
                      <option value="nepal">Nepal</option>
                      <option value="tajikistan">Tajikistan</option>
                      <option value="russia">Russia</option>
                      <option value="kazakhstan">Kazakhstan</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                  </div>
                  {errors.destination && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.destination.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-page-message" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Message (Optional)
                  </label>
                  <textarea
                    id="contact-page-message"
                    {...register('message')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Any additional details you'd like to share..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                >
                  {isSubmitting ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Map & Office Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Visit Our Office
              </h2>
              <p className="text-gray-600 mb-8">
                Come visit us at our head office in Agra or any of our branch
                offices across India.
              </p>

              {/* Map Embed */}
              <div className="rounded-xl overflow-hidden shadow-lg mb-8">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3549.7!2d78.0081!3d27.1767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDEwJzM2LjEiTiA3OMKwMDAnMjkuMiJF!5e0!3m2!1sen!2sin!4v1705000000000!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Intermost Head Office - Agra"
                />
              </div>

              {/* Office Cards */}
              <div className="space-y-4">
                {officesList.map((office, index) => (
                  <div
                    key={office.city + index}
                    className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {office.city}
                        </h3>
                        <p className="text-primary text-xs font-medium mb-1">
                          {office.company}
                        </p>
                        <p className="text-gray-600 text-sm mb-2">
                          {office.address}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <a
                            href={`tel:${office.phone.replace(/\s/g, '')}`}
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            {office.phone}
                          </a>
                          <span className="text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {office.hours}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about studying MBBS abroad.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="mb-4"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full text-left bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <span
                      className={`transform transition-transform ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                  {expandedFaq === index && (
                    <p className="mt-4 text-gray-600 border-t pt-4">
                      {faq.answer}
                    </p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Medical Journey?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have successfully pursued MBBS abroad
            with our guidance.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/apply"
              className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Apply Now
            </a>
            <a
              href={getWhatsAppLink('Hi, I want to know about MBBS abroad')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
