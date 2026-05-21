import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { STONE_TYPES, FACTORY_COUNT, StoneType } from "../constants";

type PatternLine = Array<StoneType | null>;

type Player = {
  id: number;
  patternLines: PatternLine[];
  wall: (StoneType | null)[][];
  floorLine: Array<StoneType | "FIRST_PLAYER">;
  score: number;
};

type HeldStones = { type: StoneType; count: number } | null;

export type GameState = {
  factories: StoneType[][];
  center: StoneType[];
  players: Player[];
  currentPlayerId: number;
  nextFirstPlayerId: number;
  heldStones: HeldStones;
  firstStonePicked: boolean;
  gameState: string;
  bag: StoneType[];
  discard: StoneType[];
};

const WALL_ORDER: StoneType[][] = [
  [STONE_TYPES.SPACE, STONE_TYPES.MIND, STONE_TYPES.REALITY, STONE_TYPES.POWER, STONE_TYPES.TIME],
  [STONE_TYPES.TIME, STONE_TYPES.SPACE, STONE_TYPES.MIND, STONE_TYPES.REALITY, STONE_TYPES.POWER],
  [STONE_TYPES.POWER, STONE_TYPES.TIME, STONE_TYPES.SPACE, STONE_TYPES.MIND, STONE_TYPES.REALITY],
  [STONE_TYPES.REALITY, STONE_TYPES.POWER, STONE_TYPES.TIME, STONE_TYPES.SPACE, STONE_TYPES.MIND],
  [STONE_TYPES.MIND, STONE_TYPES.REALITY, STONE_TYPES.POWER, STONE_TYPES.TIME, STONE_TYPES.SPACE],
];

const createEmptyPlayer = (id: number): Player => ({
  id,
  patternLines: Array.from({ length: 5 }, (_, i) => Array(i + 1).fill(null)),
  wall: Array.from({ length: 5 }, () => Array(5).fill(null)),
  floorLine: [],
  score: 0,
});

const calculatePoints = (wall: (StoneType | null)[][], row: number, col: number) => {
  let hScore = 0, vScore = 0;
  for (let i = col + 1; i < 5 && wall[row][i]; i++) hScore++;
  for (let i = col - 1; i >= 0 && wall[row][i]; i--) hScore++;
  for (let i = row + 1; i < 5 && wall[i][col]; i++) vScore++;
  for (let i = row - 1; i >= 0 && wall[i][col]; i--) vScore++;
  let total = 1;
  if (hScore > 0) total += hScore;
  if (vScore > 0) total += vScore;
  return total;
};

const initialState: GameState = {
  factories: [],
  center: [],
  players: [],
  currentPlayerId: 1,
  nextFirstPlayerId: 1,
  heldStones: null,
  firstStonePicked: false,
  gameState: "LOBBY",
  bag: [],
  discard: [],
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    initGame: (state) => {
      let initialBag: StoneType[] = [];
      Object.values(STONE_TYPES).forEach((type) => {
        for (let i = 0; i < 20; i++) initialBag.push(type as StoneType);
      });
      state.bag = initialBag.sort(() => Math.random() - 0.5);
      state.players = [createEmptyPlayer(1), createEmptyPlayer(2)];
      const numFactories = FACTORY_COUNT[2];
      state.factories = Array(numFactories)
        .fill([])
        .map(() => state.bag.splice(0, 4));
      state.center = [];
      state.discard = [];
      state.firstStonePicked = false;
      state.gameState = "PLAYING";
      state.currentPlayerId = 1;
      state.nextFirstPlayerId = 1;
    },
    pickFromFactory: (state, action: PayloadAction<{ factoryIndex: number; stoneType: StoneType }>) => {
      const { factoryIndex, stoneType } = action.payload;
      const picked = state.factories[factoryIndex].filter((s) => s === stoneType);
      state.center.push(...state.factories[factoryIndex].filter((s) => s !== stoneType));
      state.factories[factoryIndex] = [];
      state.heldStones = { type: stoneType, count: picked.length };
    },
    pickFromCenter: (state, action: PayloadAction<{ stoneType: StoneType }>) => {
      const { stoneType } = action.payload;
      const player = state.players.find((p) => p.id === state.currentPlayerId);
      if (!player) return;
      if (!state.firstStonePicked) {
        if (player.floorLine.length < 7) player.floorLine.push("FIRST_PLAYER");
        state.firstStonePicked = true;
        state.nextFirstPlayerId = state.currentPlayerId;
      }
      const picked = state.center.filter((s) => s === stoneType);
      state.center = state.center.filter((s) => s !== stoneType);
      state.heldStones = { type: stoneType, count: picked.length };
    },
    placeStones: (state, action: PayloadAction<{ lineIndex: number }>) => {
      const { lineIndex } = action.payload;
      const player = state.players.find((p) => p.id === state.currentPlayerId);
      if (!player || !state.heldStones) return;

      const { type, count } = state.heldStones;
      const line = player.patternLines[lineIndex];
      const colInWall = WALL_ORDER[lineIndex].indexOf(type);

      const hasDifferentColor = line.some((s) => s !== null && s !== type);
      const isAlreadyInWall = player.wall[lineIndex][colInWall] !== null;

      let remaining = count;

      if (hasDifferentColor || isAlreadyInWall) {
        while (remaining > 0 && player.floorLine.length < 7) {
          player.floorLine.push(type);
          remaining--;
        }
        if (remaining > 0) state.discard.push(...Array(remaining).fill(type));
      } else {
        for (let i = line.length - 1; i >= 0 && remaining > 0; i--) {
          if (line[i] === null) {
            line[i] = type;
            remaining--;
          }
        }
        while (remaining > 0 && player.floorLine.length < 7) {
          player.floorLine.push(type);
          remaining--;
        }
        if (remaining > 0) state.discard.push(...Array(remaining).fill(type));
      }
      state.heldStones = null;

      if (state.factories.every((f) => f.length === 0) && state.center.length === 0) {
        state.players.forEach((p) => {
          p.patternLines.forEach((l, row) => {
            if (l.every((s) => s !== null)) {
              const stone = l[0] as StoneType;
              const col = WALL_ORDER[row].indexOf(stone);
              p.wall[row][col] = stone;
              p.score += calculatePoints(p.wall, row, col);
              state.discard.push(...(l as StoneType[]).slice(1));
              p.patternLines[row] = Array(row + 1).fill(null) as PatternLine;
            }
          });
          const penalties = [-1, -1, -2, -2, -2, -3, -3];
          p.floorLine.forEach((item, i) => {
            p.score = Math.max(0, p.score + (penalties[i] || -3));
            if (item !== "FIRST_PLAYER") state.discard.push(item as StoneType);
          });
          p.floorLine = [];
        });

        if (state.players.some((p) => p.wall.some((row) => row.every((c) => c !== null)))) {
          state.players.forEach((p) => {
            p.wall.forEach((row) => {
              if (row.every((c) => c !== null)) p.score += 2;
            });
            for (let c = 0; c < 5; c++) {
              if (p.wall.every((r) => r[c] !== null)) p.score += 7;
            }
            Object.values(STONE_TYPES).forEach((t) => {
              if (p.wall.every((row) => row.includes(t as StoneType))) p.score += 10;
            });
          });
          state.gameState = "GAME_OVER";
        } else {
          if (state.bag.length < FACTORY_COUNT[2] * 4) {
            state.bag = [...state.bag, ...state.discard].sort(() => Math.random() - 0.5);
            state.discard = [];
          }
          state.factories = Array(FACTORY_COUNT[2]).fill([]).map(() => state.bag.splice(0, 4));
          state.firstStonePicked = false;
          state.currentPlayerId = state.nextFirstPlayerId;
        }
      } else {
        state.currentPlayerId = state.currentPlayerId === 1 ? 2 : 1;
      }
    },
  },
});

export const { initGame, pickFromFactory, pickFromCenter, placeStones } = gameSlice.actions;
export default gameSlice.reducer;
