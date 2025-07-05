"use client";
import { styles } from "@/utils/styles";
import { Button, Chip } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const About = (props: Props) => {
  const router = useRouter();

  return (
    <div className="w-full relative grid md:grid-cols-2 md:py-8">
      <div className="col-span-1 w-full md:w-[60%] md:mt-5 px-5 md:px-[unset]">
       
        <h5 className={`${styles.heading} mb-5 !leading-[50px]`}>
          Monetize Your AI Prompts with Web3 Technology
        </h5>
        <p className={`${styles.paragraph} pb-5`}>
          PromptVerse allows creators to turn their best AI prompts into NFTs that can be sold, traded, and resold — with built-in royalties. Unlock new revenue streams and take ownership of your creativity in the AI era.
        </p>
        <Button
          className={`${styles.button} bg-gradient-to-r from-[#835DED] via-[#FF8C42] to-[#FF3C6F] font-[600] h-[50px] shadow-lg hover:scale-105 transition-transform duration-200`}
          onClick={() => router.push("/marketplace")}
          radius="full"
          size="lg"
          endContent={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        >
          Explore Marketplace
        </Button>
      </div>
      <div className="col-span-1 my-10 md:mt-[unset]">
        <Image
          src={"https://pixner.net/aikeu/assets/images/craft-thumb.png"}
          alt=""
          width={600}
          height={600}
          priority
        />
      </div>
    </div>
  );
};

export default About;
