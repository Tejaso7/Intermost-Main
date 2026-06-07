'use client';

import { useState } from 'react';
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
  CheckCircle
} from 'lucide-react';
import { inquiriesApi } from '@/lib/services';
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
    <section id="contact" className="py-20 bg-white">
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
                href="tel:+919058501818"
                className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary-600 transition-colors">
                  <Phone className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Call Us</h4>
                  <p className="text-gray-600">+91 9058501818</p>
                  <p className="text-gray-600">+91 9837533887</p>
                </div>
              </a>

              <a
                href="mailto:admissionintermost@gmail.com"
                className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary-600 transition-colors">
                  <Mail className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email Us</h4>
                  <p className="text-gray-600">admissionintermost@gmail.com</p>
                </div>
              </a>

              <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Visit Us</h4>
                  <p className="text-gray-600">
                    Shop no -1, First floor, Vinayak Mall,
                    <br />
                    M G Road, Agra, 282002 (U.P), India
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-primary-600" />
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
            className="card p-8"
          >
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
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    type="text"
                    {...register('name')}
                    className={cn('input-field', errors.name && 'input-error')}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="error-message">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="label">Email Address *</label>
                  <input
                    type="email"
                    {...register('email')}
                    className={cn('input-field', errors.email && 'input-error')}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="error-message">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="label">Phone Number *</label>
                  <div className="flex">
                    <select
                      {...register('country_code')}
                      className="input-field w-24 rounded-r-none"
                    >
                      <option value="+91">+91</option>
                      <option value="+971">+971</option>
                      <option value="+1">+1</option>
                    </select>
                    <input
                      type="tel"
                      {...register('phone')}
                      className={cn(
                        'input-field flex-1 rounded-l-none border-l-0',
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
                <div>
                  <label className="label">Interested Country</label>
                  <select
                    {...register('interested_country')}
                    className="input-field"
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* NEET Score */}
                <div>
                  <label className="label">NEET Score (Optional)</label>
                  <input
                    type="text"
                    {...register('neet_score')}
                    className="input-field"
                    placeholder="Enter your NEET score"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="label">Message (Optional)</label>
                  <textarea
                    {...register('message')}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Any specific questions or requirements?"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <span className="spinner mr-2" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Send className="w-5 h-5 mr-2" />
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
