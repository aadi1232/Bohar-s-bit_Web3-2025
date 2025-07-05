"use client";

import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import ShopBanner from "@/components/Shop/ShopBanner";
import { User } from "@clerk/nextjs/server";
import { Divider, Pagination, Tabs, Tab } from "@nextui-org/react";
import { useEffect, useState } from "react";
import FilterPrompt from "@/components/Prompts/FilterPrompt";
import { useRouter } from "next/navigation";
import PromptCard from "@/components/Prompts/PromptCard";
import PromptCardLoader from "@/utils/PromptCardLoader";
import Web3Marketplace from "@/components/Web3/Web3Marketplace";
import { FaStore, FaEthereum } from "react-icons/fa";

const MarketPlaceRouter = ({
  user,
  isSellerExist,
}: {
  user: User | undefined;
  isSellerExist: boolean;
}) => {
  const [isMounted, setisMounted] = useState(false);
  const [initialPage, setInitialPage] = useState(1);
  const [prompts, setPrompts] = useState<any>();
  const [totalPrompts, setTotalPrompts] = useState<any>();
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchPromptsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/get-prompts?page=${initialPage}`);
      const data = await response.json();
      setPrompts(data.prompts);
      setTotalPrompts(data.totalPrompts);
    } catch (error) {
      console.error("Failed to fetch prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isMounted) {
      setisMounted(true);
    }
  }, [isMounted]);

  useEffect(() => {
    if (initialPage) {
      router.push(`/marketplace?page=${initialPage}`);
    }
  }, [initialPage, router]);

  useEffect(() => {
    fetchPromptsData();
  }, [initialPage]);

  if (!isMounted) {
    return null;
  }

  const paginationsPages = totalPrompts && Math.ceil(totalPrompts.length / 8);

  return (
    <>
      <div className="shop-banner">
        <Header activeItem={2} user={user} isSellerExist={isSellerExist} />
        <ShopBanner title="Our Shop" />
      </div>
      <div>
        <div className="w-[95%] md:w-[90%] xl:w-[85%] 2xl:w-[80%] m-auto">
          <div>
            {/* Tabs for Web2 and Web3 Marketplace */}
            <Tabs
              aria-label="Marketplace tabs"
              color="primary"
              variant="underlined"
              classNames={{
                tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-[#22d3ee]",
                tab: "max-w-fit px-0 h-12",
                tabContent: "group-data-[selected=true]:text-[#06b6d4]"
              }}
            >
              <Tab
                key="traditional"
                title={
                  <div className="flex items-center space-x-2">
                    <FaStore />
                    <span>Traditional Marketplace</span>
                  </div>
                }
              >
                <div className="py-6">
                  <div className="w-full">
                    <FilterPrompt
                      setPrompts={setPrompts}
                      totalPrompts={totalPrompts}
                    />
                  </div>
                  <div className="w-full flex flex-wrap mt-5">
                    {loading ? (
                      [...new Array(8)].map((i) => (
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
                  <div className="w-full flex items-center justify-center mt-5">
                    {!loading && (
                      <Pagination
                        loop
                        showControls
                        total={paginationsPages}
                        initialPage={initialPage}
                        classNames={{
                          wrapper: "mx-2",
                          item: "mx-2",
                        }}
                        onChange={setInitialPage}
                      />
                    )}
                  </div>
                </div>
              </Tab>
              
              <Tab
                key="web3"
                title={
                  <div className="flex items-center space-x-2">
                    <FaEthereum />
                    <span>Web3 NFT Marketplace</span>
                  </div>
                }
              >
                <div className="py-6">
                  <Web3Marketplace 
                    title="AI Prompt NFTs" 
                    showFilters={true}
                  />
                </div>
              </Tab>
            </Tabs>
            
            <Divider className="bg-[#ffffff14] mt-5" />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketPlaceRouter;
