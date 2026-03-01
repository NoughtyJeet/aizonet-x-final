import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { comparisonService } from '../services/comparisonService';
import { ProgrammaticComparison } from '../types';
import { Check, X, Info, ArrowRight, Star, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';

const ComparisonDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [comparison, setComparison] = useState<ProgrammaticComparison | null>(null);
  const [related, setRelated] = useState<ProgrammaticComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const loadComparison = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await comparisonService.getComparisonBySlug(slug);
        setComparison(data);
        
        // Fetch related comparisons (same category as tool 1)
        const allComps = await comparisonService.getComparisons();
        const relatedComps = allComps
          .filter(c => c.id !== data.id && c.status === 'published' && c.tool1?.category === data.tool1?.category)
          .slice(0, 4);
        setRelated(relatedComps);
      } catch (err) {
        console.error('Failed to load comparison:', err);
        setError('Comparison not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    loadComparison();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Analyzing tools...</p>
        </div>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">404</h1>
          <p className="text-slate-500 mb-8">{error || 'Comparison not found'}</p>
          <Link to="/" className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const content = JSON.parse(comparison.ai_content || '{}');
  const tools = [comparison.tool1, comparison.tool2];
  if (comparison.tool3) tools.push(comparison.tool3);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-20">
      {/* SEO Tags */}
      <Helmet>
        <title>{comparison.seo_title}</title>
        <meta name="description" content={comparison.seo_description} />
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": (comparison.faq_schema || []).map((faq: any) => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
              }
            }))
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20 dark:to-transparent -z-10"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest mb-8"
            >
              <Star className="w-3 h-3 fill-current" />
              Expert Comparison
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-tight"
            >
              {comparison.tool1?.name} <span className="text-slate-400">vs</span> {comparison.tool2?.name}
              {comparison.tool3 && <> <span className="text-slate-400">vs</span> {comparison.tool3.name}</>}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-12"
            >
              {content.intro}
            </motion.p>

            {/* Quick Tool Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, idx) => tool && (
                <Link key={tool.id} to={`/tools/${tool.slug}`} className="group p-6 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[2rem] text-left hover:border-indigo-600 transition-all shadow-sm hover:shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={tool.logoUrl} alt={tool.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{tool.name}</h3>
                      <p className="text-xs text-slate-500">{tool.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{tool.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">{tool.pricing}</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-bold">{tool.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-20">
          
          {/* Tool Overviews */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-3">
              <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-lg">01</span>
              Tool Overviews
            </h2>
            <div className="grid gap-8">
              {content.toolOverviews?.map((overview: any, idx: number) => (
                <div key={idx} className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border dark:border-slate-800">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">{overview.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{overview.overview}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Feature Comparison Table */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-3">
              <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-lg">02</span>
              Feature Comparison
            </h2>
            <div className="overflow-x-auto rounded-3xl border dark:border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900">
                    <th className="p-6 font-black text-slate-900 dark:text-white border-b dark:border-slate-800">Feature</th>
                    {tools.map((tool, idx) => tool && (
                      <th key={idx} className="p-6 font-black text-slate-900 dark:text-white border-b dark:border-slate-800">{tool.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.featureComparison?.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="p-6 font-bold text-slate-700 dark:text-slate-300 border-b dark:border-slate-800">{row.feature}</td>
                      {row.values?.map((val: string, vIdx: number) => (
                        <td key={vIdx} className="p-6 text-slate-600 dark:text-slate-400 border-b dark:border-slate-800">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Pricing Section */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-3">
              <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-lg">03</span>
              Pricing & Value
            </h2>
            <div className="p-8 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{content.pricingComparison}</p>
            </div>
          </section>

          {/* Pros & Cons */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-3">
              <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-lg">04</span>
              Pros & Cons
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {content.prosCons?.map((item: any, idx: number) => (
                <div key={idx} className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white px-4">{item.name}</h3>
                  <div className="p-6 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl space-y-4">
                    <div className="space-y-3">
                      {item.pros?.map((pro: string, pIdx: number) => (
                        <div key={pIdx} className="flex items-start gap-3 text-emerald-600 dark:text-emerald-400">
                          <Check className="w-5 h-5 mt-0.5 shrink-0" />
                          <span className="text-sm font-medium">{pro}</span>
                        </div>
                      ))}
                    </div>
                    <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
                    <div className="space-y-3">
                      {item.cons?.map((con: string, cIdx: number) => (
                        <div key={cIdx} className="flex items-start gap-3 text-rose-600 dark:text-rose-400">
                          <X className="w-5 h-5 mt-0.5 shrink-0" />
                          <span className="text-sm font-medium">{con}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Use Cases & Verdict */}
          <div className="grid md:grid-cols-2 gap-8">
            <section className="p-8 bg-slate-900 text-white rounded-[2.5rem]">
              <h2 className="text-2xl font-black mb-6">Best Use Cases</h2>
              <p className="text-slate-400 leading-relaxed">{content.useCases}</p>
            </section>
            <section className="p-8 bg-indigo-600 text-white rounded-[2.5rem]">
              <h2 className="text-2xl font-black mb-6">Final Verdict</h2>
              <p className="text-indigo-100 leading-relaxed">{content.verdict}</p>
            </section>
          </div>

          {/* FAQ Section */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-10">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {content.faq?.map((faq: any, idx: number) => (
                <div key={idx} className="border dark:border-slate-800 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <span className="font-bold text-slate-900 dark:text-white">{faq.q}</span>
                    {openFaq === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {openFaq === idx && (
                    <div className="p-6 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed animate-in slide-in-from-top-2 duration-300">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="p-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] text-center text-white">
            <h2 className="text-3xl font-black mb-6">Ready to choose?</h2>
            <p className="text-indigo-100 mb-10 max-w-xl mx-auto">Explore more details about these tools or start your free trial today.</p>
            <div className="flex flex-wrap justify-center gap-4">
              {tools.map((tool, idx) => tool && (
                <a key={idx} href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-black rounded-2xl hover:bg-indigo-50 transition-all">
                  Visit {tool.name}
                  <ExternalLink className="w-4 h-4" />
                </a>
              ))}
            </div>
          </section>

          {/* Related Comparisons */}
          {related.length > 0 && (
            <section className="pt-10 border-t dark:border-slate-800">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Related Comparisons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {related.map(rel => (
                  <Link key={rel.id} to={`/compare/${rel.slug}`} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-800 hover:border-indigo-600 transition-all flex items-center justify-between group">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{rel.tool1?.name} vs {rel.tool2?.name}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default ComparisonDetail;
