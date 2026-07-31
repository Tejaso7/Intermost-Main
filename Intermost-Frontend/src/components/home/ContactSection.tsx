'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  Clock,
  CheckCircle,
  ChevronDown
} from 'lucide-react';
import { coreApi, inquiriesApi } from '@/lib/services';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  country_code: z.string().default('+91'),
  interested_country: z.string().optional(),
  neet_score: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const countries = [
  'Russia',
  'Georgia',
  'Uzbekistan',
  'Nepal',
  'Kazakhstan',
  'Tajikistan',
];

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contact, setContact] = useState({
    phone1: '+91 9058501818',
    phone2: '+91 9837533887',
    email: 'admissionintermost@gmail.com',
    address: 'Shop no -1, First floor, Vinayak Mall,\nM G Road, Agra, 282002 (U.P), India',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await coreApi.getSettings();
        if (settings && settings.contact) {
          setContact({
            phone1: settings.contact.phone || '+91 9058501818',
            phone2: settings.contact.alt_phone || settings.contact.whatsapp || '+91 9837533887',
            email: settings.contact.email || 'admissionintermost@gmail.com',
            address: settings.contact.address || 'Shop no -1, First floor, Vinayak Mall,\nM G Road, Agra, 282002 (U.P), India',
          });
        }
      } catch (err) {
        console.debug('Failed to fetch settings for ContactSection', err);
      }
    };
    fetchSettings();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country_code: '+91',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      await inquiriesApi.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        country_code: data.country_code,
        interested_country: data.interested_country,
        neet_score: data.neet_score ? parseInt(data.neet_score) : undefined,
        message: data.message,
        source: 'website_contact_form',
      });
      
      setIsSubmitted(true);
      toast.success('Thank you! We will contact you soon.');
      reset();
      
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-400/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              Get In Touch
            </span>
            <h2 className="section-title mt-2 mb-6">
              Let's Start Your <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-gray-600 mb-8">
              Have questions about MBBS abroad? Our expert counselors are here to 
              help you make the right decision. Get free guidance today!
            </p>

            {/* Contact Cards */}
            <div className="space-y-4 mb-8">
              <a
                href={`tel:${contact.phone1.replace(/\s/g, '')}`}
                className="flex items-start p-4 bg-white/70 backdrop-blur-lg border border-white/50 shadow-md hover:shadow-lg hover:border-primary-200/40 hover:-translate-y-1 transition-all duration-300 group rounded-xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 shadow-md shadow-primary-500/20 rounded-xl flex items-center justify-center mr-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Call Us</h4>
                  <p className="text-gray-600">{contact.phone1}</p>
                  {contact.phone2 && <p className="text-gray-600">{contact.phone2}</p>}
                </div>
              </a>

              <a
                href={`mailto:${contact.email}`}
                className="flex items-start p-4 bg-white/70 backdrop-blur-lg border border-white/50 shadow-md hover:shadow-lg hover:border-primary-200/40 hover:-translate-y-1 transition-all duration-300 group rounded-xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 shadow-md shadow-primary-500/20 rounded-xl flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email Us</h4>
                  <p className="text-gray-600">{contact.email}</p>
                </div>
              </a>

              <div className="flex items-start p-4 bg-white/70 backdrop-blur-lg border border-white/50 shadow-md hover:shadow-lg hover:border-primary-200/40 hover:-translate-y-1 transition-all duration-300 group rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 shadow-md shadow-primary-500/20 rounded-xl flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Visit Us</h4>
                  <p className="text-gray-600 whitespace-pre-line">
                    {contact.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-white/70 backdrop-blur-lg border border-white/50 shadow-md hover:shadow-lg hover:border-primary-200/40 hover:-translate-y-1 transition-all duration-300 group rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 shadow-md shadow-primary-500/20 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Office Hours</h4>
                  <p className="text-gray-600">
                    Monday - Saturday: 10:00 AM - 7:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-8 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl pointer-events-none" />
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600">
                  We have received your inquiry. Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Request Free Counseling
                </h3>

                {/* Name */}
                <div className="relative z-10">
                  <label htmlFor="contact-full-name" className="block text-sm font-semibold text-gray-700 tracking-wide mb-1.5">Full Name *</label>
                  <input
                    id="contact-full-name"
                    type="text"
                    {...register('name')}
                    className={cn('w-full bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-xl px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:bg-white transition-all duration-200 appearance-none', errors.name && 'input-error')}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="error-message">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="relative z-10">
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 tracking-wide mb-1.5">Email Address *</label>
                  <input
                    id="contact-email"
                    type="email"
                    {...register('email')}
                    className={cn('w-full bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-xl px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:bg-white transition-all duration-200 appearance-none', errors.email && 'input-error')}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="error-message">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="relative z-10">
                  <label htmlFor="contact-phone" className="block text-sm font-semibold text-gray-700 tracking-wide mb-1.5">Phone Number *</label>
                  <div className="flex">
                    <div className="relative w-24 border-r-0">
                      <select
                        id="contact-country-code"
                        aria-label="Country Dial Code"
                        {...register('country_code')}
                        className="bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-l-xl pl-3 pr-7 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:bg-white transition-all duration-200 appearance-none w-full border-r-0 text-sm"
                      >
                        <option value="+91">+91</option>
                        <option value="+971">+971</option>
                        <option value="+1">+1</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                    </div>
                    <input
                      id="contact-phone"
                      type="tel"
                      {...register('phone')}
                      className={cn(
                        'flex-1 bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-r-xl px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:bg-white transition-all duration-200 appearance-none border-l-0 text-sm',
                        errors.phone && 'input-error'
                      )}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="error-message">{errors.phone.message}</p>
                  )}
                </div>

                {/* Interested Country */}
                <div className="relative z-10">
                  <label htmlFor="contact-interested-country" className="block text-sm font-semibold text-gray-700 tracking-wide mb-1.5">Interested Country</label>
                  <div className="relative">
                    <select
                      id="contact-interested-country"
                      {...register('interested_country')}
                      className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-xl pr-10 pl-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 appearance-none text-sm cursor-pointer"
                    >
                      <option value="">Select a country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                  </div>
                </div>

                {/* NEET Score */}
                <div className="relative z-10">
                  <label htmlFor="contact-neet-score" className="block text-sm font-semibold text-gray-700 tracking-wide mb-1.5">NEET Score (Optional)</label>
                  <input
                    id="contact-neet-score"
                    type="text"
                    {...register('neet_score')}
                    className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-xl px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 appearance-none text-sm"
                    placeholder="Enter your NEET score"
                  />
                </div>

                {/* Message */}
                <div className="relative z-10">
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 tracking-wide mb-1.5">Message (Optional)</label>
                  <textarea
                    id="contact-message"
                    {...register('message')}
                    rows={3}
                    className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-xl px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:bg-white transition-all duration-200 appearance-none resize-none"
                    placeholder="Any specific questions or requirements?"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full relative z-10 hover:shadow-lg hover:shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <span className="spinner mr-2" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Send className="w-5 h-5 mr-2" aria-hidden="true" />
                      Submit Inquiry
                    </span>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to our{' '}
                  <a href="/privacy" className="text-primary-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
