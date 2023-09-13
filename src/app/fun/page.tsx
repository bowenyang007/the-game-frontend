"use client";

import { Box, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GameState, PlayerState, PlayerStatesMap } from "../providers";
// import DeadPerson from "./components/DeadPerson";
import { CloseIcon } from "@chakra-ui/icons";
import { dummyPlayerStates } from "./const";

export default function FunPage() {
  const previousScoreSaver: any[] = [];

  // const { gameState } = useContext(StateContext);

  const [playerStates, setPlayerStates] = useState<PlayerStatesMap>({});
  const [gameState, setGameState] = useState<GameState>();

  const getState = async () => {
    // call server to know game state
    const response = await fetch("http://localhost:8000/view_state");
    const newState = await response.json();
    return newState;
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const newState: GameState = await getState();
      console.log("newState", newState);
      const updatedPlayerStates = { ...playerStates };

      // Object.keys(newState).forEach((playerId) => {
      //   console.log("playerId", playerId);
      //   console.log("updatedPlayerStates", updatedPlayerStates);
      //   if (updatedPlayerStates[playerId]) {
      //     // Check if the player exists in the local state
      //     const newScore = newState[playerId].potential_winning;
      //     const localScore = updatedPlayerStates[playerId].potential_winning;

      //     if (newScore !== localScore) {
      //       // Update the local state if the scores are different
      //       previousScoreSaver.push(localScore);
      //       updatedPlayerStates[playerId].potential_winning = newScore;
      //     }
      //   }
      // });

      setGameState(newState);

      // setPlayerStates((prevState) => {
      //   const newState = { ...prevState };

      //   for (const playerId in newState) {
      //     console.log(playerId);
      //     if (!newState[playerId].lost && playerId % 3 === 0) {
      //       newState[playerId].lost = true;
      //       break;
      //     }
      //   }

      //   return newState;
      // });
    }, 500);

    return () => clearInterval(intervalId);
  }, []);
  console.log("gameState", gameState);
  console.log("gameState.latestPlayerState", gameState?.latestPlayerState);
  const playerSquares = gameState?.latestPlayerState
    ? Object.entries(gameState?.latestPlayerState).map(([playerId, state]) => (
        <Box
          key={playerId}
          w={`200px`}
          h={`200px`}
          bg={state.is_alive ? "green.300" : "gray.400"}
          borderRadius="md"
          justifyContent="center"
          alignItems="center"
          m="8px"
        >
          <Box>
            {state.is_alive ? (
              <>
                <Text mt="2" align="center" fontSize="15px">
                  {state.token_index}
                </Text>
                <Image src={state.nft_uri} className={"image-element-alive"} />
                <Text mt="6" mb="2" align="center" fontSize="20px">
                  {state.potential_winning}
                </Text>
              </>
            ) : (
              <Box>
                <Box className={"image-wrapper"}>
                  <Text mt="2" align="center" fontSize="15px">
                    {state.token_index}
                  </Text>
                  <Image src={state.nft_uri} className={"image-element"} />
                  <CloseIcon color="red.500" className={"x-icon"} />
                </Box>
                <Text
                  mt="6"
                  align="center"
                  fontSize="20px"
                  color="red"
                  fontWeight="bold"
                >
                  {/* {Count(
                  previousScoreSaver[parseInt(playerId)],
                  state.potential_winning
                )} */}
                  {state.potential_winning}
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      ))
    : null;

  return (
    <Box>
      <Heading>DASHBOARD</Heading>
      {gameState && gameState?.latestPlayerState && (
        <Flex flexWrap="wrap">{playerSquares}</Flex>
      )}
    </Box>
  );
}

function Count(startNumber: any, endNumber: any) {
  // if (endNumber === 0) {
  //   return Countdown(startNumber);
  // }
  const [count, setCount] = useState(startNumber);

  useEffect(() => {
    const interval = setInterval(() => {
      if (endNumber === 0) {
        if (count > 0) {
          setCount(count - 1);
        }
      } else {
        if (count <= endNumber) {
          setCount(count + 1);
        }
      }
    }, 15);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div>
      <h1>{count} APT</h1>
    </div>
  );
}

function Countdown(startNumber: any) {
  const [count, setCount] = useState(startNumber);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count > 0) {
        setCount(count - 1);
      }
    }, 15);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div>
      <h1>{count} APT</h1>
    </div>
  );
}
