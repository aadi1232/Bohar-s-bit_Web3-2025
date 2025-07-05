import React from 'react';
import { getUser } from '@/actions/user/getUser';
import Header from '@/components/Layout/Header';
import { getSellerInfo } from '@/actions/shop/getSellerInfo';
import Web3Marketplace from '@/components/Web3/Web3Marketplace';

const Web3MarketplacePage = async () => {
  const user = await getUser();
  const sellerInfo = await getSellerInfo();

  return (
    <>
      <Header user={user?.user} activeItem={1} isSellerExist={!!sellerInfo?.shop} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <Web3Marketplace />
      </div>
    </>
  );
};

export default Web3MarketplacePage;
