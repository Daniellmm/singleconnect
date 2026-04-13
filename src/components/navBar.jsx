import React, { useState, useEffect, useCallback } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { Link as RouterLink } from 'react-router-dom';
import LOGO from '../assets/logo.jpg';

const NAV_LINKS = [
  { name: 'Home',         id: 'home' },
  { name: 'About',        id: 'about' },
  { name: 'Speakers',     id: 'speakers' },
  { name: 'Schedule',     id: 'schedule' },
  { name: 'Testimonials', id: 'testimonials' },
  { name: 'Gallery',      id: 'gallery' },
  { name: 'Sponsors',     id: 'sponsors' },
];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const NavBar = () => {
  const [isOpen,     setIsOpen]     = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  /* Scroll-based background */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Active section via IntersectionObserver */
  useEffect(() => {
    const ids = [...NAV_LINKS.map(l => l.id), 'register'];
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActiveLink(visible[0].target.id);
        }
      },
      { rootMargin: '0px 0px -55% 0px', threshold: 0 }
    );

    elements.forEach(el => observer.observe(el));
    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  const handleNavClick = useCallback((id) => {
    scrollTo(id);
    setActiveLink(id);
    setIsOpen(false);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled
          ? 'bg-brand-dark/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3'
          : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-10 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group"
        >
          <img
            src={LOGO}
            alt="Singles Connect"
            className="h-10 w-10 rounded-full object-cover ring-2 ring-brand-gold/40 group-hover:ring-brand-gold transition-all duration-300"
          />
          {/* <span className="hidden sm:block text-white font-bold text-sm tracking-wider">
            <span className="text-brand-rose">SINGLES</span>{' '}
            <span className="text-brand-gold">CONNECT</span>
          </span> */}
        </button>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`text-sm font-medium tracking-wide transition-colors duration-200 relative
                after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-brand-gold after:transition-all after:duration-300
                ${activeLink === link.id
                  ? 'text-brand-gold after:w-full'
                  : 'text-white/80 hover:text-white after:w-0 hover:after:w-full'
                }`}
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <button
            onClick={() => handleNavClick('register')}
            className="btn-rose text-sm"
          >
            Register Now
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <HiX className="text-3xl" /> : <HiMenu className="text-3xl" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out
          ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="bg-brand-dark/98 backdrop-blur-md px-6 pb-6 pt-2 border-t border-white/5">
          <ul className="flex flex-col gap-1 mt-2">
            {NAV_LINKS.map(link => (
              <li key={link.id}>
                <button
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left py-3 px-3 rounded-lg text-base font-medium transition-colors duration-200
                    ${activeLink === link.id
                      ? 'text-brand-gold bg-brand-gold/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.name}
                </button>
              </li>
            ))}
            <li className="pt-3">
              <button
                onClick={() => handleNavClick('register')}
                className="btn-rose w-full text-sm"
              >
                Register Now
              </button>
            </li>
            {/* <li className="pt-1">
              <RouterLink
                to="/admin-login"
                onClick={() => setIsOpen(false)}
                className="block text-center py-2 text-xs text-white/30 hover:text-white/50 transition-colors"
              >
                Admin
              </RouterLink>
            </li> */}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
