import React, { useState, useCallback, useEffect } from "react"
import AssetListModal from "@/components/AssetListModal/AssetListModal";
import WalletModal from "@/components/WalletModal/WalletModal";
import { Layout } from "@/layouts";
import type { NextPage } from "next";
import { AssetBaseConfig, assetsBaseConfig } from '../utils/assetsConfig';

const Home: NextPage = () => {
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false)
  const [asset, setAsset] = useState<AssetBaseConfig>(assetsBaseConfig.BUSD)
  return (
    <Layout>
      <AssetListModal setShowTokenModal={setShowTokenModal} visible={showTokenModal} setAsset={setAsset}/>
      <WalletModal setShowTokenModal={setShowTokenModal}/>
    </Layout>
  );
};

export default Home;
