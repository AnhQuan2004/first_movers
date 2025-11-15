import React from "react";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { cn } from "@/lib/utils";

interface CustomConnectWalletProps {
  className?: string;
  variant?: "card" | "compact";
  buttonClassName?: string;
  buttonLabel?: string;
}

const CustomConnectWallet: React.FC<CustomConnectWalletProps> = ({
  className = "",
  variant = "card",
  buttonClassName = "",
  buttonLabel = "Connect",
}) => {
  const { connected } = useWallet();

  if (variant === "compact") {
    return (
      <div className="[&_.wkit-button]:h-9 [&_.wkit-button]:rounded-full [&_.wkit-button]:border-white/20 [&_.wkit-button]:px-4 [&_.wkit-button]:py-0 [&_.wkit-button]:text-xs [&_.wkit-button]:font-semibold [&_.wkit-button]:transition [&_.wkit-button]:focus-visible:outline-none [&_.wkit-button]:focus-visible:ring-2 [&_.wkit-button]:focus-visible:ring-sky-500/40 [&_.wkit-button]:focus-visible:ring-offset-2 [&_.wkit-button]:focus-visible:ring-offset-[#020617] [&_.wkit-button]:bg-transparent [&_.wkit-button]:text-[#48d2ff] [&_.wkit-button:hover]:bg-white/10 [&_.wkit-connected-button]:h-9 [&_.wkit-connected-button]:rounded-full [&_.wkit-connected-button]:border-white/20 [&_.wkit-connected-button]:px-4 [&_.wkit-connected-button]:py-0 [&_.wkit-connected-button]:text-xs [&_.wkit-connected-button]:font-semibold [&_.wkit-connected-button]:bg-white/10 [&_.wkit-connected-button]:text-white [&_.wkit-connected-button]:border-white/20 [&_.wkit-connected-container]:flex [&_.wkit-connected-container]:items-center [&_.wkit-connected-container]:justify-center">
        <ConnectButton
          className={cn(buttonClassName)}
        >
          {connected ? "Connected" : buttonLabel}
        </ConnectButton>
      </div>
    );
  }

  return (
    <div className={`${className} flex w-full flex-col items-center`}>
      <div className="flex flex-col items-center">
        <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">Verified Wallets</h2>
        <div className="mb-3 rounded-full bg-purple-900 px-4 py-1 text-xs text-white sm:mb-4 sm:text-sm">Up to +500 points</div>
        <p className="mb-4 max-w-[250px] text-center text-xs text-gray-400 sm:mb-6 sm:text-sm">
          Add onchain data to your profile. They are public by default*.
        </p>
      </div>

      <div className="relative mx-auto flex aspect-square w-full max-w-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-blue-500/40 bg-blue-500/5 p-6 sm:p-8">
        <div className="absolute right-2 top-2 h-3 w-3 rounded-full bg-gray-400" />
        <img src="/wallet.png" alt="Wallet" className="mb-3 h-10 w-10 object-contain sm:h-12 sm:w-12" />
        <ConnectButton
          className={cn(
            "border-none bg-transparent text-base font-normal text-white hover:bg-transparent hover:text-white sm:text-lg",
            buttonClassName,
          )}
        >
          {buttonLabel}
        </ConnectButton>
      </div>

      <p className="mx-auto mt-3 max-w-[250px] text-center text-[10px] text-gray-500 sm:mt-4 sm:text-xs">
        *Privacy note: Wallets are public by default, but you will soon be able to make them private. Private wallets will still count towards your Builder Score.
      </p>
    </div>
  );
};

export default CustomConnectWallet;
