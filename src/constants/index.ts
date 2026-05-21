export const STONE_TYPES = {
  SPACE: "SPACE",
  MIND: "MIND",
  REALITY: "REALITY",
  POWER: "POWER",
  TIME: "TIME",
} as const;

export type StoneType = (typeof STONE_TYPES)[keyof typeof STONE_TYPES];

export const STONE_COLORS: Record<StoneType, string> = {
  [STONE_TYPES.SPACE]: "#4da6ff",
  [STONE_TYPES.MIND]: "#ff8c00",
  [STONE_TYPES.REALITY]: "#ff4444",
  [STONE_TYPES.POWER]: "#a020f0",
  [STONE_TYPES.TIME]: "#00ff88",
};

export const PLAYER_COUNT = {
  MIN: 2,
  MAX: 4,
} as const;

export const FACTORY_COUNT: Record<number, number> = {
  2: 5,
  3: 7,
  4: 9,
};

export const TILES_PER_FACTORY = 4;

export default {
  STONE_TYPES,
  STONE_COLORS,
  PLAYER_COUNT,
  FACTORY_COUNT,
  TILES_PER_FACTORY,
};
