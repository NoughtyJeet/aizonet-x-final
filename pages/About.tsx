
import React from 'react';
import SEO from '../components/SEO';

const About: React.FC = () => {
  return (
    <div className="pb-20">
      <SEO 
        title="About Us | AIZONET - The AI Revolution" 
        description="Learn about AIZONET, our mission to curate the best AI tools, and our vision for the future of artificial intelligence in 2026."
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 bg-slate-50 dark:bg-slate-900/40">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            Our Story
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-[0.9]">
            The World's <br />
            <span className="text-indigo-600 dark:text-indigo-400">AI Compass</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Founded on the belief that technology should be accessible to everyone, AIZONET has become the leading guide through the artificial intelligence revolution.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-24">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">Our Mission.</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                In a world where thousands of new AI tools are launched every month, finding the right one can be overwhelming. We started AIZONET to cut through the noise.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Our mission is to meticulously curate, review, and categorize the world's most innovative AI software, empowering you to work smarter, not harder.
              </p>
            </div>
            <div className="bg-indigo-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-indigo-600/20 transform rotate-2">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold mb-4">Precision over Volume</h3>
              <p className="opacity-90">We don't just list tools; we verify them. Every listing on AIZONET is manually reviewed for quality and utility.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border dark:border-slate-700 shadow-sm">
               <div className="text-4xl mb-4">💡</div>
               <h4 className="text-xl font-bold dark:text-white mb-2">Discovery</h4>
               <p className="text-sm text-slate-500">Helping you find your edge in the ever-evolving tech landscape.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border dark:border-slate-700 shadow-sm">
               <div className="text-4xl mb-4">🛡️</div>
               <h4 className="text-xl font-bold dark:text-white mb-2">Integrity</h4>
               <p className="text-sm text-slate-500">Unbiased reviews powered by real human testing and AI insights.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border dark:border-slate-700 shadow-sm">
               <div className="text-4xl mb-4">🌍</div>
               <h4 className="text-xl font-bold dark:text-white mb-2">Community</h4>
               <p className="text-sm text-slate-500">Building a global network of creators, developers, and AI enthusiasts.</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
             <div className="relative z-10 text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-black mb-8">Looking Ahead to 2026.</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-10">
                  Artificial Intelligence is just beginning to show its potential. We're committed to remaining your primary resource as we navigate this exciting future together.
                </p>
                <div className="inline-flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                   <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center font-black">AI</div>
                   <div className="text-left">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">The AIZONET Pledge</p>
                      <p className="text-sm font-bold">Innovation, Quality, and Transparency.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
