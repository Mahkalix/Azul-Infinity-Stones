import { createSlice } from "@reduxjs/toolkit";
import { STONE_TYPES, FACTORY_COUNT } from "../constants";

const WALL_ORDER = [
  [
    STONE_TYPES.SPACE,
    STONE_TYPES.MIND,
    STONE_TYPES.REALITY,
    STONE_TYPES.POWER,
    STONE_TYPES.TIME,
  ],
  [
    STONE_TYPES.TIME,
    STONE_TYPES.SPACE,
    STONE_TYPES.MIND,
    STONE_TYPES.REALITY,
    STONE_TYPES.POWER,
  ],
  [
    STONE_TYPES.POWER,
    STONE_TYPES.TIME,
    STONE_TYPES.SPACE,
    STONE_TYPES.MIND,
    STONE_TYPES.REALITY,
  ],
  [
    STONE_TYPES.REALITY,
    STONE_TYPES.POWER,
    STONE_TYPES.TIME,
    STONE_TYPES.SPACE,
    STONE_TYPES.MIND,
  ],
  [
    STONE_TYPES.MIND,
    STONE_TYPES.REALITY,
    STONE_TYPES.POWER,
    STONE_TYPES.TIME,
    STONE_TYPES.SPACE,
  ],
];

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

const calculatePoints = (wall, row, col) => {
  let hScore = 0;
  let vScore = 0;
  for (let i = col + 1; i < 5 && wall[row][i]; i++) hScore++;
  for (let i = col - 1; i >= 0 && wall[row][i]; i--) hScore++;
  for (let i = row + 1; i < 5 && wall[i][col]; i++) vScore++;
  for (let i = row - 1; i >= 0 && wall[i][col]; i--) vScore++;
  let total = 1;
  if (hScore > 0) total += hScore;
  if (vScore > 0) total += vScore;
  return total;
};

const gameSlice = createSlice({
  name: "game",
  initialState: {
    factories: [],
    center: [],
    players: [],
    currentPlayerId: 1,
    heldStones: null,
    firstStonePicked: false,
    gameState: "LOBBY",
  },
  reducers: {
    initGame: (state) => {
      const numFactories = FACTORY_COUNT[2];
      state.factories = Array(numFactories)
        .fill([])
        .map(() =>
          Array(4)
            .fill(null)
            .map(
              () => Object.values(STONE_TYPES)[Math.floor(Math.random() * 5)],
            ),
        );
      state.players = [createEmptyPlayer(1), createEmptyPlayer(2)];
      state.center = [];
      state.firstStonePicked = false;
      state.gameState = "PLAYING";
    },
    pickFromFactory: (state, action) => {
      const { factoryIndex, stoneType } = action.payload;
      const picked = state.factories[factoryIndex].filter(
        (s) => s === stoneType,
      );
      state.center.push(
        ...state.factories[factoryIndex].filter((s) => s !== stoneType),
      );
      state.factories[factoryIndex] = [];
      state.heldStones = { type: stoneType, count: picked.length };
    },
    pickFromCenter: (state, action) => {
      const { stoneType } = action.payload;
      const player = state.players.find((p) => p.id === state.currentPlayerId);
      if (!state.firstStonePicked) {
        player.floorLine.push("FIRST_PLAYER");
        state.firstStonePicked = true;
      }
      const picked = state.center.filter((s) => s === stoneType);
      state.center = state.center.filter((s) => s !== stoneType);
      state.heldStones = { type: stoneType, count: picked.length };
    },
    placeStones: (state, action) => {
      const { lineIndex } = action.payload;
      const player = state.players.find((p) => p.id === state.currentPlayerId);
      const { type, count } = state.heldStones;

      let remaining = count;
      const line = player.patternLines[lineIndex];
      for (let i = 0; i < line.length && remaining > 0; i++) {
        if (line[i] === null) {
          line[i] = type;
          remaining--;
        }
      }
      while (remaining > 0 && player.floorLine.length < 7) {
        player.floorLine.push(type);
        remaining--;
      }
      state.heldStones = null;

      if (
        state.factories.every((f) => f.length === 0) &&
        state.center.length === 0
      ) {
        state.players.forEach((p) => {
          p.patternLines.forEach((l, row) => {
            if (l.every((s) => s !== null)) {
              const stone = l[0];
              const col = WALL_ORDER[row].indexOf(stone);
              p.wall[row][col] = stone;
              p.score += calculatePoints(p.wall, row, col);
              p.patternLines[row] = Array(row + 1).fill(null);
            }
          });
          const floorPenalties = [-1, -1, -2, -2, -2, -3, -3];
          p.floorLine.forEach(
            (_, i) => (p.score = Math.max(0, p.score + floorPenalties[i])),
          );
          p.floorLine = [];
        });

        if (
          state.players.some((p) =>
            p.wall.some((row) => row.every((c) => c !== null)),
          )
        ) {
          state.players.forEach((p) => {
            p.wall.forEach((row) => {
              if (row.every((c) => c !== null)) p.score += 2;
            });
            for (let c = 0; c < 5; c++) {
              if (p.wall.every((r) => r[c] !== null)) p.score += 7;
            }
            Object.values(STONE_TYPES).forEach((t) => {
              if (p.wall.every((row) => row.includes(t))) p.score += 10;
            });
          });
          state.gameState = "GAME_OVER";
        } else {
          state.factories = Array(FACTORY_COUNT[2])
            .fill([])
            .map(() =>
              Array(4)
                .fill(null)
                .map(
                  () =>
                    Object.values(STONE_TYPES)[Math.floor(Math.random() * 5)],
                ),
            );
          state.firstStonePicked = false;
          state.currentPlayerId = 1;
        }
      } else {
        state.currentPlayerId = state.currentPlayerId === 1 ? 2 : 1;
      }
    },
  },
});

export const { initGame, pickFromFactory, pickFromCenter, placeStones } =
  gameSlice.actions;
export default gameSlice.reducer;
