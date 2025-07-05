"use client";

import { styles } from "@/utils/styles";
import { useAuth } from "@clerk/nextjs";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Selection,
  Textarea,
 HEAD
  Tabs,
  Tab,
  Card,
  CardBody,
} from "@nextui-org/react";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { FiZap, FiRefreshCw } from "react-icons/fi";

  Card,
} from "@nextui-org/react";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { MdOutlineImage } from "react-icons/md";
 
import Image from "next/image";
import React, { ChangeEvent, DragEvent, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import PromptSuggestionPanel from "@/components/ai/PromptSuggestionPanel";
import PromptEnhancer from "@/components/ai/PromptEnhancer";
import { PromptSuggestion } from "@/types/ai";
import { usePromptEnhancement } from "@/hooks/usePromptEnhancement";

type Props = {};

type PromptData = {
  name: string;
  shortDescription: string;
  description: string;
  images: string[];
  attachments: string[];
  estimatedPrice: string;
  price: string;
  tags: string;
};

const categorieItem = [
  {
    title: "Chatgpt",
  },
  {
    title: "Midjourney",
  },
  {
    title: "Bard",
  },
  {
    title: "Dalle",
  },
];

const UploadPrompt = (props: Props) => {
  const [promptData, setPromptData] = useState<PromptData>({
    name: "",
    shortDescription: "",
    description: "",
    images: [],
    attachments: [],
    estimatedPrice: "",
    price: "",
    tags: "",
  });
  const [dragging, setDragging] = useState<Boolean>(false);
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<Selection>(new Set([]));
  const [activeTab, setActiveTab] = useState("manual");
  const { generateTags, tags, loading: aiLoading } = usePromptEnhancement();

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            setPromptData((prevData) => ({
              ...prevData,
              images: [...prevData.images, reader.result as string],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAttachmentFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            setPromptData((prevData) => ({
              ...prevData,
              attachments: [...prevData.attachments, reader.result as string],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleImageDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            setPromptData((prevData) => ({
              ...prevData,
              images: [...prevData.images, reader.result as string],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAttachmentDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            setPromptData((prevData) => ({
              ...prevData,
              attachments: [...prevData.attachments, reader.result as string],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSuggestionSelect = (suggestion: PromptSuggestion) => {
    setPromptData({
      ...promptData,
      name: suggestion.title,
      shortDescription: suggestion.description,
      description: suggestion.content,
      estimatedPrice: suggestion.estimatedPrice.toString(),
      price: (suggestion.estimatedPrice * 0.8).toFixed(3), // 20% discount from estimated
      tags: suggestion.tags.join(", "),
    });
    setCategory(new Set([suggestion.category]));
    setActiveTab("manual");
    toast.success("AI suggestion applied! You can modify the details as needed.");
  };

  const handleEnhancementResult = (enhancedPrompt: string, suggestedTags: string[], suggestedPrice: number) => {
    setPromptData({
      ...promptData,
      description: enhancedPrompt,
      tags: suggestedTags.join(", "),
      price: suggestedPrice.toString(),
    });
    toast.success("Prompt enhanced! Review and adjust as needed.");
  };

  const handleGenerateAITags = async () => {
    if (!promptData.description.trim()) {
      toast.error("Please enter a prompt description first");
      return;
    }

    const categoryString = Array.from(category).join(",");
    if (!categoryString) {
      toast.error("Please select a category first");
      return;
    }

    const generatedTags = await generateTags({
      promptContent: promptData.description,
      category: categoryString,
      title: promptData.name,
    });

    if (generatedTags.length > 0) {
      setPromptData({
        ...promptData,
        tags: generatedTags.join(", "),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const categoryString = Array.from(category).join(",");
    await axios
      .post("/api/upload-prompt", {
        ...promptData,
        category: categoryString,
        sellerId: userId,
      })
      .then((res) => {
        setIsLoading(false);
        toast.success("Prompt uploaded successfully");
        setPromptData({
          name: "",
          shortDescription: "",
          description: "",
          images: [],
          attachments: [],
          estimatedPrice: "",
          price: "",
          tags: "",
        });
        redirect("/shop/prompts");
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        // toast.error(error.data.message);
      });
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(new Set([e.target.value]));
  };

  return (
<<<<<<< HEAD
    <div>
      <div className="flex items-center justify-center gap-3 py-5">
        <FiZap className="text-[#835DED] text-3xl" />
        <h1 className={`${styles.heading} text-center`}>
          Upload Your Prompt
        </h1>
      </div>
      
      <Card className="w-[95%] m-auto mb-6 bg-[#1a1a2e] border border-[#16213e]">
        <CardBody>
          <Tabs 
            selectedKey={activeTab} 
            onSelectionChange={(key) => setActiveTab(key as string)}
            className="w-full"
            color="secondary"
          >
            <Tab key="manual" title="Manual Creation">
              <div className="mt-4">
                <p className={`${styles.paragraph} text-center mb-4`}>
                  Create your prompt manually with full control over all details.
                </p>
              </div>
            </Tab>
            <Tab key="ai-suggestions" title="🤖 AI Suggestions">
              <div className="mt-4">
                <PromptSuggestionPanel 
                  onSuggestionSelect={handleSuggestionSelect}
                  defaultCategory={Array.from(category)[0] as string}
                />
              </div>
            </Tab>
            <Tab key="ai-enhance" title="✨ AI Enhance">
              <div className="mt-4">
                {promptData.description ? (
                  <PromptEnhancer
                    originalPrompt={promptData.description}
                    category={Array.from(category)[0] as string || "Chatgpt"}
                    onEnhancementResult={handleEnhancementResult}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className={`${styles.paragraph} mb-4`}>
                      Enter a prompt description in the Manual Creation tab first, then come back here to enhance it with AI.
                    </p>
                    <Button
                      onClick={() => setActiveTab("manual")}
                      className="bg-[#835DED] text-white"
                    >
                      Go to Manual Creation
                    </Button>
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      <form className="w-[90%] m-auto" onSubmit={handleSubmit}>
        <Input
          type="text"
          label="Title"
          value={promptData.name}
          onChange={(e) =>
            setPromptData({ ...promptData, name: e.target.value })
          }
          variant="bordered"
          required
          placeholder="Enter your prompt title"
        />
        <br />
        <Input
          type="text"
          label="Short Description"
          value={promptData.shortDescription}
          onChange={(e) =>
            setPromptData({ ...promptData, shortDescription: e.target.value })
          }
          variant="bordered"
          required
          placeholder="Enter a short Description for your prompt *"
        />
        <br />
        <Textarea
          variant={"bordered"}
          value={promptData.description}
          onChange={(e) =>
            setPromptData((prevData) => ({
              ...prevData,
              description: e.target.value,
            }))
          }
          required
          size="lg"
          placeholder="Write one detailed description for your prompt *"
        />
        <br />
        <div className="md:flex md:w-full">
          <Input
            type="number"
            label="Propmt estimated price (ETH)"
            variant="bordered"
            value={promptData.estimatedPrice}
            onChange={(e) =>
              setPromptData((prevData) => ({
                ...prevData,
                estimatedPrice: e.target.value,
              }))
            }
            placeholder="0.05 ETH"
            required
            className="mb-6 md:mb-0"
          />
          <Input
            type="number"
            label="Propmt price (ETH) *"
            value={promptData.price}
            onChange={(e) =>
              setPromptData((prevData) => ({
                ...prevData,
                price: e.target.value,
              }))
            }
            variant="bordered"
            placeholder="0.03 ETH"
            className="md:ml-10"
            required
          />
        </div>
        <br />
        <div className="md:flex md:w-full">
          <Select
            label="Choose one category"
            variant="bordered"
            placeholder="Select one category"
            selectedKeys={category}
            className="max-w-full mb-5 md:mb-[0]"
            onChange={handleSelectionChange}
          >
            {categorieItem.map((item) => (
              <SelectItem
                key={item.title}
                value={item.title}
                className="text-black"
              >
                {item.title}
              </SelectItem>
            ))}
          </Select>
          <div className="md:ml-10 flex-1">
            <div className="flex gap-2">
              <Input
                type="text"
                label="Propmt tags *"
                value={promptData.tags}
                onChange={(e) =>
                  setPromptData((prevData) => ({
                    ...prevData,
                    tags: e.target.value,
                  }))
                }
                required
                variant="bordered"
                placeholder="AI,Photo,Arts"
                className="flex-1"
              />
              <Button
                onClick={handleGenerateAITags}
                disabled={aiLoading || !promptData.description.trim()}
                variant="flat"
                className="bg-[#835DED20] text-[#835DED] hover:bg-[#835DED30] min-w-[120px]"
                startContent={aiLoading ? <FiRefreshCw className="animate-spin" /> : <FiZap />}
              >
                {aiLoading ? 'AI...' : 'AI Tags'}
              </Button>
            </div>
          </div>
        </div>
        <br />
        <div className="w-full">
          <input
            type="file"
            // required
            name="image"
            accept="image/*"
            multiple
            id="file"
            className="hidden"
            onChange={handleImageFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full rounded-md min-h-[15vh] border-white p-3 border  flex items-center justify-center ${
              dragging ? "bg-blue-500" : "bg-transparent"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleImageDrop}
          >
            {promptData.images.length !== 0 ? (
              <div className="w-full flex flex-wrap">
                {promptData.images.map((item) => (
                  <Image
                    src={item}
                    alt=""
                    width={500}
                    height={400}
                    key={item}
                    className="w-full md:w-[48%] object-cover md:m-2 my-2"
=======
    <div className="min-h-screen relative">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#835DED]/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF7E5F]/10 rounded-full filter blur-3xl animate-pulse"></div>
      
      <div className="relative z-10 py-8">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-Monserrat">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#835DED] to-[#FF7E5F]">
              Upload Your Prompt
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Create and share your AI prompts with the community
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full mx-auto mt-4"></div>
        </div>

        {/* Form Container */}
        <div className="max-w-7xl mx-auto px-4">
          <Card className="p-10 bg-[#130f23]/80 border border-[#835DED]/20 backdrop-blur-sm hover:border-[#835DED]/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 animate-fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-[#835DED]/20 rounded-lg">
                    <MdOutlineImage className="text-[#835DED] text-2xl" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Basic Information</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Input
                    type="text"
                    label="Title"
                    value={promptData.name}
                    onChange={(e) =>
                      setPromptData({ ...promptData, name: e.target.value })
                    }
                    variant="bordered"
                    required
                    placeholder="Enter your prompt title"
                    classNames={{
                      input: "text-white",
                      label: "text-gray-300",
                      inputWrapper: "border-[#835DED]/30 hover:border-[#835DED]/50 focus-within:border-[#835DED] bg-[#130f23]/50",
                    }}
>>>>>>> main
                  />

                  <Input
                    type="text"
                    label="Short Description"
                    value={promptData.shortDescription}
                    onChange={(e) =>
                      setPromptData({ ...promptData, shortDescription: e.target.value })
                    }
                    variant="bordered"
                    required
                    placeholder="Enter a short description for your prompt"
                    classNames={{
                      input: "text-white",
                      label: "text-gray-300",
                      inputWrapper: "border-[#835DED]/30 hover:border-[#835DED]/50 focus-within:border-[#835DED] bg-[#130f23]/50",
                    }}
                  />
                </div>

                <Textarea
                  variant="bordered"
                  value={promptData.description}
                  onChange={(e) =>
                    setPromptData((prevData) => ({
                      ...prevData,
                      description: e.target.value,
                    }))
                  }
                  required
                  label="Detailed Description"
                  size="lg"
                  placeholder="Write a detailed description for your prompt"
                  classNames={{
                    input: "text-white",
                    label: "text-gray-300",
                    inputWrapper: "border-[#835DED]/30 hover:border-[#835DED]/50 focus-within:border-[#835DED] bg-[#130f23]/50",
                  }}
                  minRows={4}
                />
              </div>

              {/* Pricing and Category Section - Combined */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Pricing Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-[#FF7E5F]/20 rounded-lg">
                      <span className="text-[#FF7E5F] text-2xl">💰</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-white">Pricing</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <Input
                      type="number"
                      label="Estimated Price (ETH)"
                      variant="bordered"
                      value={promptData.estimatedPrice}
                      onChange={(e) =>
                        setPromptData((prevData) => ({
                          ...prevData,
                          estimatedPrice: e.target.value,
                        }))
                      }
                      placeholder="0.05"
                      required
                      classNames={{
                        input: "text-white",
                        label: "text-gray-300",
                        inputWrapper: "border-[#835DED]/30 hover:border-[#835DED]/50 focus-within:border-[#835DED] bg-[#130f23]/50",
                      }}
                    />
                    <Input
                      type="number"
                      label="Final Price (ETH)"
                      value={promptData.price}
                      onChange={(e) =>
                        setPromptData((prevData) => ({
                          ...prevData,
                          price: e.target.value,
                        }))
                      }
                      variant="bordered"
                      placeholder="0.03"
                      required
                      classNames={{
                        input: "text-white",
                        label: "text-gray-300",
                        inputWrapper: "border-[#835DED]/30 hover:border-[#835DED]/50 focus-within:border-[#835DED] bg-[#130f23]/50",
                      }}
                    />
                  </div>
                </div>

                {/* Category and Tags Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-[#835DED]/20 rounded-lg">
                      <span className="text-[#835DED] text-2xl">🏷️</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-white">Category & Tags</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <Select
                      label="Choose Category"
                      variant="bordered"
                      placeholder="Select one category"
                      selectedKeys={category}
                      onChange={handleSelectionChange}
                      classNames={{
                        trigger: "border-[#835DED]/30 hover:border-[#835DED]/50 focus:border-[#835DED] bg-[#130f23]/50",
                        label: "text-gray-300",
                        value: "text-white",
                      }}
                    >
                      {categorieItem.map((item) => (
                        <SelectItem
                          key={item.title}
                          value={item.title}
                          className="text-white bg-[#130f23]"
                        >
                          {item.title}
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      type="text"
                      label="Tags"
                      value={promptData.tags}
                      onChange={(e) =>
                        setPromptData((prevData) => ({
                          ...prevData,
                          tags: e.target.value,
                        }))
                      }
                      required
                      variant="bordered"
                      placeholder="AI,Photo,Arts"
                      classNames={{
                        input: "text-white",
                        label: "text-gray-300",
                        inputWrapper: "border-[#835DED]/30 hover:border-[#835DED]/50 focus-within:border-[#835DED] bg-[#130f23]/50",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Media Upload Section - Side by Side */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Image Upload Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-[#FF7E5F]/20 rounded-lg">
                      <MdOutlineImage className="text-[#FF7E5F] text-2xl" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">Images</h2>
                  </div>
                  
                  <div className="w-full">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      multiple
                      id="file"
                      className="hidden"
                      onChange={handleImageFileChange}
                    />
                    <label
                      htmlFor="file"
                      className={`w-full rounded-lg min-h-[300px] border-2 border-dashed p-6 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                        dragging 
                          ? "border-[#835DED] bg-[#835DED]/10" 
                          : "border-[#835DED]/30 hover:border-[#835DED]/50 hover:bg-[#835DED]/5"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleImageDrop}
                    >
                      {promptData.images.length !== 0 ? (
                        <div className="w-full">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {promptData.images.map((item, index) => (
                              <div key={index} className="relative group">
                                <Image
                                  src={item}
                                  alt={`Preview ${index + 1}`}
                                  width={200}
                                  height={150}
                                  className="w-full h-32 object-cover rounded-lg border border-[#835DED]/20"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-sm">Image {index + 1}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 text-center">
                            <HiOutlineCloudUpload className="text-[#835DED] text-3xl mx-auto mb-2" />
                            <p className="text-gray-300">Click to add more images</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <HiOutlineCloudUpload className="text-[#835DED] text-6xl mx-auto mb-4" />
                          <p className="text-white text-lg mb-2">Drag and drop your images here</p>
                          <p className="text-gray-400">or click to browse</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Attachment Upload Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-[#835DED]/20 rounded-lg">
                      <IoDocumentAttachOutline className="text-[#835DED] text-2xl" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">Attachments</h2>
                  </div>
                  
                  <div className="w-full">
                    <input
                      type="file"
                      required
                      accept=".txt, .pdf"
                      multiple
                      id="attachment"
                      className="hidden"
                      onChange={handleAttachmentFileChange}
                    />
                    <label
                      htmlFor="attachment"
                      className={`w-full rounded-lg min-h-[300px] border-2 border-dashed p-6 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                        dragging 
                          ? "border-[#835DED] bg-[#835DED]/10" 
                          : "border-[#835DED]/30 hover:border-[#835DED]/50 hover:bg-[#835DED]/5"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleAttachmentDrop}
                    >
                      {promptData.attachments.length !== 0 ? (
                        <div className="text-center">
                          <IoDocumentAttachOutline className="text-[#835DED] text-6xl mx-auto mb-4" />
                          <p className="text-white text-lg mb-2">
                            {promptData.attachments.length} {promptData.attachments.length > 1 ? "files" : "file"} attached
                          </p>
                          <p className="text-gray-400">Click to add more files</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <IoDocumentAttachOutline className="text-[#835DED] text-6xl mx-auto mb-4" />
                          <p className="text-white text-lg mb-2">Drag and drop your files here</p>
                          <p className="text-gray-400">or click to browse (.txt, .pdf)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-12">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-16 py-4 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    "Upload Your Prompt"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadPrompt;
