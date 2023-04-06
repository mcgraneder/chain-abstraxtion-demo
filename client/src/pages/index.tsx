import WalletModal from "@/components/WalletModal/WalletModal";
import { Layout } from "@/layouts";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <Layout>
      <WalletModal/>
    </Layout>
  );
};

export default Home;
