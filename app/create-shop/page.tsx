"use client";
import { styles } from "@/utils/styles";
import { useUser } from "@clerk/nextjs";
import { Button, Input, Textarea, Card, CardBody, CardHeader, Tabs, Tab } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import MintPromptForm from "@/components/Web3/MintPromptForm";
import { FaStore, FaEthereum } from "react-icons/fa";

type Props = {};

const Page = (props: Props) => {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shopData, setShopData] = useState({
    name: "",
    description: "",
    shopProductsType: "",
    avatar: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (user) {
      const data = {
        name: shopData.name,
        description: shopData.description,
        shopProductsType: shopData.shopProductsType,
        avatar: user?.imageUrl || "",
        userId: user?.id,
      };
      await axios
        .post("/api/create-shop", data)
        .then((res) => {
          setLoading(false);
          toast.success("Shop created successfully!");
          setShopData({
            name: "",
            description: "",
            shopProductsType: "",
            avatar: "",
          });
          router.push("/");
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data);
          setShopData({
            name: "",
            description: "",
            shopProductsType: "",
            avatar: "",
          });
        });
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center py-8">
      <div>
        <h1 className={`${styles.heading} text-center font-Monserrat mb-8`}>
          Start Selling with Us!
        </h1>
        
        <div className="2xl:w-[60%] xl:w-[70%] md:w-[80%] w-[90%] m-auto">
          <Tabs
            aria-label="Creation options"
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
                  <span>Create Traditional Shop</span>
                </div>
              }
            >
              <Card className="mt-6">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Set up your traditional prompt shop</h2>
                </CardHeader>
                <CardBody>
                  <form onSubmit={handleSubmit}>
                    <div className="w-full my-5">
                      <label className={`${styles.label} mb-2 block`}>Shop Name</label>
                      <Input
                        isRequired
                        type="name"
                        value={shopData.name}
                        onChange={(e) =>
                          setShopData({ ...shopData, name: e.target.value })
                        }
                        label="PromptVerse"
                        size="sm"
                        variant="bordered"
                      />
                    </div>
                    <div className="w-full my-5">
                      <label className={`${styles.label} mb-2 block`}>
                        Shop Description (Max 120 letters)
                      </label>
                      <Input
                        isRequired
                        type="text"
                        label="lorem ipsum"
                        size="sm"
                        value={shopData.description}
                        onChange={(e) =>
                          setShopData({ ...shopData, description: e.target.value })
                        }
                        variant="bordered"
                        maxLength={120}
                      />
                    </div>
                    <div className="w-full my-5">
                      <label className={`${styles.label} mb-2 block`}>
                        What you wanna sale with us?
                      </label>
                      <Textarea
                        variant="bordered"
                        value={shopData.shopProductsType}
                        onChange={(e) =>
                          setShopData({ ...shopData, shopProductsType: e.target.value })
                        }
                        required
                        placeholder="Chatgpt,Midjoureney Prompts..."
                        className="col-span-12 md:col-span-6 md:mb-0"
                      />
                      <br />
                      <Button
                        className="mb-3 w-full bg-transparent h-[45px] border border-[#16c252] text-[#16c252] hover:bg-[#16c252] hover:text-black duration-300 transition-opacity font-Inter font-[600]"
                        type="submit"
                        disabled={loading}
                        disableAnimation={loading}
                      >
                        Create Shop
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Tab>
            
            <Tab
              key="web3"
              title={
                <div className="flex items-center space-x-2">
                  <FaEthereum />
                  <span>Mint NFT Prompts</span>
                </div>
              }
            >
              <div className="mt-6">
                <Card className="mb-6">
                  <CardBody>
                    <div className="text-center">
                      <h2 className="text-xl font-semibold mb-4">Mint Your AI Prompts as NFTs</h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Transform your AI prompts into valuable NFTs on the blockchain. 
                        Own your prompts, prove authenticity, and earn royalties from every sale.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h3 className="font-semibold text-blue-900 dark:text-blue-300">Ownership</h3>
                          <p className="text-blue-800 dark:text-blue-300">Prove you created the prompt</p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <h3 className="font-semibold text-green-900 dark:text-green-300">Royalties</h3>
                          <p className="text-green-800 dark:text-green-300">Earn from every resale</p>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <h3 className="font-semibold text-purple-900 dark:text-purple-300">Authenticity</h3>
                          <p className="text-purple-800 dark:text-purple-300">Blockchain verification</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <MintPromptForm />
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Page;
