'use client';
import ShopSidebar from "@/components/Shop/ShopSidebar";
import UploadPrompt from "@/components/Shop/UploadPrompt";

type Props = {}

const Page = (props: Props) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#110b30] to-[#1a0f3a]">
      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#835DED]/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-[#FF7E5F]/10 rounded-full filter blur-3xl animate-pulse"></div>
      
      {/* Fixed Sidebar */}
      <ShopSidebar active={1} />
      
      {/* Main Content */}
      <div className="ml-[280px] relative z-10">
        <div className="p-8">
          <div className="bg-[#130f23]/80 border border-[#835DED]/20 backdrop-blur-sm rounded-lg p-6 hover:border-[#835DED]/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
            <UploadPrompt />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page