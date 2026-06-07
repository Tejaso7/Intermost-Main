import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer | Intermost Study Abroad',
  description:
    'Read our disclaimer to understand the terms of information provided by Intermost Study Abroad.',
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Disclaimer</h1>
            <p className="text-white/90">Last updated: January 1, 2024</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto prose prose-lg prose-headings:text-gray-900 prose-p:text-gray-600">
            <h2>1. General Information</h2>
            <p>
              The information provided on the Intermost Study Abroad website (intermost.in) is for
              general informational purposes only. While we strive to keep the information
              up-to-date and accurate, we make no representations or warranties of any kind,
              express or implied, about the completeness, accuracy, reliability, suitability, or
              availability of the information, products, services, or related graphics contained on
              the website.
            </p>

            <h2>2. Admission & University Information</h2>
            <p>
              Information regarding universities, admission processes, fee structures, course
              durations, and recognition status is subject to change without prior notice. We
              recommend verifying all details directly with the respective universities and relevant
              regulatory bodies such as the National Medical Commission (NMC), World Health
              Organization (WHO), and other applicable authorities before making any decisions.
            </p>

            <h2>3. No Guarantee of Admission</h2>
            <p>
              While Intermost Study Abroad assists students with the admission process, we do not
              guarantee admission to any university. Admission decisions are solely at the
              discretion of the respective universities and are subject to eligibility criteria,
              availability of seats, and other factors beyond our control.
            </p>

            <h2>4. Fee & Financial Information</h2>
            <p>
              Fee structures, scholarships, and financial information displayed on this website are
              approximate and provided for reference purposes only. Actual fees may vary based on
              exchange rates, university policies, government regulations, and other factors. Please
              contact us directly for the most current fee information.
            </p>

            <h2>5. External Links</h2>
            <p>
              Our website may contain links to external websites that are not operated or controlled
              by Intermost Study Abroad. We have no control over the content, privacy policies, or
              practices of any third-party websites and assume no responsibility for them.
            </p>

            <h2>6. Professional Advice</h2>
            <p>
              The content on this website does not constitute professional, legal, financial, or
              medical advice. Students and parents are advised to seek independent professional
              advice before making decisions related to studying abroad.
            </p>

            <h2>7. Testimonials & Reviews</h2>
            <p>
              Testimonials and reviews displayed on this website reflect individual experiences and
              opinions of past students. Results and experiences may vary, and testimonials do not
              guarantee similar outcomes for future students.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              In no event shall Intermost Study Abroad, its directors, employees, partners, or
              affiliates be liable for any indirect, incidental, special, consequential, or punitive
              damages, including without limitation, loss of profits, data, use, goodwill, or other
              intangible losses, resulting from your access to or use of this website.
            </p>

            <h2>9. Changes to This Disclaimer</h2>
            <p>
              We reserve the right to modify this disclaimer at any time without prior notice. By
              continuing to use our website after changes are posted, you accept the modified
              disclaimer.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this disclaimer, please contact us at:
            </p>
            <ul>
              <li>
                <strong>Email:</strong> info@intermost.in
              </li>
              <li>
                <strong>Phone:</strong> +91 90585 01818
              </li>
              <li>
                <strong>Website:</strong> www.intermost.in
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
