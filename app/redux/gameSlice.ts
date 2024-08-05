import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface Game {
  id: string;
  title: string;
  icon: string;
  rating: number;
  description: string;
}

interface GameState {
  games: Game[];
  favourites: string[];
  loading: boolean;
  error: string | null;
}

const initialState: GameState = {
  games: [],
  favourites: [],
  loading: false,
  error: null,
};

export const fetchGames = createAsyncThunk("games/fetchGames", async () => {
  const response = await fetch(
    "https://mock-game-api-9a408f047f23.herokuapp.com/api/games",
    {
      headers: {
        "X-API-Key": "01964fa8-f0e5-40fc-a13b-9f5c3a5415f3",
      },
    }
  );
  if (!response.ok) throw new Error("Network response was not ok");
  console.log("response is", response);
  return response.json();
});

const gameSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    addFavourite: (state, action: PayloadAction<string>) => {
      state.favourites.push(action.payload);
    },
    removeFavourite: (state, action: PayloadAction<string>) => {
      state.favourites = state.favourites.filter((id) => id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action: PayloadAction<Game[]>) => {
        state.games = action.payload;
        state.loading = false;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch games";
      });
  },
});

export const { addFavourite, removeFavourite } = gameSlice.actions;

export const selectGames = (state: RootState) => state.games;

export default gameSlice.reducer;
