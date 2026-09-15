/** 翻牌對戰 — 12 類 × 100 題多數派二選一 */

import bank from "./data/flip-bank.json";

export interface FlipCategory {
  id: string;
  icon: string;
  count: number;
  age: string;
}

export interface FlipQuestion {
  id: string;
  q: string;
  options: [string, string];
  cat: string;
  heat: number;
  age: string;
  correct?: 0 | 1;
}

export const FLIP_CATEGORIES: FlipCategory[] = bank.categories;

export const FLIP_QUESTIONS: FlipQuestion[] = bank.questions.map((q) => ({
  id: q.id,
  q: q.q,
  options: [q.a, q.b],
  cat: q.cat,
  heat: q.heat,
  age: q.age,
}));

const byId = new Map(FLIP_QUESTIONS.map((q) => [q.id, q]));

export function getFlipQuestion(id: string): FlipQuestion {
  return byId.get(id) ?? FLIP_QUESTIONS[0]!;
}

export function questionsForCat(cat: string | null, allow18: boolean): FlipQuestion[] {
  return FLIP_QUESTIONS.filter((q) => {
    if (!allow18 && q.age === "18+") return false;
    if (cat && q.cat !== cat) return false;
    return true;
  });
}
