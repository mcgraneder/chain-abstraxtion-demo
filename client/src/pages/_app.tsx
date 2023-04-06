import { type AppType } from "next/dist/shared/lib/utils";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider, ExternalProvider } from "@ethersproject/providers";
import "@/styles/globals.css";

function getLibrary(provider: ExternalProvider): Web3Provider {
  return new Web3Provider(provider);
}

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />;
    </Web3ReactProvider>
  );
};

export default MyApp;
