"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Layout/Header";
import Hero from "@/components/Route/Hero";
import About from "@/components/Route/About";
import Image from "next/image";
import { styles } from "@/utils/styles";
import PromptCard from "@/components/Prompts/PromptCard";
import BestSellers from "@/components/Shop/BestSellers";
import Future from "@/components/Route/Future";
import Partners from "@/components/Route/Partners";
import SellersBanner from "@/components/Shop/SellersBanner";
import Footer from "@/components/Layout/Footer";
import { Divider } from "@nextui-org/react";
import { User } from "@clerk/nextjs/server";
import PromptCardLoader from "@/utils/PromptCardLoader";
import AnimatedSection from "@/components/Animations/AnimatedSection";
import StaggeredAnimation from "@/components/Animations/StaggeredAnimation";
import { usePageTransition } from "@/hooks/usePageTransition";
import Web3Marketplace from "@/components/Web3/Web3Marketplace";

type Props = {
  user: User | undefined;
  isSellerExist: boolean | undefined;
};

const RoutePage = ({ user, isSellerExist }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [prompts, setPrompts] = useState<any>();
  const [loading, setLoading] = useState(true);
  const pageLoaded = usePageTransition();

  const fetchPromptsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/get-prompts`);
      const data = await response.json();
      setPrompts(data.prompts);
    } catch (error) {
      console.error("Failed to fetch prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromptsData();
  }, []);

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={`transition-all duration-1000 ease-out ${pageLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
      <div>
        <div className="banner">
          {/* Add background video */}
            <video
            className="banner-video"
            autoPlay
            muted
            loop
            playsInline
            src="/Assets/banner_video.mp4"
            >
            {/* Fallback for browsers that don't support video */}
            Your browser does not support the video tag.
            </video>

          <Header activeItem={0} user={user} isSellerExist={isSellerExist} />
          <Hero />
        </div>
        <AnimatedSection 
          animation="slideRight" 
          delay={0.2} 
          className="absolute right-[-30px]"
        >
          <Image
            src={"https://pixner.net/aikeu/assets/images/footer/shape-two.png"}
            width={120}
            height={120}
            alt=""
          />
        </AnimatedSection>
        <br />
        <div className="w-[95%] md:w-[90%] xl:w-[80%] 2xl:w-[75%] m-auto">
          <AnimatedSection animation="fadeUp" delay={0.3}>
            <About />
          </AnimatedSection>
          
          <div>
            <AnimatedSection animation="fadeUp" delay={0.4}>
              <h1 className={`${styles.heading} p-2 font-Monserrat`}>
                Latest Prompts
              </h1>
            </AnimatedSection>
            
            <AnimatedSection animation="fadeUp" delay={0.5}>
              <div className="w-full flex flex-wrap mt-5">
                {loading ? (
                  [...new Array(8)].map((_, i) => (
                    <PromptCardLoader key={i} />
                  ))
                ) : (
                  <>
                    {prompts &&
                      prompts.map((item: any) => (
                        <PromptCard prompt={item} key={item.id} />
                      ))}
                  </>
                )}
              </div>
            </AnimatedSection>
            
            <br />
            
            {/* Web3 Marketplace Preview */}
            <AnimatedSection animation="fadeUp" delay={0.6}>
              <div className="my-12">
                <h1 className={`${styles.heading} p-2 font-Monserrat mb-4`}>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Web3 NFT Marketplace
                  </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 text-center">
                  Discover and trade AI prompt NFTs on the blockchain
                </p>
                <Web3Marketplace 
                  title="Featured NFT Prompts" 
                  showFilters={false} 
                  maxItems={4}
                />
              </div>
            </AnimatedSection>
            
            <br />
            
            <AnimatedSection animation="fadeUp" delay={0.2}>
              <BestSellers />
            </AnimatedSection>
            
            <AnimatedSection animation="slideLeft" delay={0.3}>
              <Future />
            </AnimatedSection>
            
            <AnimatedSection animation="scaleUp" delay={0.4}>
              <Partners />
            </AnimatedSection>
            
            <AnimatedSection animation="rotateIn" delay={0.5}>
              <SellersBanner />
            </AnimatedSection>
            
            <br />
            <br />
            
            <AnimatedSection animation="fadeIn" delay={0.2}>
              <Divider className="bg-[#ffffff23]" />
            </AnimatedSection>
            
            <AnimatedSection animation="fadeUp" delay={0.3}>
              <Footer />
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePage;
