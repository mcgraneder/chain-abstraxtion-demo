import React, { useState, useCallback } from "react";
import Navbar from "@/components/Navbar/Navbar";
import WalletConnect from "@/components/WalletConnectModal/WalletConnectModal";
import useWallet from "@/hooks/useWallet";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  const wallet = useWallet()
  // useEffect(() => console.log(openWalletModal), [openWalletModal]);
   const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);

     const toggleWalletModal = useCallback(
       () => setOpenWalletModal((w) => !w),
       [setOpenWalletModal]
     );
  return (
    <div className="flex h-screen flex-col items-center text-white  lg:h-auto lg:min-h-screen">
      <Navbar
        toggleWalletModal={toggleWalletModal}
        toggleAccoundDetailsModal={toggleWalletModal}
      />
      <WalletConnect
        toggleWalletModal={toggleWalletModal}
        openWalletModal={openWalletModal}
      />

      <div
        id="layout"
        className={`bg-black-900 coingrid-scrollbar relative w-full flex-1 items-center overflow-x-hidden overflow-y-scroll rounded-t-[40px]  pb-2 pt-6 sm:p-8   md:rounded-[40px] md:p-10 lg:mb-6 lg:overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
}

export default DefaultLayout;
