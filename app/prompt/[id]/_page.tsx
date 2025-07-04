"use client";
import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import ShopBanner from "@/components/Shop/ShopBanner";
import { User } from "@clerk/nextjs/server";
import { Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import PromptDetails from "@/components/Prompts/PromptDetails/PromptDetails";
import { propmt } from "@/@types/promptTypes";
import Loader from "@/utils/Loader";
import { Button } from "@nextui-org/react";

const PromptDetailsPage = ({
  user,
  isSellerExist,
  promptId,
}: {
  user: User | undefined;
  isSellerExist: boolean;
  promptId: string;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [prompt, setPrompt] = useState<propmt>();
  const [loading, setLoading] = useState(true);

  const fetchPromptData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/get-prompt/${promptId}`);
      const data = await response.json();
      setPrompt(data);
    } catch (error) {
      console.error("Failed to fetch prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromptData();
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
    <>
      {loading && !prompt ? (
        <Loader />
      ) : (
        <div>
          <div className="shop-banner">
            <Header activeItem={2} user={user} isSellerExist={isSellerExist} />
            <ShopBanner title={prompt?.name!} />
          </div>
          <div>
            <div className="w-[95%] md:w-[80%] xl:w-[85%] 2xl:w-[80%] m-auto">
              <PromptDetails promptData={prompt} />
              <div className="text-center mt-8">
                <p className="text-2xl font-bold text-green-400 mb-2">
                  {prompt?.price} ETH
                </p>
                <Button color="primary" disabled>
                  Pay using Web3 (ETH)
                </Button>
                <p className="text-gray-400 mt-2 text-sm">
                  Web3 payment coming soon!
                </p>
              </div>
              <Divider className="bg-[#ffffff14] mt-5" />
              <Footer />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromptDetailsPage;
