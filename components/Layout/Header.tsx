"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import { AiOutlineSearch } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaBars } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { UserProfile } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import DropDown from "./DropDown";
import WalletConnection from "@/components/Web3/WalletConnection";

type Props = {
  activeItem: number;
  user: User | undefined;
  isSellerExist: boolean | undefined;
};

const Header = ({ user, activeItem, isSellerExist }: Props) => {
  const [active, setactive] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setactive(true);
      } else {
        setactive(false);
      }
    });
  }

  const handleClose = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === "screen") {
      setOpen(!open);
    }
  };

  const handleProfile = () => {
    setActiveProfile(!activeProfile);
  };

  return (
    <div
      className={`w-full p-5 border-b min-h-[60px] border-b-[#ffffff32] transition-opacity ${
        active && "fixed top-0 left-0 bg-[#000] z-[9999]"
      }`}
    >
      <div className="hidden md:w-[90%] xl:w-[85%] mx-auto md:flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link href={"/"}>
            <h1 className="font-Inter text-2xl xl:text-3xl cursor-pointer">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  background:
                    "linear-gradient(90deg, #835DED, #FF7E5F, #FEB47B)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Prompt
              </span>
              Verse
            </h1>
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <Navigation activeItem={activeItem} />
        </div>
        <div className="flex items-center space-x-3 xl:space-x-4 flex-shrink-0 min-w-[350px] justify-end">
        

          {/* Web3 Wallet Connection */}
          <WalletConnection />

          {user ? (
            <div>
              <DropDown
                user={user}
                setOpen={setOpen}
                handleProfile={handleProfile}
                isSellerExist={isSellerExist}
              />
            </div>
          ) : (
            <Link href="/sign-in">
              <CgProfile className="text-[25px] cursor-pointer" />
            </Link>
          )}
        </div>
      </div>
      {activeProfile && (
        <div className="w-full fixed h-screen overflow-hidden flex justify-center items-center top-0 left-0 bg-[#00000068] z-[9999]">
          <div className="w-min relative h-[90vh] overflow-y-scroll bg-white rounded-xl shadow">
            <UserProfile />
            <RxCross1
              className="absolute text-black text-2xl top-10 right-10 cursor-pointer"
              onClick={handleProfile}
            />
          </div>
        </div>
      )}

      {/* for mobile screen */}
      <div className="w-full md:hidden flex items-center justify-between">
        <div>
          <Link href="/">
            <h1>
              <Link href={"/"}>
                <h1 className="font-Inter text-3xl cursor-pointer">
                  <span className="text-[#835DED]">Prompt</span>Verse
                </h1>
              </Link>
            </h1>
          </Link>
        </div>
        <div>
          <FaBars
            className="text-2xl cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>

        {open && (
          <div
            className="fixed md:hidden w-full h-screen top-0 left-0 z-[99999] bg-[unset]"
            onClick={handleClose}
            id="screen"
          >
            <div className="fixed bg-black h-screen top-0 right-0 w-[60%] z-[9999]">
              <div className="mt-20 p-5 space-y-4">
                <Navigation activeItem={activeItem} />

                {/* Web3 Wallet Connection for Mobile */}
                <div className="py-4">
                  <WalletConnection />
                </div>

                {user && (
                  <DropDown
                    user={user}
                    setOpen={setOpen}
                    handleProfile={handleProfile}
                    isSellerExist={isSellerExist}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
