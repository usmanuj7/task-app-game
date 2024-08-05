import React from "react";
import { View, Text, FlatList, Button, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { selectGames, removeFavourite } from "../redux/gameSlice";
import { RootState } from "../redux/store";

const TabTwoScreen = () => {
  const dispatch = useDispatch();
  const { games, favourites } = useSelector((state: RootState) => state.games);

  const favouriteGames = games.filter((game) => favourites.includes(game.id));

  const renderItem = ({ item }) => (
    <View
      style={{
        margin: 10,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 5,
      }}
    >
      <Image source={{ uri: item.icon }} style={{ width: 50, height: 50 }} />
      <Text>{item.title}</Text>
      <Text>Rating: {item.rating} / 5</Text>
      <Button
        title="Unfavourite"
        onPress={() => dispatch(removeFavourite(item.id))}
      />
    </View>
  );

  return (
    <FlatList
      data={favouriteGames}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default TabTwoScreen;
