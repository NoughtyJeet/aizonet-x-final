
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Category, AITool } from '../types';
import { supabaseService } from '../services/supabaseService';
import { CATEGORIES } from '../constants';

const SubmitTool: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    logoUrl: '',
    category: 'Productivity',
    description: '',
    email: ''
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await supabaseService.getCategories();
        setCategories(cats);
        if (cats.length > 0) {
          setFormData(prev => ({ ...prev, category: cats[0].name }));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
        setCategories(CATEGORIES);
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const newSubmission: AITool = {
      id: 's' + Math.random().toString(36).substr(2, 9),
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      description: formData.description,
      websiteUrl: formData.website,
      logoUrl: formData.logoUrl || 'https://picsum.photos/seed/' + formData.name + '/200',
      category: formData.category,
      tags: [formData.category.toLowerCase()],
      pricing: 'Freemium', 
      rating: 0,
      reviewCount: 0,
      features: [],
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    try {
      await supabaseService.upsertTool(newSubmission);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to submit tool:', err);
      alert('Failed to submit tool. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 p-12 rounded-[3rem] border-2 border-indigo-100 dark:border-indigo-900 shadow-2xl animate-in zoom-in duration-300">
          <div className="text-6xl mb-6">🚀</div>
          <h1 className="text-4xl font-black mb-4 dark:text-white">Submission Received!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Thank you for submitting <strong>{formData.name}</strong>. Our team will review your tool and list it within 24-48 hours if it meets our quality standards.
          </p>
          <Link to="/" className="inline-block bg-indigo-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <SEO 
        title="Submit Your AI Tool | AIZONET Directory" 
        description="Get your AI product in front of thousands of users. Submit your tool to AIZONET, the leading AI directory."
      />
      
      <div className="bg-slate-50 dark:bg-slate-900/50 pt-20 pb-32 border-b dark:border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            Grow Your Reach
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            List Your <span className="text-indigo-600 dark:text-indigo-400">AI Tool</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Join the fastest-growing AI directory and reach developers, creators, and enthusiasts.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border dark:border-slate-800 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Tool Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  placeholder="e.g. ChatMagic AI"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Website URL</label>
                <input 
                  required
                  type="url" 
                  value={formData.website}
                  onChange={e => setFormData({...formData, website: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  placeholder="https://yourtool.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Logo Image URL</label>
                <input 
                  required
                  type="url" 
                  value={formData.logoUrl}
                  onChange={e => setFormData({...formData, logoUrl: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Primary Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all appearance-none"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Short Description</label>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                placeholder="What does your tool do in one or two sentences?"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Your Contact Email</label>
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                placeholder="developer@example.com"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2"
            >
              🚀 Submit Tool for Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitTool;
