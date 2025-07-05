import ShopSidebar from "@/components/Shop/ShopSidebar";
import AllInvoices from "./_page";
import { getSellerInfo } from "@/actions/shop/getSellerInfo";

const Page = async () => {
  const data:any = await getSellerInfo();
  // Mock invoices data since the original function is deprecated
  const invoices: any[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#110b30] to-[#1a0f3a]">
      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#835DED]/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-[#FF7E5F]/10 rounded-full filter blur-3xl animate-pulse"></div>
      
      {/* Fixed Sidebar */}
      <ShopSidebar active={4} />
      
      {/* Main Content */}
      <div className="ml-[280px] relative z-10">
        <div className="p-8">
          {/* Header Section */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-Monserrat">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#835DED] to-[#FF7E5F]">
                Invoices
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              View and manage all your sales invoices
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full mt-4"></div>
          </div>

          {/* Invoices Content */}
          <div className="animate-fade-in-up">
            <div className="bg-[#130f23]/80 border border-[#835DED]/20 backdrop-blur-sm rounded-lg p-6 hover:border-[#835DED]/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <AllInvoices invoices={invoices} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
