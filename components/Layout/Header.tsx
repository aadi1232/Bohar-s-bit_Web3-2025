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

type Props = {
  activeItem: number;
  user: User | undefined;
  isSellerExist: boolean | undefined;
};

const Header = ({ user, activeItem,isSellerExist }: Props) => {
  const [active, setactive] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setactive(true);
      } else {
        setactive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
      {/* Spacer div to maintain layout when header is fixed */}
      {active && <div className="h-[80px]"></div>}
      
      <div
        className={`w-full p-5 border-b min-h-[60px] border-b-[#ffffff32] transition-all duration-300 ${
          active ? "fixed top-0 left-0 bg-[#000]/95 backdrop-blur-md z-[9999] w-full" : "absolute top-0 left-0 z-[9999] w-full"
        }`}
        style={{
          backgroundColor: active ? 'rgba(0, 0, 0, 0.95)' : 'transparent',
        }}
      >
      <div className="w-[90%] mx-auto flex items-center justify-between">
        <div>
          <Link href={"/"}>
            <h1 className="font-Inter text-3xl cursor-pointer">
              <span
              className="bg-clip-text text-transparent"
              style={{
                background: "linear-gradient(90deg, #835DED, #FF7E5F, #FEB47B)",
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
        
        <div className="hidden md:flex items-center">
          <Navigation activeItem={activeItem} />
        </div>
        
        <div className="hidden md:flex items-center ml-10">
          <AiOutlineSearch className="text-[25px] mr-5 cursor-pointer" />
          {user ? (
            <DropDown
              user={user}
              setOpen={setOpen}
              handleProfile={handleProfile}
              isSellerExist={isSellerExist}
            />
          ) : (
            <Link href="/sign-in">
              <CgProfile className="text-[25px] cursor-pointer" />
            </Link>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <FaBars
            className="text-2xl cursor-pointer"
            onClick={() => setOpen(!open)}
          />
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

      {/* Mobile menu overlay */}
      {open && (
        <div
          className="fixed md:hidden w-full h-screen top-0 left-0 z-[99999] bg-[unset]"
          onClick={handleClose}
          id="screen"
        >
          <div className="fixed bg-black h-screen top-0 right-0 w-[60%] z-[9999]">
            <div className="mt-20 p-5">
              {/* Mobile logo */}
              <div className="mb-8">
                <Link href="/">
                  <h1 className="font-Inter text-3xl cursor-pointer">
                    <span className="text-[#835DED]">Prompt</span>Verse
                  </h1>
                </Link>
              </div>
              
              <Navigation activeItem={activeItem} />
              
              {user && (
                <div className="mt-6">
                  <DropDown
                    user={user}
                    setOpen={setOpen}
                    handleProfile={handleProfile}
                    isSellerExist={isSellerExist}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Header;
