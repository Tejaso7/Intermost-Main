import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Intermost Study Abroad',
  description:
    'Read the terms and conditions for using Intermost Study Abroad services and website.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms & Conditions
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
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using the Intermost Study Abroad website and services, you agree to 
              be bound by these Terms and Conditions. If you disagree with any part of these terms, 
              you may not access our services.
            </p>

            <h2>2. Description of Services</h2>
            <p>
              Intermost Study Abroad provides educational counseling and admission assistance 
              services for students seeking to pursue MBBS (Bachelor of Medicine and Bachelor of 
              Surgery) education abroad. Our services include:
            </p>
            <ul>
              <li>Career counseling and guidance</li>
              <li>University selection assistance</li>
              <li>Application processing and documentation</li>
              <li>Visa guidance and support</li>
              <li>Pre-departure orientation</li>
              <li>Post-admission support</li>
            </ul>

            <h2>3. Eligibility</h2>
            <p>To use our services, you must:</p>
            <ul>
              <li>Be at least 17 years of age</li>
              <li>Have completed or be in the process of completing 10+2 education with PCB</li>
              <li>Have a valid NEET qualification (as per NMC guidelines)</li>
              <li>Provide accurate and truthful information</li>
            </ul>

            <h2>4. User Responsibilities</h2>
            <p>As a user of our services, you agree to:</p>
            <ul>
              <li>Provide accurate and complete information in all forms and applications</li>
              <li>Submit genuine documents and certificates</li>
              <li>Respond promptly to communication from our team</li>
              <li>Pay applicable fees as per the agreed terms</li>
              <li>Comply with all university and country-specific requirements</li>
              <li>Not misrepresent any information during the admission process</li>
            </ul>

            <h2>5. Fees and Payment</h2>
            <h3>Service Fees</h3>
            <p>
              Our counseling and admission assistance services may involve fees as communicated 
              during the registration process. All fees are:
            </p>
            <ul>
              <li>Quoted in Indian Rupees (INR) unless otherwise specified</li>
              <li>Subject to applicable taxes</li>
              <li>Payable as per the agreed schedule</li>
            </ul>

            <h3>Refund Policy</h3>
            <p>Refunds are handled on a case-by-case basis:</p>
            <ul>
              <li>
                <strong>Before Application Submission:</strong> Partial refund may be provided 
                after deducting administrative charges
              </li>
              <li>
                <strong>After Application Submission:</strong> No refund of processing fees; 
                university fees refund depends on university policy
              </li>
              <li>
                <strong>Visa Rejection:</strong> University fees may be refunded as per university 
                policy; our service fees are non-refundable
              </li>
            </ul>

            <h2>6. Admission Disclaimer</h2>
            <p>
              While we provide comprehensive support for university admissions, we do not guarantee:
            </p>
            <ul>
              <li>Admission to any specific university</li>
              <li>Visa approval from any embassy or consulate</li>
              <li>Specific outcomes of FMGE/screening tests</li>
            </ul>
            <p>
              Admission decisions are made solely by the respective universities based on their 
              criteria. Visa decisions are made by the respective embassies/consulates.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              All content on our website, including text, graphics, logos, images, and software, 
              is the property of Intermost Study Abroad and is protected by intellectual property 
              laws. You may not:
            </p>
            <ul>
              <li>Copy or reproduce any content without permission</li>
              <li>Use our trademarks or branding without authorization</li>
              <li>Modify or create derivative works</li>
            </ul>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Intermost Study Abroad shall not be liable for:
            </p>
            <ul>
              <li>Any indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Actions or decisions of universities, embassies, or other third parties</li>
              <li>Changes in university policies, fees, or admission criteria</li>
              <li>Political situations or travel restrictions</li>
            </ul>

            <h2>9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Intermost Study Abroad, its directors, 
              employees, and agents from any claims, damages, losses, or expenses arising from:
            </p>
            <ul>
              <li>Your violation of these Terms</li>
              <li>Your misrepresentation of information</li>
              <li>Your violation of any third-party rights</li>
            </ul>

            <h2>10. Privacy</h2>
            <p>
              Your use of our services is also governed by our Privacy Policy. Please review our{' '}
              <a href="/privacy">Privacy Policy</a> to understand how we collect, use, and protect 
              your information.
            </p>

            <h2>11. Third-Party Services</h2>
            <p>
              Our services may involve coordination with third parties including:
            </p>
            <ul>
              <li>Universities and educational institutions</li>
              <li>Visa processing agencies</li>
              <li>Travel and accommodation providers</li>
              <li>Banking and financial institutions</li>
            </ul>
            <p>
              We are not responsible for the terms, policies, or actions of these third parties. 
              Please review their respective terms before engaging with them.
            </p>

            <h2>12. Communication</h2>
            <p>
              By using our services, you consent to receive communications from us via:
            </p>
            <ul>
              <li>Email</li>
              <li>Phone calls</li>
              <li>SMS/WhatsApp messages</li>
              <li>Push notifications (if applicable)</li>
            </ul>
            <p>
              You can opt out of marketing communications at any time by contacting us.
            </p>

            <h2>13. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to our services at any 
              time, without notice, for conduct that we believe:
            </p>
            <ul>
              <li>Violates these Terms</li>
              <li>Is harmful to other users, us, or third parties</li>
              <li>Involves fraudulent or illegal activity</li>
            </ul>

            <h2>14. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. 
              Any disputes arising from these Terms shall be subject to the exclusive jurisdiction 
              of the courts in Lucknow, Uttar Pradesh.
            </p>

            <h2>15. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective 
              immediately upon posting on our website. Your continued use of our services after 
              any changes constitutes acceptance of the new Terms.
            </p>

            <h2>16. Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid or unenforceable, the 
              remaining provisions shall continue to be valid and enforceable.
            </p>

            <h2>17. Contact Information</h2>
            <p>
              For any questions about these Terms and Conditions, please contact us:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:legal@intermoststudyabroad.com">
                  legal@intermoststudyabroad.com
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
