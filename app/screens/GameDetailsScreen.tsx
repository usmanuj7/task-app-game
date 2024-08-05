import React, { useEffect, useState } from "react";
import { View, Text, Image, Button } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { addFavourite, removeFavourite } from "../redux/gameSlice";

interface Game {
  id: string;
  title: string;
  description: string;
  rating: number;
  icon: string;
  banner: string;
}

interface RouteParams {
  gameId: string;
}
const GameDetailsScreen = () => {
  const route = useRoute();
  const { gameId } = route.params as RouteParams;
  const dispatch = useDispatch();
  const { favourites } = useSelector((state: RootState) => state.games);
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(
          `https://mock-game-api-9a408f047f23.herokuapp.com/api/games/${gameId}`,
          {
            headers: {
              "X-API-Key": "01964fa8-f0e5-40fc-a13b-9f5c3a5415f3",
            },
          }
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setGame(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  const handleFavourite = () => {
    if (favourites.includes(game.id)) {
      dispatch(removeFavourite(game.id));
    } else {
      dispatch(addFavourite(game.id));
    }
  };

  return (
    <View style={{ padding: 10 }}>
      <Image
        source={{ uri: game.bannerURL }}
        style={{ width: "100%", height: 200 }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={{ uri: game.iconURL }}
          style={{
            width: 50,
            height: 50,
            marginTop: -30,

            borderRadius: 100,
          }}
        />
      </View>

      <Text style={{ fontWeight: "bold", fontSize: 20, paddingVertical: 20 }}>
        {game.title}
      </Text>

      <Text>{game.description}</Text>
      <Text style={{ fontWeight: "bold", fontSize: 20, paddingVertical: 20 }}>
        Rating: {game.rating} / 5
      </Text>
      <Button
        title={favourites.includes(game.id) ? "Unfavourite" : "Favourite"}
        onPress={handleFavourite}
      />
    </View>
  );
};

export default GameDetailsScreen;
