export type NetSend = (msg: { t: string; [k: string]: unknown }, to?: string) => void;

export const netSend: { current: NetSend | null } = { current: null };
