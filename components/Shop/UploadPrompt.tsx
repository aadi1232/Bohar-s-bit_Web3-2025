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
