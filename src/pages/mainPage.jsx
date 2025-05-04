import React, { useRef } from 'react'
import NavBar from '../components/navBar'
import BackImg from '../assets/mainbg.jpg';
import WINLOS from '../assets/winlos.png'
import SINGLE from '../assets/singles.png'
import SC from '../assets/sc.png'
import CONNECT from '../assets/connect.png'
import RBG from '../assets/rgb.png'
import CountdownTimer from '../components/countdown';
import VideoPlayer from '../components/videoPlayer';

import { FaFacebookF, FaInstagram } from "react-icons/fa";


const HomePage = () => {

    const scrollToRegister = () => {
        const registerSection = document.getElementById("register");
        
        if (registerSection) {
          registerSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      };

    return (
        <>
            <NavBar />
            <section id="home" className='h-screen px-10 relative hero'>
                <div className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${BackImg})` }}></div>
                <div className="absolute inset-0 bg-black opacity-90 z-0"></div>

                <div className='relative z-10 flex flex-col justify-center lg:px-14 items-center h-full '>
                    <h1 className='text-white text-center lg:leading-[130px] text-4xl lg:text-[120px] font-bold'>
                        Singles Connect is Here Again
                    </h1>
                    <p className='text-white text-center lg:text-2xl pt-4'>
                        10th May 2025, Men Of Issachar Version Ojoo Ibadan.
                    </p>

                </div>
                <div className='absolute right-0 left-0 justify-center bottom-[-80px] flex w-full '>
                    <CountdownTimer />
                </div>
            </section>

            <section id="about" className='pb-16 pt-32 bg-white px-10 about'>
                <div className='flex flex-col justify-center items-center '>
                    <p className='lg:text-2xl text-sm text-center font-semibold text-pink-600'>Welcome To Singles Connect Offical Website</p>

                    <div className='lg:pt-9 pt-5 px-5 flex justify-center'>
                        <h1 className='lg:text-7xl text-2xl text-center font-bold lg:leading-[35px]'>Are you ready for a Lasting <br /> <span className='text-black/10 tracking-[20px] text-3xl lg:text-8xl'>EXPIRENCE</span></h1>
                    </div>

                    <div className='flex justify-center items-center w-20 h-[3px] rounded-xl mt-4 animate-ping bg-pink-600'></div>

                    <div className='lg:px-44 pt-10'>
                        <p className='text-xl text-center leading-relaxed text-gray-500'>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto enim debitis suscipit molestias,
                            ut est incidunt vero odio rem necessitatibus tempore, non quae quasi id?
                            At voluptate enim reiciendis! Eligendi quia consectetur voluptas quo doloremque,
                            eius incidunt tempore eveniet amet nobis? Dolorem dolore quam, porro commodi ducimus ipsam magni aspernatur beatae necessitatibus ipsa repellat,
                            molestias dolores ut nisi voluptates.
                        </p>
                    </div>

                    <div className='pt-10'>
                            <button 
                            onClick={scrollToRegister}
                            className='bg-pink-600 animate-bounce text-white border-[2px] rounded-lg font-bold text-lg md:text-[14px] py-2 px-4 border-pink-600 hover:bg-white hover:text-pink-600 transition duration-500'>
                                Register Now
                            </button>
                    </div>

                </div>

            </section>

            <section id="ministers" className='pb-16 pt-16 relative bg-black px-10 min-h-screen ministers'>
                <div className='absolute top-[305px]'>
                    <img src={SINGLE} className='h-32' alt="" />
                </div>
                <div className='absolute right-[20px] lg:bottom-[200px] bottom-[350px]'>
                    <img src={CONNECT} className='h-20' alt="" />
                </div>
                <div className="absolute inset-0 bg-black opacity-85 z-0"></div>

                <div className='flex relative z-10 flex-col justify-center items-center'>
                    <p className='lg:text-2xl text-sm text-center font-semibold text-pink-600'>Get Ready to Have an unforgettable Experience</p>

                    <div className='lg:pt-8 pt-5 px-5 flex justify-center'>
                        <h1 className='lg:text-7xl text-2xl text-white text-center font-bold lg:leading-[35px]'>Our Ministers</h1>
                    </div>

                    <div className='flex justify-center items-center w-20 h-[3px] rounded-xl mt-10 animate-ping bg-pink-600'></div>

                    <div className='flex flex-col lg:flex-row justify-center items-center gap-20 pt-20'>

                        <div className=' flex flex-col justify-center items-center gap-5'>
                            <img src={WINLOS} className='lg:h-[500px] rounded-full' alt="" />
                            <h1 className='text-2xl text-white font-bold'>Rev Samson Ajetomobi</h1>
                            <p className='text-lg text-pink-600'>Host</p>
                        </div>
                        <div className=' flex flex-col justify-center items-center gap-5'>
                            <img src={WINLOS} className='lg:h-[500px] rounded-full' alt="" />
                            <h1 className='text-2xl text-white font-bold'>Rev Samson Ajetomobi</h1>
                            <p className='text-lg text-pink-600'>Host</p>
                        </div>

                    </div>

                </div>
            </section>

            <section id="gallery" className='min-h-screen relative overflow-hidden px-10 py-12 gallery'>
                <div className='absolute inset-0'>
                    <img src={SC} className='inset-0 pt-[200px] lg:pt-0' alt="" />
                </div>
                <div className="absolute inset-0 bg-pink-100 opacity-85 z-0"></div>

                <div className='flex flex-col relative justify-center z-10 items-center'>
                    <p className='lg:text-2xl text-sm  relative z-20 text-center font-semibold text-pink-600'></p>

                    <div className='lg:pt-8 pt-5 px-5 flex justify-center'>
                        <h1 className='lg:text-7xl text-2xl text-black text-center font-bold lg:leading-[35px]'>Our Gallery</h1>
                    </div>

                    <div className='flex justify-center items-center w-20 h-[3px] rounded-xl mt-10 animate-ping bg-pink-600'></div>

                    <div className='pt-20'>
                        <VideoPlayer />
                    </div>
                </div>

            </section>

            <section id='register' className='lg:min-h-screen bg-white register'>
                <div className='flex justify-center gap-x-10 items-center px-10 py-12'>
                    <div className='hidden w-[100%] lg:flex justify-center'>
                        <img src={RBG} className='h-[600px]' alt="" />
                    </div>
                    <div className='w-[100%] flex flex-col lg:items-start justify-center items-center'>
                        <h1 className='lg:text-5xl text-3xl font-bold pb-3'>Register here</h1>
                        <p>Follow this link to register - </p>

                        <div className='flex flex-col justify-center lg:items-start pt-5 items-center'>
                            <h1 className='text-2xl text-pink-600'>Important Notice:</h1>
                            <p className='text-center lg:text-start pt-2'>Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                                Saepe earum quam sunt distinctio libero harum animi ad impedit,
                                debitis ut quisquam aliquid pariatur adipisci repellat autem aliquam provident omnis magnam!</p>
                        </div>
                    </div>
                </div>

                <div className='bg-black flex  h-[2px] mx-10'></div>
                <div className='bg-white h-20 gap-y-3 px-10 pt-4 lg:pb-0 pb-24  flex flex-col lg:flex-row justify-between items-center lg:px-20'>
                    <div>
                        <p className='text-center'>Copyright © 2025 Singles Connect. All Rights Reserved.</p>
                    </div>

                    <div className='flex justify-center items-center'>
                        <div className="flex justify-center gap-6  text-2xl text-black">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <FaFacebookF />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <FaInstagram />
                            </a>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default HomePage


