import React, { useEffect, useState } from 'react';

const TARGET = new Date('2026-05-16T10:00:00');

const calcTimeLeft = () => {
  const diff = TARGET - new Date();
  if (diff <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00' };
  return {
    days:    String(Math.floor(diff / 864e5)).padStart(2, '0'),
    hours:   String(Math.floor((diff / 36e5) % 24)).padStart(2, '0'),
    minutes: String(Math.floor((diff / 6e4) % 60)).padStart(2, '0'),
    seconds: String(Math.floor((diff / 1e3) % 60)).padStart(2, '0'),
  };
};

const Unit = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-[60px] h-[60px] sm:w-20 sm:h-20 md:w-28 md:h-28 glass-card rounded-xl flex items-center justify-center">
      <span className="text-xl sm:text-3xl md:text-5xl font-bold text-white tabular-nums leading-none">
        {value}
      </span>
    </div>
    <span className="mt-1.5 sm:mt-2 text-[9px] sm:text-xs md:text-sm font-semibold tracking-widest uppercase text-brand-gold">
      {label}
    </span>
  </div>
);

const Colon = () => (
  <div className="flex flex-col items-center gap-2 sm:gap-3 pb-5 sm:pb-7">
    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-brand-gold opacity-80" />
    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-brand-gold opacity-80" />
  </div>
);

const CountdownTimer = () => {
  const [time, setTime] = useState(calcTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
      <Unit value={time.days}    label="Days"    />
      <Colon />
      <Unit value={time.hours}   label="Hours"   />
      <Colon />
      <Unit value={time.minutes} label="Minutes" />
      <Colon />
      <Unit value={time.seconds} label="Seconds" />
    </div>
  );
};

export default CountdownTimer;
