import React from 'react';
import { getUser } from '@/actions/user/getUser';
import { redirect } from 'next/navigation';
import Header from '@/components/Layout/Header';
import { getSellerInfo } from '@/actions/shop/getSellerInfo';
import MintPromptForm from '@/components/Web3/MintPromptForm';

const MintNFTPage = async () => {
  const user = await getUser();
  const sellerInfo = await getSellerInfo();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <>
      <Header user={user.user} activeItem={0} isSellerExist={!!sellerInfo?.shop} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mint Your AI Prompt
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Transform your AI prompts into valuable NFTs on the blockchain
            </p>
          </div>
          
          <MintPromptForm />
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Why Mint Your Prompts?</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Prove ownership and authenticity of your AI prompts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Earn royalties from every future sale</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Build your reputation as a prompt creator</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Create a passive income stream</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">How It Works</h3>
              <ol className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                  <span>Fill out the form with your prompt details</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                  <span>Set your royalty percentage (0-10%)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                  <span>Confirm the transaction in your wallet</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                  <span>Your NFT is minted and ready to list!</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MintNFTPage;
