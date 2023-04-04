import React from "react";
import Navbar from "@/components/Navbar/Navbar";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {

  return (
    <div className="flex h-screen flex-col items-center text-white  lg:h-auto lg:min-h-screen">
      <Navbar
        toggleWalletModal={() => {return null}}
        toggleAccoundDetailsModal={() => {return null}}
      />

      <div
        id="layout"
        className={`bg-black-900 coingrid-scrollbar relative z-50 w-full flex-1 items-center overflow-x-hidden overflow-y-scroll rounded-t-[40px]  pb-2 pt-6 sm:p-8   md:rounded-[40px] md:p-10 lg:mb-6 lg:overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
}

export default DefaultLayout;
