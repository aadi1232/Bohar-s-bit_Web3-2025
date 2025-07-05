import React from 'react';
import { getUser } from '@/actions/user/getUser';
import { redirect } from 'next/navigation';
import Header from '@/components/Layout/Header';
import { getSellerInfo } from '@/actions/shop/getSellerInfo';
import UserProfile from '@/components/Web3/UserProfile';

const MyNFTsPage = async () => {
  const user = await getUser();
  const sellerInfo = await getSellerInfo();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <>
      <Header user={user.user} activeItem={0} isSellerExist={!!sellerInfo?.shop} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <UserProfile />
      </div>
    </>
  );
};

export default MyNFTsPage;
