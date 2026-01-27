import { createSlice } from "@reduxjs/toolkit";
import { STONE_TYPES, FACTORY_COUNT } from "../constants";

const createEmptyPlayer = (id) => ({
  id,
  patternLines: Array(5)
    .fill(null)
    .map((_, i) => Array(i + 1).fill(null)),
  wall: Array(5)
    .fill(null)
    .map(() => Array(5).fill(null)),
  floorLine: [],
  score: 0,
});

const initialState = {
  factories: [],
  center: [],
  players: [],
  currentPlayerId: 1,
  heldStones: null,
  gameState: "LOBBY",
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    initGame: (state) => {
      const playerCount = 2;
      const numFactories = FACTORY_COUNT[playerCount];

      state.factories = Array(numFactories)
        .fill([])
        .map(() =>
          Array(4)
            .fill(null)
            .map(() => {
              const types = Object.values(STONE_TYPES);
              return types[Math.floor(Math.random() * types.length)];
            }),
        );

      state.players = [createEmptyPlayer(1), createEmptyPlayer(2)];
      state.center = [];
      state.currentPlayerId = 1;
      state.heldStones = null;
      state.gameState = "PLAYING";
    },

    pickFromFactory: (state, action) => {
      const { factoryIndex, stoneType } = action.payload;
      const factory = state.factories[factoryIndex];

      const picked = factory.filter((s) => s === stoneType);
      const remaining = factory.filter((s) => s !== stoneType);

      state.center.push(...remaining);
      state.factories[factoryIndex] = [];
      state.heldStones = { type: stoneType, count: picked.length };
    },

    pickFromCenter: (state, action) => {
      const { stoneType } = action.payload;
      const picked = state.center.filter((s) => s === stoneType);
      const remaining = state.center.filter((s) => s !== stoneType);

      state.center = remaining;
      state.heldStones = { type: stoneType, count: picked.length };
    },

    placeStones: (state, action) => {
      const { lineIndex } = action.payload;
      if (!state.heldStones) return;

      const player = state.players.find((p) => p.id === state.currentPlayerId);
      const { type, count } = state.heldStones;
      const line = player.patternLines[lineIndex];

      const isLineEmpty = line.every((slot) => slot === null);
      const isSameType = line.find((slot) => slot !== null) === type;
      const rowInWall = player.wall[lineIndex];
      const alreadyInWall = rowInWall.includes(type);

      if ((isLineEmpty || isSameType) && !alreadyInWall) {
        let remaining = count;

        for (let i = 0; i < line.length; i++) {
          if (line[i] === null && remaining > 0) {
            line[i] = type;
            remaining--;
          }
        }

        if (remaining > 0) {
          for (let i = 0; i < remaining; i++) {
            if (player.floorLine.length < 7) {
              player.floorLine.push(type);
            }
          }
        }

        state.heldStones = null;
        state.currentPlayerId = state.currentPlayerId === 1 ? 2 : 1;
      }
    },

    nextTurn: (state) => {
      state.currentPlayerId = state.currentPlayerId === 1 ? 2 : 1;
      state.heldStones = null;
    },
  },
});

// CORRECTION ICI : Ajout de placeStones et pickFromCenter dans les exports
export const {
  initGame,
  pickFromFactory,
  pickFromCenter,
  placeStones,
  nextTurn,
} = gameSlice.actions;

export default gameSlice.reducer;
