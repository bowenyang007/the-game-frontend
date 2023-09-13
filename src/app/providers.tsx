"use client";

import React, { createContext, useState } from "react";
import { ChakraProvider, Flex, theme } from "@chakra-ui/react";
import {
  AptosWalletAdapterProvider,
  Wallet,
} from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { WalletConnector } from "./wallet/WalletConnector";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";

export interface GameState {
  pool: number;
  latestPlayerState: LatestPlayerState;
  maxPlayer: number;
  numBtwSecs: number;
  currentRound: number;
}

export interface PlayerStateView {
  isAlive: boolean;
  wins: number;
  nftUri: string;
  potentialWinning: number;
  tokenIndex: number;
}

export interface LatestPlayerState {
  [address: string]: PlayerStateView;
}
export function Providers({ children }: { children: React.ReactNode }) {
  const wallets: Wallet[] = [new PetraWallet(), new PontemWallet()];

  return (
    <ChakraProvider>
      <AptosWalletAdapterProvider
        plugins={wallets}
        autoConnect={true}
        onError={(error) => {
          console.log("error", error);
        }}
      >
        <Flex direction="column" align="flex-end" pr={5} pt={5}>
          <WalletConnector />
        </Flex>
        <Flex direction="column" align="center">
          {children}
        </Flex>
      </AptosWalletAdapterProvider>
    </ChakraProvider>
  );
}
