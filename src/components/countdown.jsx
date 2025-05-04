import React, { useEffect, useState } from "react";
import OK from '../assets/ok.jpg'

const CountdownTimer = () => {
    const calculateTimeLeft = () => {
        const targetDate = new Date("2025-05-10T00:00:00");
        const now = new Date();
        const difference = targetDate - now;

        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
                hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
                minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
                seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
            };
        } else {
            timeLeft = { days: "00", hours: "00", minutes: "00", seconds: "00" };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col lg:flex-row justify-center items-center gap-y-6 lg:gap-x-44 bg-pink-100 shadow-lg rounded-lg py-8 px-6 w-full mx-3">
            <div className="bg-pink-100 p-4 rounded-lg text-center w-full lg:w-auto">
                <div>
                    <img src={OK} className="lg:h-36" alt="" />
                </div>
            </div>
            <div className="flex justify-center gap-6 flex-wrap">
                <div className="flex justify-center items-center flex-wrap">
                    {/* Time Unit Container - Days */}
                    <div className="text-center">
                        <p className="text-4xl md:text-7xl font-bold text-black">{timeLeft.days}</p>
                        <p className="text-pink-600 text-xl font-semibold mt-1">Days</p>
                    </div>
                    
                    {/* Colon Separator */}
                    <div className="flex flex-col justify-center h-full mx-2 md:mx-4">
                        <p className="text-4xl md:text-6xl font-bold text-black self-center mb-6">:</p>
                    </div>
                    
                    {/* Time Unit Container - Hours */}
                    <div className="text-center">
                        <p className="text-4xl md:text-7xl font-bold text-black">{timeLeft.hours}</p>
                        <p className="text-pink-600 text-xl font-semibold mt-1">Hrs</p>
                    </div>
                    
                    {/* Colon Separator */}
                    <div className="flex flex-col justify-center h-full mx-2 md:mx-4">
                        <p className="text-4xl md:text-6xl font-bold text-black self-center mb-6">:</p>
                    </div>
                    
                    {/* Time Unit Container - Minutes */}
                    <div className="text-center">
                        <p className="text-4xl md:text-7xl font-bold text-black">{timeLeft.minutes}</p>
                        <p className="text-pink-600 text-xl font-semibold mt-1">Mins</p>
                    </div>
                    
                    {/* Colon Separator */}
                    <div className="flex flex-col justify-center h-full mx-2 md:mx-4">
                        <p className="text-4xl md:text-6xl font-bold text-black self-center mb-6">:</p>
                    </div>
                    
                    {/* Time Unit Container - Seconds */}
                    <div className="text-center">
                        <p className="text-4xl md:text-7xl font-bold text-black">{timeLeft.seconds}</p>
                        <p className="text-pink-600 text-xl font-semibold mt-1">Secs</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CountdownTimer;