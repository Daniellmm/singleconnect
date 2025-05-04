import { useState, useRef, useEffect } from "react";
import thumbnail from "../assets/mainbg.jpg";
import videoFile from "../assets/yoo.mp4";

const VideoPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  
  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }, 100);
  };
  
  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsOpen(false);
    setIsPlaying(false);
  };
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleProgress = (e) => {
    if (videoRef.current) {
      const newTime = (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress((newTime / duration) * 100);
    }
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setCurrentTime(currentTime);
      setProgress((currentTime / duration) * 100);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleFullScreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };
  
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);
  
  return (
    <>
      {/* Thumbnail Preview */}
      <div 
        className="relative w-full max-w-2xl mx-auto cursor-pointer overflow-hidden rounded-lg shadow-lg group" 
        onClick={handleOpen}
      >
        <img 
          src={thumbnail} 
          alt="Video Thumbnail" 
          className="w-full h-auto rounded-lg transition duration-300 transform group-hover:scale-105" 
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-20 transition duration-300">
          <button className="bg-white bg-opacity-90 rounded-full p-4 shadow-lg transform transition duration-300 group-hover:scale-110">
            <svg className="w-10 h-10 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
  
      {/* Video Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center transition-opacity duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <div 
            className="relative w-full max-w-5xl px-4"
            onMouseMove={handleMouseMove}
          >
            {/* Video Container */}
            <div className="relative">
              <video
                ref={videoRef}
                src={videoFile}
                className="flex justify-center items-center rounded-lg shadow-lg"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              >
                Your browser does not support the video tag.
              </video>
              
              {/* Play/Pause Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                  <button 
                    className="bg-white bg-opacity-80 rounded-full p-5 shadow-lg transform transition hover:scale-110"
                    onClick={togglePlay}
                  >
                    <svg className="w-10 h-10 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Controls */}
              <div 
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Progress Bar */}
                <div 
                  className="w-full h-2 bg-gray-600 rounded-full mb-4 cursor-pointer"
                  onClick={handleProgress}
                >
                  <div 
                    className="h-full bg-pink-600 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  {/* Left Controls */}
                  <div className="flex items-center space-x-4">
                    {/* Play/Pause Button */}
                    <button 
                      className="text-white hover:text-pink-400 focus:outline-none"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                    
                    {/* Volume Control */}
                    <div className="flex items-center space-x-2">
                      <button className="text-white hover:text-pink-400 focus:outline-none">
                        {volume === 0 ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                          </svg>
                        ) : volume < 0.5 ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                          </svg>
                        )}
                      </button>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-16 md:w-24 accent-pink-600"
                      />
                    </div>
                    
                    {/* Time Display */}
                    <div className="text-white text-sm hidden md:block">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                  
                  {/* Right Controls */}
                  <div className="flex items-center space-x-4">
                    {/* Fullscreen Button */}
                    <button 
                      className="text-white hover:text-pink-400 focus:outline-none"
                      onClick={handleFullScreen}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                      </svg>
                    </button>
                    
                    {/* Close Button */}
                    <button
                      onClick={handleClose}
                      className="text-white hover:text-pink-400 focus:outline-none"
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoPlayer;