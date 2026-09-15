import { createRng, rngInt } from "./rng";
import type { Player } from "./state";

export const BOT_NAMES = ["電腦·阿明", "電腦·小美", "電腦·老王", "電腦·小陳", "電腦·阿智"];

export function botFlipVote(seed: string, botId: string, index: number): 0 | 1 {
  const rng = createRng(`${seed}:botflip:${botId}:${index}`);
  return rngInt(rng, 2) as 0 | 1;
}

export function botWhoTarget(players: Player[], botId: string, salt: string): string {
  const rng = createRng(`${salt}:whotarget:${botId}`);
  const others = players.filter((p) => p.id !== botId);
  const pool = others.length ? others : players;
  return pool[rngInt(rng, pool.length)]?.id ?? botId;
}

export function botTruth(roleId: string, seed: string, botId: string): "answer" | "punish" {
  const rng = createRng(`${seed}:bottruth:${botId}`);
  const punishChance = roleId === "intern" ? 0.55 : roleId === "ceo" || roleId === "sales" ? 0.18 : 0.34;
  return rng() < punishChance ? "punish" : "answer";
}

export function botReactMisses(seed: string, botId: string): number {
  const rng = createRng(`${seed}:botreact:${botId}`);
  return rng() < 0.32 ? 1 : 0;
}
