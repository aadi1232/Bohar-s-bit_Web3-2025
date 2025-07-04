"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import line from "@/public/Assets/line.png";
import MarQuee from "react-fast-marquee";

type Props = {};

const rowOneImages = [
  {
    url: "https://pixner.net/aikeu/assets/images/banner/large-slider/one.png",
  },
  {
    url: "https://pixner.net/aikeu/assets/images/banner/large-slider/two.png",
  },
  {
    url: "https://pixner.net/aikeu/assets/images/banner/large-slider/three.png",
  },
  {
    url: "https://pixner.net/aikeu/assets/images/banner/large-slider/four.png",
  },
  {
    url: "https://pixner.net/aikeu/assets/images/banner/large-slider/five.png",
  },
];

const rowTwoImages = [
  {
    url: "https://pixner.net/aikeu/assets/images/banner/small-slider/one.png",
  },
  {
    url: "https://pixner.net/aikeu/assets/images/banner/small-slider/two.png",
  },
  {
    url: "https://pixner.net/aikeu/assets/images/banner/small-slider/three.png",
  },
  {
    url: "https://pixner.net/aikeu/assets/images/banner/small-slider/four.png",
  },
  {
    url: "https://pixner.net/aikeu/assets/images/banner/small-slider/five.png",
  },
];

const Hero = (props: Props) => {
  const [mounted, setmounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      setmounted(true);
    }
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-center overflow-hidden">
      <div>
        <h1
          className="font-Monserrat text-4xl py-5 xl:text-7xl 2xl:text-8xl font-[300] text-center xl:leading-[80px] 2xl:leading-[100px] sm:mt-20 animate-fade-in-up"
        >
          Sell and Trade <br /> <span className="text-[#835DED] animate-gradient-text">AI Prompts</span>
          <br />
          As <span className="font-medium">NFTs</span>
        </h1>
        <style jsx>{`
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(40px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 1.8s cubic-bezier(0.23, 1, 0.32, 1) both;
            animation-delay: 0.5s;
          }
          .animate-gradient-text {
            background: linear-gradient(90deg, #835DED, #FF7E5F, #FEB47B);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            animation: gradient-move 2s infinite alternate;
          }
          @keyframes gradient-move {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 100% 50%;
            }
          }
          @keyframes shine {
            0% {
              transform: translateX(-100%) skewX(-12deg);
            }
            100% {
              transform: translateX(200%) skewX(-12deg);
            }
          }
          .animate-shine {
            animation: shine 0.6s ease-in-out;
          }
        `}</style>
        <div className="w-full mb-2 md:mb-8 relative">
          <div className="mt-4 md:mt-8 space-y-4">
            {/* First row - moving right */}
            <div>
              <MarQuee direction="right" speed={40} gradient={false}>
                {rowOneImages.map((i, index) => (
                  <div 
                    key={index}
                    className="group relative mx-2 md:mx-4 transform transition-all duration-500"
                  >
                    <Image
                      src={i.url}
                      alt=""
                      className="w-[200px] md:w-[500px] rounded-[20px] shadow-2xl transition-all duration-300 group-hover:shadow-purple-500/30"
                      width={500}
                      height={300}
                    />
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 rounded-[20px] bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-[20px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-shine"></div>
                  </div>
                ))}
              </MarQuee>
            </div>
            
            {/* Second row - moving left */}
            <div>
              <MarQuee direction="left" speed={35} gradient={false}>
                {rowTwoImages.map((i, index) => (
                  <div 
                    key={index}
                    className="group relative mx-2 md:mx-4 transform transition-all duration-500"
                  >
                    <Image
                      src={i.url}
                      alt=""
                      className="w-[200px] md:w-[500px] rounded-[20px] shadow-2xl transition-all duration-300 group-hover:shadow-blue-500/30"
                      width={500}
                      height={300}
                    />
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 rounded-[20px] bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-[20px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-shine"></div>
                  </div>
                ))}
              </MarQuee>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
