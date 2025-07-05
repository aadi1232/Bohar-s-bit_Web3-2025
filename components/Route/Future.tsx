'use client'
import { styles } from "@/utils/styles";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import React from "react";

type Props = {};

const Future = (props: Props) => {
  return (
    <div className="w-full relative p-4 md:p-[unset] grid md:grid-cols-2 py-8">
      <div className="col-span-1">
        <Image
          src={"https://pixner.net/aikeu/assets/images/tools-thumb.png"}
          width={800}
          height={500}
          alt=""
          className="md:w-[90%] md:ml-[-50px] 2xl:ml-[-90px]"
        />
      </div>
      <div className="col-span-1 w-full flex justify-center items-center">
        <div className="2xl:w-[60%]">
            <Button className={`${styles.button} mb-[30px] h-[37px] bg-purple-600 text-white`}>
            Future of Prompt Engineering
            </Button>
          <h5 className={`${styles.heading} mb-5 !leading-[50px]`}>
            Redefining Ownership in the Age of AI
          </h5>
          <p className={`${styles.paragraph} pb-5`}>
            PromptVerse is paving the way for prompt creators to earn, own, and innovate. Our decentralized platform ensures every prompt is attributed, verified, and rewarded — creating a sustainable AI creator economy.
          </p>

        </div>
      </div>
    </div>
  );
};

export default Future;
