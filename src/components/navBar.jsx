import React, { useState, useEffect } from 'react'
import { HiMenu, HiX } from 'react-icons/hi';
import LOGO from '../assets/logo.jpg'
import { Link as ScrollLink } from 'react-scroll';


const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeLink, setActiveLink] = useState('Home');

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Array of navigation links for both desktop and mobile
    const navLinks = [
        { name: 'Home', href: '#home', id: 'home' },
        { name: 'About S.C.', href: '#about', id: 'about' },
        { name: 'Ministers', href: '#ministers', id: 'ministers' },
        { name: 'Gallery', href: '#gallery', id: 'gallery' },
        { name: 'Dashboard', href: '/admin-login', id: '' }
    ];

    // Function to handle scrolling to sections
    const scrollToSection = (id, linkName) => {
        if (linkName === 'Dashboard') return; // This will navigate normally
        
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
                    <img src={LOGO} className='h-12 rounded-full' alt="" />
                </div>
                <div className='lg:hidden'>
                    <button onClick={toggleMenu}>
                        {isOpen ? <HiX className='text-3xl' /> : <HiMenu className='text-3xl' />}
                    </button>
                </div>
                <div className='hidden lg:flex'>
                    <ul className='flex space-x-5 lg:space-x-14'>
                        {navLinks.map(link => (
                            <li
                                key={link.name}
                                onClick={() => scrollToSection(link.id, link.name)}
                                className={`font-semibold text-md cursor-pointer relative after:content-[''] after:absolute after:h-[2px] after:bg-pink-600 after:w-full after:left-0 after:-bottom-1 ${activeLink === link.name ? 'after:visible' : 'after:invisible'
                                    }`}
                            >
                                {link.name === 'Dashboard' ? (
                                    <a href={link.href} className="block">
                                        {link.name}
                                    </a>
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
                        className={`bg-transparent border-[2px] rounded-lg font-bold text-lg md:text-[12px] py-2 px-4 border-black ${scrolled ? 'border-black' : 'border-white hover:bg-white hover:text-black'
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
                        {navLinks.filter(link => link.name !== 'Dashboard').map(link => (
                            <li 
                                key={link.name}
                                onClick={() => scrollToSection(link.id, link.name)}
                                className='font-semibold text-xl cursor-pointer'
                            >
                                {link.name}
                            </li>
                        ))}
                        <li className='pt-4'>
                            <ScrollLink
                                to="register"
                                smooth={true}
                                duration={500}
                                offset={-70}
                                className='bg-transparent border-[2px] rounded-lg text-black font-bold text-sm py-3 px-2 border-black mt-3 w-full text-center cursor-pointer'
                                onClick={() => setIsOpen(false)} 
                            >
                                REGISTER NOW
                            </ScrollLink>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export default NavBar