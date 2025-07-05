import React from 'react';
import { getUser } from '@/actions/user/getUser';
import Header from '@/components/Layout/Header';
import { getSellerInfo } from '@/actions/shop/getSellerInfo';
import Web3Marketplace from '@/components/Web3/Web3Marketplace';

const Web3MarketplacePage = async () => {
  const user = await getUser();
  const sellerInfo = await getSellerInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#110b30] to-[#1a0f3a] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#835DED]/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF7E5F]/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#835DED]/5 rounded-full filter blur-3xl"></div>
      
      <Header user={user?.user} activeItem={2} isSellerExist={!!sellerInfo?.shop} />
      
      <div className="relative z-10">
        <Web3Marketplace />
      </div>
    </div>
  );
};

export default Web3MarketplacePage;
