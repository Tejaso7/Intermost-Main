import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Intermost Study Abroad',
  description:
    'Read our privacy policy to understand how Intermost Study Abroad collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-white/90">
              Last updated: January 1, 2024
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto prose prose-lg prose-headings:text-gray-900 prose-p:text-gray-600">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Intermost Study Abroad ("Company," "we," "our," or "us"). 
              We are committed to protecting your personal information and your right to privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you visit our website or use our services.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul>
              <li>Fill out contact forms or inquiry forms on our website</li>
              <li>Register for our services or create an account</li>
              <li>Apply for admission through our platform</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us via email, phone, or WhatsApp</li>
            </ul>
            <p>The personal information we collect may include:</p>
            <ul>
              <li>Full name and contact details (email, phone number, address)</li>
              <li>Educational qualifications (10th, 12th marks, NEET score)</li>
              <li>Passport details and photographs</li>
              <li>Parent/guardian information</li>
              <li>Preferred countries and universities for admission</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>
              When you visit our website, we automatically collect certain information about your 
              device, including information about your web browser, IP address, time zone, and 
              some of the cookies that are installed on your device.
            </p>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including to:</p>
            <ul>
              <li>Process your admission applications and provide counseling services</li>
              <li>Communicate with you about your inquiries and applications</li>
              <li>Send you updates about admission deadlines and university news</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraudulent activities</li>
            </ul>

            <h2>4. Sharing Your Information</h2>
            <p>We may share your personal information in the following situations:</p>
            <ul>
              <li>
                <strong>With Partner Universities:</strong> We share necessary information with 
                universities to process your admission applications.
              </li>
              <li>
                <strong>With Service Providers:</strong> We may share information with third-party 
                vendors who assist us in operating our business (e.g., visa processing agencies).
              </li>
              <li>
                <strong>For Legal Compliance:</strong> We may disclose information when required 
                by law or to protect our rights.
              </li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect 
              your personal information against unauthorized access, alteration, disclosure, or 
              destruction. These measures include:
            </p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Secure servers and databases</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
            </ul>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of any inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:privacy@intermoststudyabroad.com">
                privacy@intermoststudyabroad.com
              </a>
            </p>

            <h2>7. Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. Cookies are small 
              data files stored on your device. You can control cookie settings through your 
              browser preferences.
            </p>
            <p>We use cookies for:</p>
            <ul>
              <li>Essential website functionality</li>
              <li>Analytics and performance tracking</li>
              <li>Personalization of content</li>
            </ul>

            <h2>8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites (university websites, 
              social media platforms, etc.). We are not responsible for the privacy practices 
              of these external sites. We encourage you to read the privacy policies of any 
              third-party websites you visit.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              Our services are intended for individuals who are at least 17 years of age. We 
              do not knowingly collect personal information from children under 17 without 
              parental consent.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page and updating the "Last 
              updated" date.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, 
              please contact us:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:info@intermoststudyabroad.com">
                  info@intermoststudyabroad.com
                </a>
              </li>
              <li>
                <strong>Phone:</strong> +91 9058501818
              </li>
              <li>
                <strong>Address:</strong> CP-75, Viraj Khand, Gomti Nagar, 
                Lucknow, Uttar Pradesh 226010
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
