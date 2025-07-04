"use client";
import { styles } from "@/utils/styles";
import Loader from "@/utils/Loader";

const WithDrawEarning = () => {
  return (
    <div className="w-full flex items-center justify-center h-screen flex-col">
      <div className="w-full text-center">
        <p className={`${styles.label} !text-2xl text-center`}>
          Withdrawals are not available in this version. All payments are
          handled via Web3 (ETH) only.
        </p>
      </div>
    </div>
  );
};

export default WithDrawEarning;
