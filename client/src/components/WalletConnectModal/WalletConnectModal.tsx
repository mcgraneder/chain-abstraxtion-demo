import React, { useEffect } from "react";
import useWallet from "@/hooks/useWallet";
import ConnectingModal from "./ConnectingModal";
import ConnectionErrorModal from "./ConnectionErrorModal";
import WalletSelectModal from "./WalletSelectModal";
import { useViewport } from '../../hooks/useViewport';
import { Backdrop } from "../CSS/WalletModal.styles";

interface WalletModalProps {
  toggleWalletModal: () => void;
  openWalletModal: boolean;
}

function WalletConnect({
  toggleWalletModal,
  openWalletModal,
}: WalletModalProps) {
  const { width } = useViewport();
  const {
    pendingWallet,
    connecting,
    setConnecting,
    connectOn,
    setPendingWallet,
    error,
    toggleErrorModal,
    toggleConecting,
  } = useWallet();

  useEffect(() => console.log(openWalletModal), [openWalletModal]);
  return (
    <>
      <Backdrop visible={openWalletModal || connecting || error}>
        {openWalletModal && (
          <WalletSelectModal
            setPendingWallet={setPendingWallet}
            toggleWalletModal={toggleWalletModal}
            setConnecting={setConnecting}
            connectOn={connectOn}
          />
        )}
        {error && (
          <ConnectionErrorModal
            close={toggleErrorModal}
            pendingWallet={pendingWallet}
            toggleWalletModal={toggleWalletModal}
            setConnecting={setConnecting}
            connectOn={connectOn}
            message={error}
          />
        )}
        {!error && connecting && <ConnectingModal close={toggleConecting} />}
      </Backdrop>
    </>
  );
}

export default WalletConnect;
