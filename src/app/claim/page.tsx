"use client";

import { Box, Flex, Heading, Text, Image, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GameState, PlayerState, PlayerStatesMap } from "../providers";
// import DeadPerson from "./components/DeadPerson";
import { CloseIcon } from "@chakra-ui/icons";
import { IndexerClient } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const collectionAddress = process.env.NEXT_PUBLIC_COLLECTION_ADDRESS;

export default function ClaimPage() {
  const [collectionTokens, setCollectionTokens] = useState<any[]>([]);
  const { account, signAndSubmitTransaction } = useWallet();

  const getCollectionTokens = async () => {
    const provider = new IndexerClient(
      "https://indexer-devnet.staging.gcp.aptosdev.com/v1/graphql"
    );
    const collectionTokens = await provider.getTokenOwnedFromCollectionAddress(
      "0x1f91f384454135a281e4a58d1f7d67432c79101dd0d561e44a3072d975f0e709",
      collectionAddress!
    );

    return collectionTokens;
  };

  useEffect(() => {
    getCollectionTokens().then((data: any) => {
      setCollectionTokens(data.current_token_ownerships_v2);
    });
  }, []);

  const onClaimClick = async (token_data_id: any) => {
    console.log("clicked");
    const payload: any = {
      type: "entry_function_payload",
      function: `0xf951a0603039c0072917f19130863e6fec5945b92340d77e90900f26da12a142::game_manager::claim`,
      type_arguments: [],
      arguments: [token_data_id],
    };
    const res = await signAndSubmitTransaction(payload);
  };

  console.log("collectionTokens", collectionTokens);
  const playerSquares = collectionTokens.map((token) => (
    <Box
      key={token}
      w={`200px`}
      h={`200px`}
      bg={"green.300"}
      borderRadius="md"
      justifyContent="center"
      alignItems="center"
      m="8px"
    >
      <Box>
        <Image
          src={token.current_token_data.token_uri}
          className={"image-element-alive"}
        />
        <Button onClick={() => onClaimClick(token.token_data_id)}>CLAIM</Button>
      </Box>
    </Box>
  ));

  return (
    <Box>
      <Heading>CLAIM</Heading>
      <Flex flexWrap="wrap">{playerSquares}</Flex>
    </Box>
  );
}
