
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const socialLinks = [
    { name: '𝕏', url: 'https://x.com/jeetparganiha' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jeet-parganiha-b92305116/' },
    { name: 'Instagram', url: 'https://www.instagram.com/jeetparganiha/' },
    { name: 'YouTube', url: 'https://www.youtube.com/@parganihaji' },
    { name: 'Facebook', url: 'https://www.facebook.com/jeet.parganiha.5' }
  ];

  return (
    <footer className="bg-slate-50 border-t dark:bg-slate-900 dark:border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center justify-center md:justify-start gap-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">
              <span className="bg-indigo-600 p-1 rounded text-white text-xs">AI</span>
              <span>AIZONET</span>
            </Link>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto md:mx-0">
              The world's most comprehensive directory for artificial intelligence tools and software in 2026.
            </p>
            <div className="mt-6 flex items-center justify-center md:justify-start gap-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-indigo-600 transition-colors"
                  aria-label={social.name}
                >
                  <span className="text-sm font-black">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">Directory</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/tools" className="hover:text-indigo-600 transition-colors">All Tools</Link></li>
              <li><Link to="/categories" className="hover:text-indigo-600 transition-colors">Categories</Link></li>
              <li><Link to="/tools?pricing=Free" className="hover:text-indigo-600 transition-colors">Free Tools</Link></li>
              <li><Link to="/blog" className="hover:text-indigo-600 transition-colors">Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/about" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
              <li><Link to="/submit-tool" className="hover:text-indigo-600 transition-colors font-bold text-indigo-600 dark:text-indigo-400">Submit Tool</Link></li>
              <li><Link to="/admin/login" className="hover:text-indigo-600 transition-colors opacity-60 hover:opacity-100">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">HQ Address</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Cyber and Twin City,<br />
              Bhilai, Chhattisgarh,<br />
              India
            </p>
            <p className="mt-4 text-sm font-bold dark:text-white">
              <a href="tel:+917999608471" className="hover:text-indigo-600 transition-colors">+91 79996 08471</a>
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>© 2026 AIZONET Directory. Built with passion for the global AI community.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
