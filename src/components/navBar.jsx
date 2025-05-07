import React, { useState, useEffect } from 'react'
import { HiMenu, HiX } from 'react-icons/hi';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import LOGO from '../assets/logo.jpg'

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeLink, setActiveLink] = useState('Home');

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: 'Home', id: 'home', type: 'scroll' },
        { name: 'About S.C.', id: 'about', type: 'scroll' },
        { name: 'Ministers', id: 'ministers', type: 'scroll' },
        { name: 'Gallery', id: 'gallery', type: 'scroll' },
        { name: 'Dashboard', path: '/admin-login', type: 'route' }
    ];

    // Handle scroll effect for navbar background
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    
    useEffect(() => {
        const sectionIds = navLinks.filter(link => link.type === 'scroll').map(link => link.id);
        const sectionElements = sectionIds.map(id => document.getElementById(id));
        
        // Configuration for the observer
        const observerOptions = {
            root: null, 
            rootMargin: '1% 0px', 
            threshold: 0.6 
        };
        
        const observerCallback = (entries) => {
            // Filter for only the entries that are currently intersecting
            const visibleEntries = entries.filter(entry => entry.isIntersecting);
            
            if (visibleEntries.length > 0) {
                // If multiple sections are visible, take the first one (highest in the DOM)
                const sectionId = visibleEntries[0].target.id;
                const navItem = navLinks.find(link => link.id === sectionId);
                if (navItem) {
                    setActiveLink(navItem.name);
                }
            }
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        
        sectionElements.forEach(element => {
            if (element) {
                observer.observe(element);
            }
        });
        
        return () => {
            sectionElements.forEach(element => {
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, [navLinks]); 

    // Function to handle scrolling to sections
    const scrollToSection = (id, linkName) => {
        const target = document.getElementById(id);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            setActiveLink(linkName);
            setIsOpen(false); // Close mobile menu after clicking
        }
    };

    return (
        <div className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 lg:pt-4
            ${scrolled ? 'bg-white shadow-md' : 'lg:bg-transparent lg:text-white bg-white text-black'} 
            py-1 px-8 lg:px-20`}>

            <div className='flex justify-between items-center'>
                <div className='flex justify-center font-bold'>
                    <img src={LOGO} className='h-12 rounded-full' alt="Logo" />
                </div>
                <div className='lg:hidden'>
                    <button onClick={toggleMenu} aria-label="Toggle menu">
                        {isOpen ? <HiX className='text-3xl' /> : <HiMenu className='text-3xl' />}
                    </button>
                </div>
                <div className='hidden lg:flex'>
                    <ul className='flex space-x-5 lg:space-x-14'>
                        {navLinks.map(link => (
                            <li
                                key={link.name}
                                onClick={() => link.type === 'scroll' && scrollToSection(link.id, link.name)}
                                className={`font-semibold text-md cursor-pointer relative after:content-[''] after:absolute after:h-[2px] after:bg-pink-600 after:w-full after:left-0 after:-bottom-1 transition-all duration-300 ${activeLink === link.name ? 'after:visible' : 'after:invisible'
                                    }`}
                            >
                                {link.type === 'route' ? (
                                    <RouterLink to={link.path} className="block">
                                        {link.name}
                                    </RouterLink>
                                ) : (
                                    <span className="block">{link.name}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='hidden lg:block'>
                    <ScrollLink
                        to="register"
                        smooth={true}
                        duration={500}
                        offset={-70}
                        className={`bg-transparent border-[2px] rounded-lg font-bold text-lg md:text-[12px] py-2 px-4 border-black ${scrolled ? 'border-black' : 'border-white hover:text-black'
                            } hover:bg-pink-600 hover:border-pink-600 hover:text-white transition duration-500 cursor-pointer`}
                    >
                        REGISTER NOW
                    </ScrollLink>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className='lg:hidden mt-4 text-black p-4 rounded'>
                    <ul className='flex flex-col space-y-4'>
                        {navLinks.map(link => (
                            <li 
                                key={link.name}
                                onClick={() => link.type === 'scroll' 
                                    ? scrollToSection(link.id, link.name) 
                                    : setIsOpen(false)}
                                className={`font-semibold text-xl cursor-pointer relative after:content-[''] after:absolute after:h-[2px] after:bg-pink-600 after:w-full after:left-0 after:-bottom-1 ${activeLink === link.name ? 'after:visible' : 'after:invisible'}`}
                            >
                                {link.type === 'route' ? (
                                    <RouterLink to={link.path} className="block">
                                        {link.name}
                                    </RouterLink>
                                ) : (
                                    <span className="block">{link.name}</span>
                                )}
                            </li>
                        ))}
                        <li className='pt-4'>
                            <button
                                className='bg-transparent border-[2px] rounded-lg text-black font-bold text-sm py-3 px-2 border-black mt-3 w-full text-center cursor-pointer'
                            >
                                <a href="https://bit.ly/singlesconnect25">REGISTER NOW</a>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export default NavBar