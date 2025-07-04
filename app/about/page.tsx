"use client";
import React, { useState, useEffect } from "react";
import { Card, Avatar, Divider } from "@nextui-org/react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { styles } from "@/utils/styles";
const teamMembers = [
  {
    name: "Aadi Patel",
    role: "Backend Developer",
    description: "Expert in building robust backend systems, APIs, and integrating blockchain with scalable server-side solutions.",
    image: "/Assets/aadi.jpeg",
    skills: ["Node.js", "MongoDb", "API Development", "Prisma", "Web3 Integration"]
  },
  {
    name: "Dhruv Patel",
    role: "Blockchain Developer",
    description: "Specializes in smart contract development, blockchain protocols, and decentralized application architecture.",
    image: "/Assets/dhruv.jpeg",
    skills: ["Solidity", "Ethereum", "Smart Contracts", "NFTs"]
  },
  {
    name: "Yagyansh Gupta",
    role: "Frontend Developer",
    description: "Focused on crafting seamless user experiences with modern web technologies and responsive UI design.",
    image: "/Assets/yagyansh.jpeg",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "UI/UX"]
  },
  {
    name: "Vedant Maske",
    role: "AI Developer",
    description: "Driven by AI innovation, with experience in machine learning, prompt engineering, and AI-powered applications.",
    image: "/Assets/maske.jpeg",
    skills: ["Python", "AI/ML", "Prompt Engineering", "Data Science", "Deep Learning"]
  }
];

const Page = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#110b30] to-[#1a0f3a]">
      <Header activeItem={1} user={undefined} isSellerExist={undefined} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-Monserrat">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#835DED] to-[#FF7E5F]">
                Bohar's Bit
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Pioneering the future of AI commerce through Web3 innovation
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] mx-auto rounded-full"></div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#835DED]/10 rounded-full filter blur-3xl animate-fade-in-up-delay-5"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF7E5F]/10 rounded-full filter blur-3xl animate-fade-in-up-delay-6"></div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up-delay-1">
            <h2 className={`${styles.heading} text-4xl md:text-5xl mb-8 text-white`}>
              Who We Are
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                We're a passionate team of developers and innovators participating in the Web3SSH hackathon. 
                Our mission is to revolutionize how AI prompts are created, shared, and monetized in the digital economy.
              </p>
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <Card className="p-8 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300 hover:scale-105 animate-stagger-1">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
                    <p className="text-gray-300">
                      To create a decentralized marketplace where AI enthusiasts can monetize their creativity 
                      through NFT-based prompt trading, powered by blockchain technology.
                    </p>
                  </div>
                </Card>
                
                <Card className="p-8 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300 hover:scale-105 animate-stagger-2">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💡</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">What We're Building</h3>
                    <p className="text-gray-300">
                      A comprehensive Web3 platform that combines AI prompt engineering with NFT technology, 
                      enabling creators to sell, trade, and showcase their AI prompts as unique digital assets.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up-delay-2">
            <h2 className={`${styles.heading} text-4xl md:text-5xl mb-8 text-white`}>
              Meet the Team
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Get to know the talented individuals behind Bohar's Bit who are making this vision a reality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => {
              const staggerClasses = ['animate-stagger-1', 'animate-stagger-2', 'animate-stagger-3', 'animate-stagger-4'];
              return (
                <div key={member.name} className={`${staggerClasses[index]} transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 cursor-pointer`}>
                  <Card className="p-6 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 group h-full">
                    <div className="text-center h-full flex flex-col">
                      <div className="relative mb-6">
                        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-[#835DED] to-[#FF7E5F] p-1 group-hover:scale-105 transition-transform duration-300">
                          <div className="w-full h-full rounded-full bg-[#130f23] flex items-center justify-center overflow-hidden">
                            <img 
                              src={member.image} 
                              alt={member.name}
                              className="w-28 h-28 rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                e.currentTarget.style.display = 'none';
                                //e.currentTarget.nextElementSibling.style.display = 'flex';
                              }}
                            />
                            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-[#835DED]/20 to-[#FF7E5F]/20 flex items-center justify-center text-4xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-[#835DED]/30 group-hover:to-[#FF7E5F]/30 transition-all duration-300" style={{display: 'none'}}>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-sm">✨</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#835DED] transition-colors duration-300">
                        {member.name}
                      </h3>
                      <p className="text-[#835DED] font-semibold mb-3 group-hover:text-[#FF7E5F] transition-colors duration-300">{member.role}</p>
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed flex-grow group-hover:text-gray-200 transition-colors duration-300">
                        {member.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 justify-center mt-auto">
                        {member.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-3 py-1 bg-[#835DED]/20 text-[#835DED] rounded-full text-xs font-medium border border-[#835DED]/30 hover:bg-[#835DED]/40 hover:scale-105 transition-all duration-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up-delay-3">
            <h2 className={`${styles.heading} text-4xl md:text-5xl mb-8 text-white`}>
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 animate-stagger-1">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔮</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Innovation</h3>
                  <p className="text-gray-300">
                    Pushing the boundaries of what's possible with Web3 and AI technology.
                  </p>
                </div>
              </Card>
              
              <Card className="p-8 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 animate-stagger-2">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Collaboration</h3>
                  <p className="text-gray-300">
                    Building a community where creators can thrive and share their expertise.
                  </p>
                </div>
              </Card>
              
              <Card className="p-8 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 animate-stagger-3">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌟</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Excellence</h3>
                  <p className="text-gray-300">
                    Delivering high-quality solutions that exceed expectations.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-12 bg-gradient-to-r from-[#835DED]/10 to-[#FF7E5F]/10 border border-[#835DED]/30 backdrop-blur-sm animate-fade-in-up-delay-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Join Our Journey?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Be part of the revolution in AI prompt trading. Explore our marketplace and discover 
              the future of creative AI monetization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105">
                Explore Marketplace
              </button>
              <button className="px-8 py-3 border-2 border-[#835DED] text-[#835DED] font-semibold rounded-full hover:bg-[#835DED] hover:text-white transition-all duration-300 hover:scale-105">
                Learn More
              </button>
            </div>
          </Card>
        </div>
      </section>

    </div>
  );
};

export default Page;
