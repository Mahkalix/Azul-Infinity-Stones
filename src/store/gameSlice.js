import { createSlice } from "@reduxjs/toolkit";
import { STONE_TYPES, FACTORY_COUNT, TILES_PER_FACTORY } from "../constants";

const initialState = {
  factories: [], // Tableau de tableaux de pierres
  center: [], // Pierres au centre de la table
  players: [
    {
      id: 1,
      patternLines: [
        [null],
        [null, null],
        [null, null, null],
        [null, null, null, null],
        [null, null, null, null, null],
      ],
      wall: Array(5)
        .fill(null)
        .map(() => Array(5).fill(null)),
      floorLine: [],
      score: 0,
    },
  ],
  currentPlayerId: 1,
  gameState: "LOBBY", // LOBBY, PLAYING, ROUND_END, GAME_OVER
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    initGame: (state, action) => {
      const { playerCount } = action.payload;
      const numFactories = FACTORY_COUNT[playerCount];
      // Logique pour remplir les fabriques avec des pierres aléatoires
      state.factories = Array(numFactories)
        .fill([])
        .map(() =>
          Array(TILES_PER_FACTORY)
            .fill(null)
            .map(() => {
              const types = Object.values(STONE_TYPES);
              return types[Math.floor(Math.random() * types.length)];
            }),
        );
      state.gameState = "PLAYING";
    },
    pickFromFactory: (state, action) => {
      const { factoryIndex, stoneType } = action.payload;
      const factory = state.factories[factoryIndex];

      // 1. On prend les pierres de la couleur choisie
      const pickedStones = factory.filter((s) => s === stoneType);

      // 2. On envoie le reste au centre
      const remainingStones = factory.filter((s) => s !== stoneType);
      state.center.push(...remainingStones);

      // 3. On vide la fabrique
      state.factories[factoryIndex] = [];

      // 4. Stocker temporairement les pierres piochées pour le placement
      state.heldStones = pickedStones;
    },
    // Ajoutez ici les actions pour piocher une pierre, etc.
  },
});

export const { initGame } = gameSlice.actions;
export default gameSlice.reducer;
