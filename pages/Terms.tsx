
import React from 'react';
import SEO from '../components/SEO';

const Terms: React.FC = () => {
  return (
    <div className="pb-20">
      <SEO 
        title="Terms of Service | AIZONET Directory" 
        description="Review the terms and conditions for using AIZONET, including tool submission guidelines and content usage."
      />

      <div className="bg-slate-50 dark:bg-slate-900/40 py-20 border-b dark:border-slate-800 mb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 leading-none">Terms of Service.</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Last Updated: January 1, 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        <article className="prose prose-indigo dark:prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed prose-h2:text-3xl prose-h2:font-black prose-h2:mt-12">
          <p>
            Please read these Terms of Service carefully before using AIZONET.in operated by AIZONET. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
          </p>

          <h2>1. Directory Content</h2>
          <p>
            AIZONET is a curated directory of AI tools. While we strive for accuracy, we do not guarantee the completeness, reliability, or timeliness of the information provided. Users are encouraged to verify tool details on the official product websites.
          </p>

          <h2>2. Tool Submissions</h2>
          <p>
            By submitting a tool to AIZONET, you represent that you have the right to provide information about the tool and that the information is accurate. AIZONET reserves the right to accept, reject, or remove any submission at our sole discretion without notice.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding tool logos and third-party trademarks) are and will remain the exclusive property of AIZONET. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of AIZONET.
          </p>

          <h2>4. Use of AI Insights</h2>
          <p>
            AIZONET uses advanced AI models (like Google Gemini) to provide summaries and pros/cons for listed tools. These insights are intended as a guide and do not constitute professional advice. We are not responsible for any decisions made based on these automated analyses.
          </p>

          <h2>5. Third-Party Links</h2>
          <p>
            Our Service contains links to third-party web sites or services that are not owned or controlled by AIZONET. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
          </p>

          <h2>6. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. AIZONET makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content, or materials included therein.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            In no event shall AIZONET be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which AIZONET operates, without regard to its conflict of law provisions.
          </p>

          <h2>9. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:legal@aizonet.in">legal@aizonet.in</a>.
          </p>
        </article>
      </div>
    </div>
  );
};

export default Terms;
