import Link from "next/link";
import React from "react";

type Props = {
  activeItem: number;
};

const navItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About Us",
    href: "/about",
  },
  {
    title: "Marketplace",
    href: "/web3-marketplace",
  },
  {
    title: "Mint Prompt",
    href: "/mint-nft",
  },
  {
    title: "My Prompts",
    href: "/my-nfts",
  },
  // {
  //   title: "Contact Us",
  //   href: "/contact",
  // },
];

const Navigation = ({ activeItem }: Props) => {
  return (
    <div className="block md:flex md:items-center md:whitespace-nowrap">
      {navItems.map((item, index) => (
        <Link key={item.title} href={item.href}>
            <h5
            className={`navbar-link inline-block md:px-1.5 lg:px-2 xl:px-3 py-5 md:py-0 text-[16px] lg:text-[18px] font-[500] font-Inter whitespace-nowrap ${
              activeItem === index && "text-[#F49BAB]"
            }`}
            >
            {item.title}
            </h5>
        </Link>
      ))}
    </div>
  );
};

export default Navigation;
