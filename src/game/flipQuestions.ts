/** 二選一 — 1000 題，不分類 */

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

export const FLIP_CATEGORIES: FlipCategory[] = [];

export const FLIP_QUESTIONS: FlipQuestion[] = bank.questions.map((q) => ({
  id: q.id,
  q: q.q,
  options: [q.a, q.b] as [string, string],
  cat: "",
  heat: 0,
  age: "",
}));

const byId = new Map(FLIP_QUESTIONS.map((q) => [q.id, q]));

export function getFlipQuestion(id: string): FlipQuestion {
  return byId.get(id) ?? FLIP_QUESTIONS[0]!;
}

export function questionsForCat(_cat: string | null, _allow18: boolean): FlipQuestion[] {
  return FLIP_QUESTIONS;
}
