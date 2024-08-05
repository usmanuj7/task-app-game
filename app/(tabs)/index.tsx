import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGames,
  addFavourite,
  removeFavourite,
  selectGames,
} from "../redux/gameSlice";
import { RootState } from "../redux/store";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const FavouritesScreen = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { games, favourites, loading, error } = useSelector(
    (state: RootState) => state.games
  );
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  const handleFavourite = (id: string) => {
    if (favourites.includes(id)) {
      dispatch(removeFavourite(id));
    } else {
      dispatch(addFavourite(id));
    }
  };

  const renderItem = ({ item }) => (
    <View>
      <View style={styles.card}>
        <Image source={{ uri: item.iconURL }} style={styles.icon} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.rating}>Rating: {item.rating} / 5</Text>
          <Button
            title="Details"
            onPress={() =>
              router.push({
                title: "Game details",
                pathname: "/screens/GameDetailsScreen",
                params: { gameId: item.id },
              })
            }
          />
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => handleFavourite(item.id)}>
            <Text style={styles.favouriteButton}>
              {favourites.includes(item.id) ? "♥" : "♡"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <SafeAreaView>
      <FlatList
        data={games}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default FavouritesScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rating: {
    fontSize: 16,
    color: "gray",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
  },
  favouriteButton: {
    fontSize: 24,
    color: "#f50",
    marginRight: 10,
  },
});
