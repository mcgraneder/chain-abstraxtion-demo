import { useViewport } from "@/hooks/useViewport";
import React from "react";


export const WarningPopup = () => {
    const { width } = useViewport()
  return (
    <>
    { width && width > 1120 ? (<div className="border-[rgb(231,227,235)] absolute bottom-4 left-6 w-96 rounded-2xl border bg-white p-4">
      <div className="flex font-semibold text-black text-[20xp]">{"Warning"}</div>
      <span className="z-[1000000000] text-black">
        Note If the api hasnt been hit in some time it needs to cold start. If
        this is the case, please wait a couple of minutes until the server is
        ready before u use this Demo.
      </span>
    </div>) : null}
    </>
  );
};
