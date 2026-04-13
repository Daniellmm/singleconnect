import React, { useState, useEffect } from 'react';
import NavBar from '../components/navBar';
import CountdownTimer from '../components/countdown';
import { supabase } from '../supabase';

import BackImg   from '../assets/heroBg.jpg';
import AboutImg  from '../assets/aboutImg.jpg';

import {
  FaFacebookF, FaInstagram, FaTwitter, FaEnvelope, FaPhone,
} from 'react-icons/fa';
import {
  HiOutlineLightBulb, HiOutlineChatAlt2, HiOutlineUserGroup,
  HiOutlineEmojiHappy, HiOutlineCamera, HiOutlineClock,
  HiOutlineLocationMarker, HiOutlineTicket, HiOutlineUsers,
  HiOutlineChevronDown, HiArrowRight, HiCheckCircle,
} from 'react-icons/hi';

/* ─── Section reveal hook ───────────────────────────────────────── */
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

/* ─── Section wrapper helpers ──────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <p className="section-label mb-4">{children}</p>
);

const SectionHeading = ({ children, light = true }) => (
  <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${light ? 'text-white' : 'text-brand-dark'}`}>
    {children}
  </h2>
);

/* ═════════
   1. HERO
═════════ */
const HeroSection = () => {
  const scrollToRegister = () => {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BackImg})` }}
      />
      <div className="absolute inset-0 bg-hero-gradient" />
      {/* Decorative orbs — flyer colours */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-rose/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-brand-gold/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-brand-purple/20 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-24 sm:pt-28 pb-28 sm:pb-40 text-center">

        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-black leading-none tracking-tight mb-4 animate-fade-up">
          <span className="text-brand-rose">SINGLES</span><br />
          <span className="text-brand-purple" style={{ WebkitTextStroke: '2px #19A88C' }}>CONNECT</span>
          <span className="block sm:inline text-gold-shimmer"> 2026</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-3xl font-light text-white/80 mt-4 mb-3 sm:mt-6 sm:mb-4 animate-fade-up tracking-widest uppercase">
          Meet&nbsp;·&nbsp;Connect&nbsp;·&nbsp;Grow
        </p>

        <p className="text-brand-muted text-xs sm:text-sm md:text-base font-medium mb-8 sm:mb-10 animate-fade-in leading-relaxed px-2">
          Saturday, May 2, 2026<br className="sm:hidden" />
          <span className="hidden sm:inline"> &nbsp;|&nbsp; </span>
          10:00 AM – 4:00 PM (WAT)<br className="sm:hidden" />
          <span className="hidden sm:inline"> &nbsp;|&nbsp; </span>
          Ibadan, Nigeria
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 animate-fade-up px-4 sm:px-0">
          <button onClick={scrollToRegister} className="btn-rose text-sm sm:text-base px-8 sm:px-10 py-4">
            Register Now — It&apos;s Free
          </button>
          <button
            onClick={scrollToAbout}
            className="btn-gold text-sm sm:text-base px-8 sm:px-10 py-4"
          >
            Learn More
          </button>
        </div>

        {/* Countdown */}
        <div className="flex justify-center animate-fade-in">
          <CountdownTimer />
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 hover:text-white/70 transition-colors"
        aria-label="Scroll down"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <HiOutlineChevronDown className="text-xl animate-bounce" />
      </button>
    </section>
  );
};

/* ══════════════
   2. ABOUT
══════════════ */
const AboutSection = () => (
  <section id="about" className="bg-brand-light py-28 px-6 lg:px-10 overflow-hidden">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

      {/* Image side */}
      <div className="reveal-left relative">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={AboutImg}
            alt="Singles Connect gathering"
            className="w-full h-[480px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent" />
          {/* Floating stat card */}
          <div className="absolute bottom-6 left-6 glass-card rounded-xl p-4 bg-brand-dark/80">
            <p className="text-brand-gold text-3xl font-black">6+</p>
            <p className="text-white text-xs uppercase tracking-widest">Years of Impact</p>
          </div>
        </div>
        {/* Decorative shape */}
        <div className="absolute -bottom-8 -left-8 w-40 h-40 border-2 border-brand-gold/20 rounded-2xl -z-10" />
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-rose/10 rounded-full blur-2xl -z-10" />
      </div>

      {/* Text side */}
      <div className="reveal-right">
        <SectionLabel>About Singles Connect</SectionLabel>
        <SectionHeading light={false}>
          A Space Built <br />
          <span className="text-brand-rose">for You</span>
        </SectionHeading>


        <div className="gold-line my-6" />

        <p className="text-brand-dark/70 text-base leading-relaxed mb-5">
          Singles Connect is an annual gathering designed to bring young adults together
          to bond, dine, network, and build wholesome relationships. Every year, we create
          a space where you can connect with like-minded people, receive life-changing
          teaching, play games, enjoy great food, and build friendships all within a
          safe, sane environment.
        </p>

        <blockquote className="border-l-4 border-brand-gold pl-5 py-1 bg-brand-gold/5 rounded-r-lg mb-6">
          <p className="text-brand-dark/80 italic text-sm leading-relaxed">
            "Singles Connect started six years ago as a vision to unite Christian singles
            in purposeful fellowship. The maiden edition was featured between three persons
            Bolu Ajetomobi and Deborah Iteghei (now in Qatar) with memorable activities:
            dinner nights, outings to IITA, UI Botanical Garden, and more."
          </p>
        </blockquote>

        <p className="text-brand-dark/60 text-sm mb-8">
          Join us in 2026 to be part of this growing movement!
        </p>

        <button
          onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
          className="btn-rose"
        >
          Secure Your Spot
        </button>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════════════════
   3. EVENT DETAILS
══════════════════════════════════════════════════════════════════ */
const eventDetails = [
  { icon: HiOutlineClock,           label: 'Date & Time',    value: 'Saturday, May 2, 2026', sub: '10:00 AM – 4:00 PM (WAT)' },
  { icon: HiOutlineLocationMarker,  label: 'Venue',          value: 'Ibadan, Nigeria',        sub: 'Full address coming soon' },
  { icon: HiOutlineUsers,           label: 'For',            value: 'Singles 21–40',          sub: 'Faith-based young adults' },
  { icon: HiOutlineTicket,          label: 'Admission',      value: 'Free Entry',             sub: 'Registration required' },
];

const EventDetailsSection = () => (
  <section className="bg-brand-darker py-24 px-6 lg:px-10">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-14 reveal">
        <SectionLabel>Event Details</SectionLabel>
        <SectionHeading>Everything You <span className="text-brand-gold">Need to Know</span></SectionHeading>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {eventDetails.map(({ icon: Icon, label, value, sub }, i) => (
          <div
            key={label}
            className="reveal glass-card rounded-2xl p-6 flex flex-col gap-3 hover:border-brand-gold/40 transition-all duration-300 hover:-translate-y-1"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center">
              <Icon className="text-brand-gold text-2xl" />
            </div>
            <p className="text-brand-muted text-xs uppercase tracking-widest">{label}</p>
            <p className="text-white font-bold text-lg">{value}</p>
            <p className="text-brand-muted text-sm">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ════════════
   4. WHAT TO EXPECT
════════════ */
const expectItems = [
  {
    icon: HiOutlineLightBulb,
    title: 'Powerful Teaching',
    desc: 'Receive relevant, practical, and faith rooted wisdom on relationships, purpose, and preparing for marriage.',
    color: 'from-brand-gold/20 to-brand-gold/5',
    iconColor: 'text-brand-gold',
  },
  {
    icon: HiOutlineChatAlt2,
    title: 'Panel Discussions',
    desc: 'Featured conversations with experienced voices who\'ve navigated relationships, singleness, and purpose. Ask your burning questions live.',
    color: 'from-brand-rose/20 to-brand-rose/5',
    iconColor: 'text-brand-rose',
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Dining Together',
    desc: 'Share a meal in a relaxed atmosphere that naturally opens doors to conversation and connection. Great food, great people.',
    color: 'from-brand-purple/20 to-brand-purple/5',
    iconColor: 'text-brand-purple-light',
  },
  {
    icon: HiOutlineEmojiHappy,
    title: 'Games & Fun',
    desc: 'Designed to break the ice and spark real connection. You\'ll laugh, compete, and maybe meet your new best friend.',
    color: 'from-brand-teal/20 to-brand-teal/5',
    iconColor: 'text-brand-teal',
  },
  {
    icon: HiOutlineUsers,
    title: 'Age-Group Networking',
    desc: 'Be grouped with people in your life stage for focused, relevant conversations. No awkward small talk just real connection.',
    color: 'from-brand-rose/20 to-brand-rose/5',
    iconColor: 'text-brand-rose',
  },
  {
    icon: HiOutlineCamera,
    title: 'Memories & Media',
    desc: 'Live coverage, content, and moments captured for you to keep and share. Your story starts here.',
    color: 'from-brand-gold/20 to-brand-gold/5',
    iconColor: 'text-brand-gold',
  },
];

const ExpectSection = () => (
  <section id="expect" className="bg-brand-dark py-28 px-6 lg:px-10">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16 reveal">
        <SectionLabel>What to Expect</SectionLabel>
        <SectionHeading>
          One Day.<br /><span className="text-brand-rose">Infinite Possibilities.</span>
        </SectionHeading>
        <p className="text-brand-muted mt-4 max-w-xl mx-auto text-sm leading-relaxed">
          Singles Connect packs an extraordinary amount of value into a single afternoon.
          Here is a taste of what awaits you.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {expectItems.map(({ icon: Icon, title, desc, color, iconColor }, i) => (
          <div
            key={title}
            className={`reveal glass-card rounded-2xl p-7 bg-gradient-to-br ${color} hover:scale-[1.02] transition-all duration-300 cursor-default`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className={`text-3xl mb-4 ${iconColor}`}>
              <Icon />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ════════
   5. SPEAKERS
════════ */
const speakers = [
  {
    name: 'Moroluwatiketike Abolaji-Adeola',
    shortName: 'Moroluwatiketike',
    role: 'Host / MC',
    bio: 'Prominent Nigerian gospel movie actress, entrepreneur, Event Compere/MC, Certified Voice-Over Talent and Christian content creator popularly known for her "Mummy Pastor" comedy skits. Holds a Second-Class Upper degree in Mass Communication from JABU. Happily married to Pastor Abolaji Adeola (RCCG), and blessed with two children.',
    photo: null,
    accentColor: 'border-brand-gold',
    labelColor: 'text-brand-gold',
  },
  {
    name: 'Nifemi Olawande',
    shortName: 'Nifemi Olawande',
    role: 'Speaker',
    bio: 'Bio coming soon.',
    photo: null,
    accentColor: 'border-brand-rose',
    labelColor: 'text-brand-rose',
  },
  {
    name: 'Darasimi Oyor',
    shortName: 'Darasimi Oyor',
    role: 'Speaker',
    bio: 'Bio coming soon.',
    photo: null,
    accentColor: 'border-brand-purple-light',
    labelColor: 'text-brand-purple-light',
  },
  {
    name: 'Tolulope Mike-Bamiloye',
    shortName: 'Tolulope Mike-Bamiloye',
    role: 'Speaker',
    bio: 'Bio coming soon.',
    photo: null,
    accentColor: 'border-brand-teal',
    labelColor: 'text-brand-teal',
  },
  {
    name: 'Emmanuella Mike-Bamiloye',
    shortName: 'Emmanuella Mike-Bamiloye',
    role: 'Speaker',
    bio: 'Bio coming soon.',
    photo: null,
    accentColor: 'border-brand-rose',
    labelColor: 'text-brand-rose',
  },
  {
    name: 'PVO',
    shortName: 'PVO',
    role: 'Speaker',
    bio: 'Bio coming soon.',
    photo: null,
    accentColor: 'border-brand-gold',
    labelColor: 'text-brand-gold',
  },
];

const SpeakerCard = ({ speaker, index }) => {
  const initials = speaker.shortName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`reveal glass-card rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-400 group border-t-2 ${speaker.accentColor}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Photo / initials placeholder */}
      <div className="relative h-56 bg-gradient-to-br from-brand-card to-brand-darker flex items-center justify-center overflow-hidden">
        {speaker.photo ? (
          <img src={speaker.photo} alt={speaker.shortName} className="w-full h-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
            {/* <span className={`text-6xl font-black ${speaker.labelColor} opacity-40`}>{initials}</span> */}
          </>
        )}
        <div className={`absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-brand-card to-transparent`} />
      </div>

      <div className="p-6">
        <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${speaker.labelColor}`}>
          {speaker.role}
        </p>
        <h3 className="text-white font-bold text-base leading-snug mb-3">
          {speaker.shortName}
        </h3>
        {speaker.bio !== 'Bio coming soon.' && (
          <p className="text-white/50 text-xs leading-relaxed line-clamp-4">
            {speaker.bio}
          </p>
        )}
        {speaker.bio === 'Bio coming soon.' && (
          <p className="text-white/30 text-xs italic">Bio & photo coming soon</p>
        )}
      </div>
    </div>
  );
};

const SpeakersSection = () => (
  <section id="speakers" className="bg-brand-darker py-28 px-6 lg:px-10 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16 reveal">
        <SectionLabel>Featured Speakers</SectionLabel>
        <SectionHeading>
          Voices That <span className="text-brand-gold">Shape Futures</span>
        </SectionHeading>
        <p className="text-brand-muted mt-4 max-w-xl mx-auto text-sm">
          World-class speakers, real conversations, life changing perspectives.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {speakers.map((speaker, i) => (
          <SpeakerCard key={speaker.name} speaker={speaker} index={i} />
        ))}
      </div>
    </div>
  </section>
);

/* ════════
   6. SCHEDULE
═════ */
const schedule = [
  { time: '10:00 AM – 10:30 AM', session: 'Arrival & Registration',       sub: 'Welcome Cocktail Hour',           accent: 'gold' },
  { time: '10:30 AM – 11:00 AM', session: 'Opening Ceremony',              sub: 'Welcome & Worship',               accent: 'rose' },
  { time: '11:00 AM – 12:00 PM', session: 'Main Teaching',                 sub: 'Minister of the Day',             accent: 'purple' },
  { time: '12:00 PM – 12:45 PM', session: 'Age-Based Networking',          sub: 'Focused group conversations',     accent: 'teal' },
  { time: '12:45 PM',            session: 'Testimony Time',                sub: '',                                accent: 'gold' },
  { time: '1:00 PM',             session: 'Lunch & Exhibition Hour',       sub: 'Dining & Partner Showcase',       accent: 'rose' },
  { time: '2:00 PM',             session: 'Panel Discussion',              sub: 'Live Q&A Session',                accent: 'purple' },
  { time: '3:15 PM',             session: 'Games & Group Activities',      sub: 'Break the ice, spark connection', accent: 'teal' },
  { time: '3:45 PM',             session: 'Closing Remarks & Prayer',      sub: '',                                accent: 'gold' },
  { time: '4:00 PM',             session: 'Official Close',                sub: 'Informal Mingling',               accent: 'rose' },
];

const scheduleAccent = {
  gold:   { border: 'border-brand-gold',         text: 'text-brand-gold',         dot: 'bg-brand-gold',         timeBg: 'bg-brand-gold/10',         ring: 'ring-brand-gold/40'   },
  rose:   { border: 'border-brand-rose',         text: 'text-brand-rose',         dot: 'bg-brand-rose',         timeBg: 'bg-brand-rose/10',         ring: 'ring-brand-rose/40'   },
  purple: { border: 'border-brand-purple-light', text: 'text-brand-purple-light', dot: 'bg-brand-purple-light', timeBg: 'bg-brand-purple-light/10', ring: 'ring-brand-purple/30' },
  teal:   { border: 'border-brand-teal',         text: 'text-brand-teal',         dot: 'bg-brand-teal',         timeBg: 'bg-brand-teal/10',         ring: 'ring-brand-teal/40'   },
};

const ScheduleCard = ({ time, session, sub, a, index, side }) => (
  <div className={`
    group relative glass-card rounded-2xl p-6 border-t-2 ${a.border}
    hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 overflow-hidden
    ${side === 'right' ? 'text-left' : 'text-right'}
  `}>
    {/* Decorative step number */}
    <span className={`
      absolute ${side === 'right' ? '-right-3 -top-3' : '-left-3 -top-3'}
      text-7xl font-black ${a.text} opacity-[0.07] leading-none select-none pointer-events-none
    `}>
      {String(index + 1).padStart(2, '0')}
    </span>

    {/* Time badge */}
    <div className={`
      inline-flex items-center px-3 py-1 rounded-full ${a.timeBg} mb-3
      ${side === 'right' ? '' : 'ml-auto'}
    `}>
      <span className={`text-[10px] font-bold ${a.text} uppercase tracking-widest`}>{time}</span>
    </div>

    <h3 className="text-white font-bold text-base leading-snug mb-1">{session}</h3>
    {sub && <p className="text-brand-muted text-xs leading-relaxed">{sub}</p>}
  </div>
);

const ScheduleSection = () => (
  <section id="schedule" className="bg-brand-darker py-28 px-6 lg:px-10 overflow-hidden relative">
    {/* Ambient orbs */}
    {/* <div className="absolute top-1/4 left-0 w-80 h-80 bg-brand-rose/5 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-purple/5 rounded-full blur-[140px] pointer-events-none" /> */}

    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-20 reveal">
        <SectionLabel>Program Schedule</SectionLabel>
        <SectionHeading>
          The <span className="text-brand-rose">Lineup</span>
        </SectionHeading>
        <p className="text-brand-muted mt-4 text-sm tracking-wide">Saturday, May 2, 2026 &nbsp;·&nbsp; Ibadan, Nigeria</p>
      </div>

      {/* ── Desktop: alternating zigzag ── */}
      <div className="hidden lg:block relative">
        {/* Gradient spine */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-rose/50 via-brand-gold/40 to-brand-teal/30" />

        <div className="flex flex-col gap-6">
          {schedule.map(({ time, session, sub, accent }, i) => {
            const a = scheduleAccent[accent];
            const isEven = i % 2 === 0;
            return (
              <div
                key={i}
                className="reveal grid grid-cols-[1fr_3rem_1fr] items-center"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                {/* Left slot */}
                <div className="pr-6 flex justify-end">
                  {isEven
                    ? <div className="w-full max-w-sm"><ScheduleCard time={time} session={session} sub={sub} a={a} index={i} side="left" /></div>
                    : null
                  }
                </div>

                {/* Center dot */}
                <div className="flex items-center justify-center">
                  <div className={`w-5 h-5 rounded-full ${a.dot} ring-4 ${a.ring} ring-offset-2 ring-offset-brand-darker z-10 flex-shrink-0`} />
                </div>

                {/* Right slot */}
                <div className="pl-6 flex justify-start">
                  {!isEven
                    ? <div className="w-full max-w-sm"><ScheduleCard time={time} session={session} sub={sub} a={a} index={i} side="right" /></div>
                    : null
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile: left-spine layout ── */}
      <div className="lg:hidden relative">
        {/* Left spine */}
        <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-rose/50 via-brand-gold/40 to-brand-teal/30" />

        <div className="flex flex-col gap-5">
          {schedule.map(({ time, session, sub, accent }, i) => {
            const a = scheduleAccent[accent];
            return (
              <div
                key={i}
                className="reveal flex items-start gap-5"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                {/* Dot */}
                <div className="flex-shrink-0 mt-5 z-10">
                  <div className={`w-4 h-4 rounded-full ${a.dot} ring-4 ${a.ring} ring-offset-2 ring-offset-brand-darker`} />
                </div>

                {/* Card */}
                <div className="flex-1 min-w-0">
                  <div className={`glass-card rounded-xl p-4 border-l-2 ${a.border}`}>
                    <span className={`text-[10px] font-bold ${a.text} uppercase tracking-widest block mb-1.5`}>{time}</span>
                    <p className="text-white font-semibold text-sm leading-snug">{session}</p>
                    {sub && <p className="text-brand-muted text-xs mt-0.5">{sub}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

/* ═══════
   7. TESTIMONIALS
═══════ */
const testimonials = [
  {
    quote: "I came not knowing what to expect, and left with three genuine friends and a completely new perspective on singleness. It wasn't a 'find a spouse' event it was a 'find yourself' event. Completely life changing.",
    name: 'Adunola',
    tag: 'Ibadan · 2025 edition',
    accent: 'border-brand-gold',
    quoteColor: 'text-brand-gold/30',
  },
  {
    quote: "The panel session alone was worth showing up for. They answered questions I'd been afraid to ask out loud for years. I finally felt seen and understood.",
    name: 'Tunde',
    tag: 'Lagos · 2024 edition',
    accent: 'border-brand-rose',
    quoteColor: 'text-brand-rose/30',
  },
  {
    quote: "My husband and I actually connected at a church event similar to this one. Singles Connect creates the kind of environment where that's relaxed, intentional, and full of real people.",
    name: 'Blessing & Femi',
    tag: 'Couple Testimony',
    accent: 'border-brand-purple-light',
    quoteColor: 'text-brand-purple-light/30',
  },
];

const TestimonialsSection = () => (
  <section id="testimonials" className="bg-brand-dark py-28 px-6 lg:px-10 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16 reveal">
        <SectionLabel>Testimonials</SectionLabel>
        <SectionHeading>
          Stories That <span className="text-brand-gold">Inspire</span>
        </SectionHeading>
        <p className="text-brand-muted mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
          Singles Connect has been a turning point for many. Friendships formed.
          Perspectives shifted. A few love stories began. Read what past attendees
          have said and imagine what your story could be.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-7">
        {testimonials.map(({ quote, name, tag, accent, quoteColor }, i) => (
          <div
            key={i}
            className={`reveal glass-card rounded-2xl p-8 flex flex-col gap-5 border-l-4 ${accent} hover:-translate-y-2 transition-all duration-300`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            {/* Large quote mark */}
            <span className={`${quoteColor} text-7xl font-black leading-none -mb-4`}>"</span>
            <p className="text-white/80 text-sm leading-relaxed flex-1">{quote}</p>
            <div>
              <p className="text-white font-semibold text-sm">— {name}</p>
              <p className="text-brand-muted text-xs mt-0.5">{tag}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA to share story */}
      {/* <div className="text-center mt-14 reveal">
        <p className="text-brand-muted text-sm mb-4">Have a story from a past edition?</p>
        <a
          href="mailto:hello@singlesconnect.ng?subject=My Singles Connect Story"
          className="btn-gold text-sm"
        >
          Share Your Story <HiArrowRight className="inline" />
        </a>
      </div> */}
    </div>
  </section>
);

/* ════════
   8. GALLERY
════════ */
const albums = [
  {
    year: '2023',
    label: "Singles' Connect 2023",
    desc: 'The edition that set the standard. Great moments, great people.',
    href: 'https://photos.app.goo.gl/singlesconnect2023',
    gradient: 'from-brand-gold/30 to-brand-gold/5',
  },
  {
    year: '2024',
    label: "Singles Connect '24",
    desc: 'Bigger, bolder, and more impactful than ever.',
    href: 'https://photos.app.goo.gl/singlesconnect2024',
    gradient: 'from-brand-rose/30 to-brand-rose/5',
  },
  {
    year: '2025',
    label: 'SC 2025',
    desc: 'The most recent chapter — watch the highlights.',
    href: 'https://photos.app.goo.gl/singlesconnect2025',
    gradient: 'from-brand-purple/30 to-brand-purple/5',
  },
];

const GallerySection = () => (
  <section id="gallery" className="bg-brand-darker py-28 px-6 lg:px-10 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16 reveal">
        <SectionLabel>Gallery</SectionLabel>
        <SectionHeading>
          Photo <span className="text-brand-rose">Memories</span>
        </SectionHeading>
        <p className="text-brand-muted mt-4 max-w-xl mx-auto text-sm">
          Moments captured from past editions of Singles Connect.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-7">
        {albums.map(({ year, label, desc, href, gradient }, i) => (
          <a
            key={year}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`reveal glass-card rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 block`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            {/* Fake photo placeholder */}
            <div className={`h-52 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
              <span className="text-8xl font-black text-white/10">{year}</span>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-dark/40">
                <span className="text-white text-sm font-semibold tracking-widest uppercase flex items-center gap-2">
                  View Photos <HiArrowRight />
                </span>
              </div>
            </div>
            <div className="p-6">
              <p className="text-brand-gold text-xs font-semibold uppercase tracking-widest mb-1">{year} Edition</p>
              <h3 className="text-white font-bold text-base mb-1">{label}</h3>
              <p className="text-white/50 text-xs">{desc}</p>
            </div>
          </a>
        ))}
      </div>

      {/* <div className="text-center mt-10 reveal">
        <a href="https://instagram.com/singlesconnect" target="_blank" rel="noopener noreferrer" className="btn-gold text-sm">
          See More on Instagram <HiArrowRight className="inline ml-1" />
        </a>
      </div> */}
    </div>
  </section>
);

/* ═══════════
   9. SPONSORS / PARTNERS
═══════════ */
const partners = [
  { name: 'MTN Nigeria',                 category: 'Telecom & Digital Services' },
  { name: 'Adorn Homes',                 category: 'Real Estate' },
  { name: 'Food Brand (TBC)',            category: 'Refreshments & Dining' },
  { name: 'First Bank',                  category: 'Banking & Finance' },
  { name: 'Dominican University',        category: 'University Partner' },
  { name: 'Precious Cornerstone University', category: 'University Partner' },
];

const SponsorsSection = () => (
  <section id="sponsors" className="bg-brand-light py-28 px-6 lg:px-10 overflow-hidden">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16 reveal">
        <SectionLabel>Exhibition & Partners</SectionLabel>
        <SectionHeading light={false}>
          Brands That Believe <br />
          <span className="text-brand-rose">in Your Future</span>
        </SectionHeading>
        <p className="text-brand-dark/60 mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
          We&apos;ve curated a select group of brands that serve and empower young adults.
          Meet them at our exhibition floor to explore products, services, and opportunities
          designed for where you&apos;re going.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {partners.map(({ name, category }, i) => (
          <div
            key={name}
            className="reveal border border-brand-dark/10 rounded-2xl p-6 text-center hover:border-brand-rose/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white"
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <div className="w-12 h-12 rounded-full bg-brand-purple/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-brand-purple-light font-black text-lg">{name[0]}</span>
            </div>
            <p className="text-brand-dark font-bold text-sm mb-1">{name}</p>
            <p className="text-brand-dark/50 text-xs">{category}</p>
          </div>
        ))}
      </div>

      {/* <div className="text-center mt-12 reveal">
        <p className="text-brand-dark/50 text-sm mb-3">Interested in partnering with us?</p>
        <a href="mailto:hello@singlesconnect.ng?subject=Partnership Enquiry" className="btn-rose text-sm">
          Become a Partner
        </a>
      </div> */}
    </div>
  </section>
);

/* ═══════════
   10. REGISTRATION
═══════════ */
const HEAR_OPTIONS = [
  'Instagram', 'Facebook', 'WhatsApp', 'Friend / Word of Mouth',
  'Church Announcement', 'Flyer / Poster', 'Other',
];

const initialForm = {
  fullName: '', phone: '', email: '',
  ageGroup: '', gender: '', hearAboutUs: '', church: '',
};

const RegistrationSection = () => {
  const [form, setForm]       = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, phone, email, ageGroup, gender } = form;
    if (!fullName || !phone || !email || !ageGroup || !gender) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const { error: sbError } = await supabase.from('registrations').insert({
        full_name:  form.fullName,
        phone:      form.phone,
        email:      form.email,
        age_group:  form.ageGroup,
        gender:     form.gender,
        hear_about: form.hearAboutUs,
        church:     form.church,
      });
      if (sbError) throw sbError;
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setError(
        err?.message?.includes('duplicate')
          ? 'This email is already registered. See you on May 2!'
          : 'Oops! Something went wrong. Please try again.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register" className="bg-brand-darker py-28 px-6 lg:px-10 overflow-hidden relative">
      {/* Background orb */}
      {/* <div className="absolute top-0 right-0 w-96 h-96 bg-brand-rose/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-purple/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px] pointer-events-none" /> */}

      <div className="max-w-3xl mx-auto relative">
        <div className="text-center mb-14 reveal">
          <SectionLabel>Registration</SectionLabel>
          <SectionHeading>
            Secure Your <span className="text-brand-gold">Spot</span>
          </SectionHeading>
          <p className="text-brand-muted mt-4 text-sm leading-relaxed">
            Singles Connect 2026 is <strong className="text-white">free to attend</strong>.
            Register now and we&apos;ll send the final venue details directly to you.
          </p>
        </div>

        {success ? (
          <div className="reveal glass-card rounded-2xl p-5  text-center">
            <HiCheckCircle className="text-brand-gold text-6xl mx-auto mb-4" />
            <h3 className="text-white font-bold text-2xl mb-2">You&apos;re registered!</h3>
            <p className="text-brand-muted text-sm leading-relaxed max-w-md mx-auto">
              Thank you for registering for Singles Connect 2026. We&apos;ll be in touch
              with venue details and updates. See you on May 2!
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="reveal glass-card rounded-2xl p-3  md:p-10 flex flex-col gap-5"
          >
            {error && (
              <p className="text-brand-rose text-sm bg-brand-rose/10 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            {/* Row 1 */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-muted text-xs uppercase tracking-widest font-semibold">
                  Full Name <span className="text-brand-rose">*</span>
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-muted text-xs uppercase tracking-widest font-semibold">
                  Phone Number <span className="text-brand-rose">*</span>
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+234 800 000 0000"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                  required
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-muted text-xs uppercase tracking-widest font-semibold">
                Email Address <span className="text-brand-rose">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@email.com"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                required
              />
            </div>

            {/* Row 3 */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-muted text-xs uppercase tracking-widest font-semibold">
                  Age Group <span className="text-brand-rose">*</span>
                </label>
                <select
                  name="ageGroup"
                  value={form.ageGroup}
                  onChange={handleChange}
                  className="bg-brand-card border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors appearance-none"
                  required
                >
                  <option value="" disabled>Select age group</option>
                  <option value="22-26">22 – 26</option>
                  <option value="27-30">27 – 30</option>
                  <option value="31-35">31 – 35</option>
                  <option value="36+">36+</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-muted text-xs uppercase tracking-widest font-semibold">
                  Gender <span className="text-brand-rose">*</span>
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="bg-brand-card border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors appearance-none"
                  required
                >
                  <option value="" disabled>Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Row 4 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-muted text-xs uppercase tracking-widest font-semibold">
                How did you hear about us?
              </label>
              <select
                name="hearAboutUs"
                value={form.hearAboutUs}
                onChange={handleChange}
                className="bg-brand-card border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors appearance-none"
              >
                <option value="">Select an option</option>
                {HEAR_OPTIONS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* Row 5 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-muted text-xs uppercase tracking-widest font-semibold">
                Church / Organisation <span className="text-white/20 text-[10px] normal-case tracking-normal">(optional)</span>
              </label>
              <input
                name="church"
                value={form.church}
                onChange={handleChange}
                placeholder="Your church or organisation"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-rose text-base py-4 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting…' : 'Register Now'}
            </button>

            <p className="text-white/30 text-xs text-center">
              Your information is safe with us. No spam, ever.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};

/* ════════
   11. FAQ
════════ */
const faqs = [
  {
    q: 'Is there an admission fee?',
    a: 'Singles Connect 2026 is completely free to attend. However, registration is required to secure your spot and receive venue details.',
  },
  {
    q: 'Who is this event for?',
    a: 'The event is designed for single young adults typically between the ages of 21 and 40, seeking faith-based connections. All are welcome.',
  },
  {
    q: 'Where exactly is the event held?',
    a: 'The final venue will be announced soon. Confirmed options are within Ibadan. Register and we\'ll send you the details directly.',
  },
  {
    q: 'Can I come with a friend?',
    a: 'Absolutely! We encourage you to bring a friend. Just ensure both of you register individually.',
  },
  {
    q: 'Will there be food?',
    a: 'Yes! Dining is a core part of the Singles Connect experience. Refreshments and a full meal are included.',
  },
  {
    q: 'Will the sessions be recorded?',
    a: 'Session recordings and follow-up resources may be made available after the event via our website and social media.',
  },
  {
    q: 'How do I submit a question for the panel?',
    a: 'You can submit questions through the website before the event, or submit them live on the day using the provided method.',
  },
  {
    q: 'How do I volunteer?',
    a: 'Contact us via the form below or reach out on social media. We\'re looking for people to serve on Registration, Setup, Media, Hospitality, Ushering, and Security teams.',
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-brand-dark/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className={`font-semibold text-sm md:text-base transition-colors duration-200 ${open ? 'text-brand-rose' : 'text-brand-dark group-hover:text-brand-rose'}`}>
          {q}
        </span>
        <HiOutlineChevronDown
          className={`flex-shrink-0 ml-4 text-brand-dark/40 text-xl transition-transform duration-300 ${open ? 'rotate-180 text-brand-rose' : ''}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-400 ease-in-out ${open ? 'max-h-64 pb-5' : 'max-h-0'}`}>
        <p className="text-brand-dark/60 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
};

const FAQSection = () => (
  <section id="faq" className="bg-brand-light py-28 px-6 lg:px-10 overflow-hidden">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-14 reveal">
        <SectionLabel>FAQ</SectionLabel>
        <SectionHeading light={false}>
          Frequently Asked <span className="text-brand-rose">Questions</span>
        </SectionHeading>
      </div>

      <div className="reveal bg-white rounded-2xl px-6 md:px-10 shadow-sm">
        {faqs.map(item => (
          <FAQItem key={item.q} {...item} />
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════════════════
   12. FOOTER
══════════════════════════════════════════════════════════════════ */
const FooterSection = () => (
  <footer id="footer" className="bg-brand-dark/95 border-t border-white/5 pt-20 pb-8 px-6 lg:px-10">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-white/5">

        {/* Brand */}
        <div className="lg:col-span-1">
          <p className="text-white font-black text-xl tracking-wider mb-2">
            <span className="text-brand-rose">SINGLES</span>{' '}
            <span className="text-brand-gold">CONNECT</span>
          </p>
          <p className="text-xs text-brand-gold tracking-widest uppercase mb-4">2026</p>
          <p className="text-white/50 text-xs leading-relaxed">
            An annual gathering for single young adults to bond, connect, and grow in faith-rooted community.
          </p>
          <div className="flex gap-4 mt-6">
            {[
              { Icon: FaFacebookF, href: 'https://facebook.com/singlesconnect' },
              { Icon: FaInstagram, href: 'https://instagram.com/singlesconnect' },
              { Icon: FaTwitter,   href: 'https://twitter.com/singlesconnect' },
            ].map(({ Icon, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-purple flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
              >
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Quick Links</p>
          <ul className="flex flex-col gap-2">
            {['About', 'Speakers', 'Schedule', 'Testimonials', 'Gallery', 'Sponsors'].map(link => (
              <li key={link}>
                <button
                  onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-white/50 hover:text-brand-gold text-xs transition-colors duration-200"
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Contact</p>
          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-3 text-white/50 text-xs">
              <FaEnvelope className="text-brand-gold flex-shrink-0" />
              <a href="mailto:hello@singlesconnect.ng" className="hover:text-white transition-colors">
                @singlesconnect
              </a>
            </li>
            <li className="flex items-center gap-3 text-white/50 text-xs">
              <FaPhone className="text-brand-gold flex-shrink-0" />
              <span>+234-XXX-XXXX</span>
            </li>
            <li className="flex items-center gap-3 text-white/50 text-xs">
              <HiOutlineLocationMarker className="text-brand-gold flex-shrink-0 text-sm" />
              <span>Ibadan, Nigeria</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        {/* <div>
          <p className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Stay Updated</p>
          <p className="text-white/50 text-xs mb-4 leading-relaxed">
            Subscribe for event updates, speaker announcements, and more.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors min-w-0"
            />
            <button
              type="submit"
              className="bg-brand-rose hover:bg-brand-rose-dark text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div> */}
      </div>

      {/* Bottom bar */}
      <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-white/30 text-xs">
          © 2026 Singles Connect. All rights reserved. | Ibadan, Nigeria
        </p>
        <p className="text-white/20 text-xs">
          Built with ❤️ for singles everywhere
        </p>
      </div>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════════════════════════ */
const HomePage = () => {
  useReveal();

  return (
    <>
      <NavBar />
      <HeroSection />
      <AboutSection />
      <EventDetailsSection />
      <ExpectSection />
      <SpeakersSection />
      <ScheduleSection />
      <TestimonialsSection />
      <GallerySection />
      <SponsorsSection />
      <RegistrationSection />
      <FAQSection />
      <FooterSection />
    </>
  );
};

export default HomePage;
