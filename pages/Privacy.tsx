
import React from 'react';
import SEO from '../components/SEO';

const Privacy: React.FC = () => {
  return (
    <div className="pb-20">
      <SEO 
        title="Privacy Policy | AIZONET Directory" 
        description="Our commitment to your data privacy. Read how AIZONET collects and uses information on our platform."
      />

      <div className="bg-slate-50 dark:bg-slate-900/40 py-20 border-b dark:border-slate-800 mb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 leading-none">Privacy Policy.</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Last Updated: January 1, 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        <article className="prose prose-indigo dark:prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed prose-h2:text-3xl prose-h2:font-black prose-h2:mt-12">
          <p>
            Welcome to AIZONET. Your privacy is critically important to us. This Privacy Policy describes how your personal information is collected, used, and shared when you visit AIZONET.in (the “Site”).
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
          </p>
          <p>
            Additionally, as you browse the Site, we collect information about the individual web pages or tools that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information that we collect to help us screen for potential risk and fraud, and more generally to improve and optimize our Site (for example, by generating analytics about how our customers browse and interact with the Site, and to assess the success of our marketing and advertising campaigns).
          </p>
          <p>
            When you submit a tool, we collect your name, email, and tool details to process your submission and contact you regarding its status.
          </p>

          <h2>3. Third-Party Services</h2>
          <p>
            We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Google Analytics to help us understand how our users use the Site.
          </p>
          <p>
            We also use Google AdSense to serve advertisements. These third-party ad servers or ad networks use technology to the advertisements and links that appear on AIZONET.
          </p>

          <h2>4. AI-Powered Features</h2>
          <p>
            Some reviews and summaries on our site are generated using the Google Gemini API. While we ensure these are accurate, these third-party services process tool descriptions to provide insights. No user personal data is sent to these AI models.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
          </p>

          <h2>6. Data Retention</h2>
          <p>
            When you submit a tool or sign up for our newsletter, we will maintain your Information for our records unless and until you ask us to delete this information.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <a href="mailto:privacy@aizonet.in">privacy@aizonet.in</a>.
          </p>
        </article>
      </div>
    </div>
  );
};

export default Privacy;
