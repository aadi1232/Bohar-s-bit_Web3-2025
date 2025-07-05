"use client";
import React, { useEffect, useState } from "react";
import { styles } from "@/utils/styles";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { User } from "@clerk/nextjs/server";
import { getUser } from "@/actions/user/getUser";
import AnimatedSection from "@/components/Animations/AnimatedSection";

const ContactPage = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isSellerExist, setIsSellerExist] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUser();
        setUser(data?.user as User | undefined);
        setIsSellerExist(data?.shop ? true : false);
      } catch (e) {
        setUser(undefined);
        setIsSellerExist(undefined);
      }
    }
    fetchUser();
  }, []);

  return (
    <>
      <Header user={user} activeItem={3} isSellerExist={isSellerExist} />
      <div className="min-h-[90vh] w-full flex flex-col items-center justify-start py-16 px-2 sm:px-6 lg:px-8 bg-[#110b30]">
        {/* Top Section: Heading and Description with Animation */}
        <div className="relative w-full mb-14 h-[420px] md:h-[520px] flex items-center justify-center rounded-2xl overflow-hidden shadow-xl mx-auto">
          {/* Purple Gradient Background Instead of Image */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#835DED] via-[#1a133a] to-[#F49BAB] z-0" />
          {/* Overlay for extra depth */}
          <div className="absolute inset-0 bg-[#110b30cc] z-10" />
          {/* Animated Text */}
          <AnimatedSection animation="fadeUp" duration={1} className="relative z-20 w-full text-center flex flex-col items-center justify-center px-4">
            <h2 className="mb-4 text-5xl md:text-6xl font-extrabold drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-[#fff] via-[#F49BAB] to-[#835DED]" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Get in Touch
            </h2>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto drop-shadow-md text-[#e0d7fa] font-Inter font-semibold">
              Have questions, feedback, or partnership ideas? Our team is here to help you. Reach out to us and we’ll respond as soon as possible. We value your input and look forward to connecting with you!
            </p>
          </AnimatedSection>
        </div>

        {/* New Section: Form left, Iframe right, both elongated and below the image area */}
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-12 items-stretch justify-center mb-10">
          {/* Contact Form - Left Side */}
          <div className="w-full md:w-1/2 bg-[#1a133a] rounded-2xl shadow-2xl p-10 border border-[#2d225a] flex flex-col justify-center min-h-[420px]">
            <h2 className={`${styles.heading} text-left mb-6 text-3xl md:text-4xl`}>Contact Us</h2>
            <form className="space-y-7">
              <div>
                <label htmlFor="name" className={styles.label + " text-lg"}>Name</label>
                <input id="name" name="name" type="text" required className={styles.input + " bg-[#221a44] border-[#3a2d6a] focus:border-[#835DED] text-lg h-[48px]"} placeholder="Your Name" />
              </div>
              <div>
                <label htmlFor="email" className={styles.label + " text-lg"}>Email</label>
                <input id="email" name="email" type="email" required className={styles.input + " bg-[#221a44] border-[#3a2d6a] focus:border-[#835DED] text-lg h-[48px]"} placeholder="you@email.com" />
              </div>
              <div>
                <label htmlFor="message" className={styles.label + " text-lg"}>Message</label>
                <textarea id="message" name="message" rows={5} required className={styles.input + " bg-[#221a44] border-[#3a2d6a] focus:border-[#835DED] text-lg resize-none min-h-[120px]"} placeholder="Type your message..." />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#835DED] to-[#F49BAB] hover:from-[#F49BAB] hover:to-[#835DED] transition-colors duration-300 py-4 rounded-lg font-bold text-xl text-white shadow-lg mt-2">Send Message</button>
            </form>
          </div>
          {/* Iframe + Contact Info - Right Side */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-between h-full">
            <div className="h-[300px] w-full rounded-2xl overflow-hidden shadow-2xl border border-[#2d225a] mb-7">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.282964295028!2d80.0265660750497!3d13.62381598678337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4d5e0e2e2e2e2f%3A0x7b7b7b7b7b7b7b7b!2sSri%20City%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1720092800000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sri City Andhra Pradesh Location"
              ></iframe>
            </div>
            {/* Contact Info below iframe */}
            <div className="w-full bg-[#1a133a] rounded-2xl shadow-xl border border-[#2d225a] p-6 flex flex-col items-center md:items-start justify-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Contact Information</h3>
              <p className="text-[#b1b0b6] text-base md:text-lg mb-2">Email: <a href="mailto:boharsbit@promptverse.com" className="text-[#835DED] underline">boharsbit@promptverse.com</a></p>
              <p className="text-[#b1b0b6] text-base md:text-lg mb-2">Address: 325 IIIT SRICITY, Andhra Pradesh, 512646</p>
              <p className="text-[#b1b0b6] text-base md:text-lg">Phone: <a href="tel:+917226234328" className="text-[#835DED] underline">+91 72262 34328</a></p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
