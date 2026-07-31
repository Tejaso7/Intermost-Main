'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  Send,
  CheckCircle,
  Phone,
  Mail,
  GraduationCap,
  FileText,
  User,
  MapPin,
} from 'lucide-react';
import { inquiriesApi } from '@/lib/services';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  country_code: z.string().default('+91'),
  interested_country: z.string().min(1, 'Please select a country'),
  neet_score: z.string().optional(),
  tenth_percentage: z.string().optional(),
  twelfth_percentage: z.string().optional(),
  city: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const countries = [
  { value: 'russia', label: 'Russia', fee: '₹25-35 Lakhs' },
  { value: 'georgia', label: 'Georgia', fee: '₹30-45 Lakhs' },
  { value: 'uzbekistan', label: 'Uzbekistan', fee: '₹20-28 Lakhs' },
  { value: 'nepal', label: 'Nepal', fee: '₹55-60 Lakhs' },
  { value: 'kazakhstan', label: 'Kazakhstan', fee: '₹20-28 Lakhs' },
  { value: 'tajikistan', label: 'Tajikistan', fee: '₹18-25 Lakhs' },
];

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Academic Details', icon: GraduationCap },
  { id: 3, title: 'Course Selection', icon: FileText },
];

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country_code: '+91',
    },
  });

  const selectedCountry = watch('interested_country');

  const nextStep = async () => {
    const fieldsToValidate: (keyof FormData)[] =
      currentStep === 1
        ? ['name', 'email', 'phone']
        : currentStep === 2
        ? []
        : [];

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
        message: `10th: ${data.tenth_percentage || 'N/A'}, 12th: ${data.twelfth_percentage || 'N/A'}, City: ${data.city || 'N/A'}. ${data.message || ''}`,
        source: 'apply_form',
      });

      setIsSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="container-custom py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center bg-white rounded-2xl p-12 shadow-lg"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Application Submitted!
            </h1>
            <p className="text-gray-600 mb-8">
              Thank you for your interest in studying MBBS abroad. Our counselor will
              contact you within 24 hours to guide you through the admission process.
            </p>
            <div className="bg-primary-50 rounded-xl p-6 mb-8">
              <p className="text-primary-800 font-medium">
                For immediate assistance, call us at:
              </p>
              <a
                href="tel:+919058501818"
                className="text-2xl font-bold text-primary-600 hover:text-primary-700"
              >
                +91 9058501818
              </a>
            </div>
            <a href="/" className="btn-primary">
              Back to Home
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Apply for MBBS Abroad
            </h1>
            <p className="text-xl text-primary-100">
              Fill out the form below and our expert counselors will guide you
              through the admission process
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-12">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={cn(
                      'flex items-center justify-center w-12 h-12 rounded-full font-semibold transition-colors',
                      currentStep >= step.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    )}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span
                    className={cn(
                      'ml-2 font-medium hidden sm:block',
                      currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                    )}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'w-12 md:w-24 h-1 mx-4 rounded',
                        currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      Personal Information
                    </h2>

                    <div>
                      <label htmlFor="apply-name" className="label">Full Name *</label>
                      <input
                        id="apply-name"
                        type="text"
                        {...register('name')}
                        className={cn('input-field', errors.name && 'input-error')}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="error-message">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="apply-email" className="label">Email Address *</label>
                      <input
                        id="apply-email"
                        type="email"
                        {...register('email')}
                        className={cn('input-field', errors.email && 'input-error')}
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="error-message">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="apply-phone" className="label">Phone Number *</label>
                      <div className="flex">
                        <select
                          id="apply-country-code"
                          aria-label="Country Code"
                          {...register('country_code')}
                          className="input-field w-24 rounded-r-none"
                        >
                          <option value="+91">+91</option>
                          <option value="+971">+971</option>
                          <option value="+1">+1</option>
                        </select>
                        <input
                          id="apply-phone"
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

                    <div>
                      <label htmlFor="apply-city" className="label">City</label>
                      <input
                        id="apply-city"
                        type="text"
                        {...register('city')}
                        className="input-field"
                        placeholder="Enter your city"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Academic Details */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      Academic Details
                    </h2>

                    <div>
                      <label htmlFor="apply-tenth" className="label">10th Percentage</label>
                      <input
                        id="apply-tenth"
                        type="text"
                        {...register('tenth_percentage')}
                        className="input-field"
                        placeholder="e.g., 85%"
                      />
                    </div>

                    <div>
                      <label htmlFor="apply-twelfth" className="label">12th Percentage (PCB)</label>
                      <input
                        id="apply-twelfth"
                        type="text"
                        {...register('twelfth_percentage')}
                        className="input-field"
                        placeholder="e.g., 75%"
                      />
                    </div>

                    <div>
                      <label htmlFor="apply-neet" className="label">NEET Score</label>
                      <input
                        id="apply-neet"
                        type="text"
                        {...register('neet_score')}
                        className="input-field"
                        placeholder="Enter your NEET score"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Leave blank if not appeared yet
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Course Selection */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      Select Your Preferred Country
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {countries.map((country) => (
                        <label
                          key={country.value}
                          className={cn(
                            'relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-blue-500',
                            selectedCountry === country.label
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <input
                            type="radio"
                            aria-label={`Select ${country.label}`}
                            {...register('interested_country')}
                            value={country.label}
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {country.label}
                            </p>
                            <p className="text-sm text-gray-500">{country.fee}</p>
                          </div>
                          {selectedCountry === country.label && (
                            <CheckCircle className="w-6 h-6 text-primary-600" aria-hidden="true" />
                          )}
                        </label>
                      ))}
                    </div>
                    {errors.interested_country && (
                      <p className="error-message">
                        {errors.interested_country.message}
                      </p>
                    )}

                    <div>
                      <label htmlFor="apply-message" className="label">Additional Message (Optional)</label>
                      <textarea
                        id="apply-message"
                        {...register('message')}
                        rows={4}
                        className="input-field resize-none"
                        placeholder="Any specific questions or requirements?"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-outline"
                    >
                      Previous
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-primary"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <span className="spinner mr-2" />
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Send className="w-5 h-5 mr-2" />
                          Submit Application
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Contact Info */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Need help? Contact our admission team:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <a
                  href="tel:+919058501818"
                  className="flex items-center text-primary-600 font-medium hover:text-primary-700"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  +91 9058501818
                </a>
                <a
                  href="mailto:admissionintermost@gmail.com"
                  className="flex items-center text-primary-600 font-medium hover:text-primary-700"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  admissionintermost@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
