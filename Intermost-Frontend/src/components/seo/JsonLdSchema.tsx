import React from 'react';

interface JsonLdProps {
  type: 'Organization' | 'LocalBusiness' | 'FAQPage' | 'Course';
  data?: any;
}

export default function JsonLdSchema({ type, data }: JsonLdProps) {
  let schemaData: any = null;

  if (type === 'Organization') {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'Intermost Study Abroad',
      legalName: 'Intermost Ventures LLP',
      url: 'https://intermost.in',
      logo: 'https://intermost.in/images/logo/logo.png',
      sameAs: [
        'https://www.facebook.com/intermoststudyabroad',
        'https://www.instagram.com/intermoststudyabroad/',
        'http://www.youtube.com/@IntermostStudyAbroad',
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+91-9058501818',
          contactType: 'customer service',
          areaServed: 'IN',
          availableLanguage: ['en', 'hi'],
        },
      ],
    };
  } else if (type === 'LocalBusiness') {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Intermost Study Abroad - Agra Head Office',
      image: 'https://intermost.in/images/logo/logo.png',
      telephone: '+91-9058501818',
      email: 'admissionintermost@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Shop no -1, First floor, Vinayak Mall, Deewani Crossing',
        addressLocality: 'Agra',
        addressRegion: 'Uttar Pradesh',
        postalCode: '282002',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 27.1767,
        longitude: 78.0081,
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '19:00',
      },
    };
  } else if (type === 'FAQPage' && data) {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.map((faq: { question: string; answer: string }) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }

  if (!schemaData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
