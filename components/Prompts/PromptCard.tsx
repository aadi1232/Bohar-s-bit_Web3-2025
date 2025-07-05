import Link from "next/link";
import Ratings from "@/utils/Ratings";
import { styles } from "@/utils/styles";
import { Avatar, Button, Card, Divider, Spinner } from "@nextui-org/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Props = {
  prompt: any;
};

const PromptCard = ({ prompt }: Props) => {
  const [score, setScore] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchScore = async () => {
      setLoading(true);
      try {
        // Try prompt.prompt, prompt.text, prompt.promptText, prompt.description
        const promptText = prompt?.prompt || prompt?.text || prompt?.promptText || prompt?.description || "";
        if (!promptText) {
          setScore(null);
          setLoading(false);
          return;
        }
        const res = await fetch("/api/rate-prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptText }),
        });
        const data = await res.json();
        setScore(data.score);
      } catch {
        setScore(null);
      }
      setLoading(false);
    };
    fetchScore();
  }, [prompt]);

  return (
    <Card
      radius="lg"
      className="w-full md:w-[31%] 2xl:w-[23%] max-h-[410px] p-4 bg-[#130f23] m-3 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
    >
      <div className="relative">
        <Image
          src={prompt?.images[0]?.url}
          alt=""
          className="w-full !max-h-[200px] object-cover"
          width={300}
          height={300}
        />
        <div className="absolute bottom-2 left-2">
          <div className="w-max bg-black hover:bg-[#16252] duration-300 transition-opacity hover:text-black text-white p-[10px] items-center flex rounded-xl">
            {prompt?.category === "Chatgpt" ? (
              <Image
                src="https://pixner.net/aikeu/assets/images/category/chat.png"
                width={25}
                height={25}
                alt=""
              />
            ) : (
              <>
                {prompt?.category === "Dalle" ? (
                  "⛵"
                ) : (
                  <>
                    {prompt?.category === "Midjourney" ? (
                      "🎨"
                    ) : (
                      <>{prompt?.category === "Bard" ? "🐥" : null}</>
                    )}
                  </>
                )}
              </>
            )}
            <span className={`${styles.label} pl-2 text-white`}>
              {prompt?.category}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between py-2 items-center">
        <h3 className={`${styles.label} text-[18px] text-white`}>
          {prompt?.name}
        </h3>
        <div className="flex items-center gap-2">
          <p className={`${styles.paragraph}`}>{prompt?.price} ETH</p>
          {/* Effectiveness Score */}
          <span className="ml-2 px-3 py-1 rounded-full bg-[#835DED] text-white text-xs font-bold flex items-center">
            {loading ? <Spinner size="sm" color="white" /> : score ? `Effective Score: ${score}/10` : "-"}
          </span>
        </div>
      </div>
      <Divider className="bg-[#ffffff18] my-3" />
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <Avatar src={prompt?.shop?.avatar} />
          <span className={`${styles.label} pl-3`}>@{prompt?.shop?.name}</span>
        </div>
        <Ratings rating={prompt?.rating} />
      </div>
      <br />
      <Link href={`/prompt/${prompt.id}`} className="w-full">
        <div
          className={`${styles.button} !py-2 !px-3 text-center mb-3 w-full text-white bg-transparent border border-[#835DED] hover:bg-[#835DED] hover:text-black duration-300 transition-opacity font-Inter font-[600]`}
        >
          Get Prompts
        </div>
      </Link>
    </Card>
  );
};

export default PromptCard;
