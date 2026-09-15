import { useEffect } from "react";
import { botFlipVote, botReactMisses, botTruth, botWhoTarget } from "@/game/bots";
import { useGame } from "@/game/store";

/** 練習模式：電腦自動投票／真心話／反應，玩家只操作自己。 */
export function usePracticeBots() {
  const practice = useGame((s) => s.practice);
  const phase = useGame((s) => s.phase);
  const flipSub = useGame((s) => s.flip?.sub);
  const flipIndex = useGame((s) => s.flip?.index);
  const whoSub = useGame((s) => s.who?.sub);
  const whoVoter = useGame((s) => s.who?.voterId);
  const whoIndex = useGame((s) => s.who?.index);
  const truthSub = useGame((s) => s.truth?.sub);
  const truthPid = useGame((s) => s.truth?.playerId);
  const reactSub = useGame((s) => s.react?.sub);
  const reactPid = useGame((s) => s.react?.playerId);

  useEffect(() => {
    if (!practice) return;
    const timers: number[] = [];
    const s = useGame.getState();

    if (phase === "flip_battle" && s.flip?.sub === "choose") {
      s.players
        .filter((p) => p.isBot && !(p.id in (s.flip?.votes ?? {})))
        .forEach((p, i) => {
          timers.push(
            window.setTimeout(() => {
              const cur = useGame.getState();
              if (cur.flip?.sub !== "choose") return;
              cur.pickFlip(botFlipVote(cur.seed, p.id, cur.flip.index), p.id);
            }, 460 + i * 240),
          );
        });
    }

    if (phase === "who" && s.who?.sub === "vote") {
      const voter = s.players.find((p) => p.id === s.who?.voterId);
      if (voter?.isBot) {
        timers.push(
          window.setTimeout(() => {
            const cur = useGame.getState();
            if (cur.who?.sub !== "vote" || cur.who.voterId !== voter.id) return;
            const target = botWhoTarget(cur.players, voter.id, `${cur.seed}:${cur.who.index}`);
            cur.voteWho(target, voter.id);
          }, 640),
        );
      }
    }

    if (phase === "truth" && s.truth?.sub === "ask") {
      const actor = s.players.find((p) => p.id === s.truth?.playerId);
      if (actor?.isBot) {
        timers.push(
          window.setTimeout(() => {
            const cur = useGame.getState();
            if (cur.truth?.sub !== "ask" || cur.truth.playerId !== actor.id) return;
            cur.pickTruth(botTruth(actor.roleId, cur.seed, actor.id));
          }, 880),
        );
      }
    }

    if (phase === "react" && s.react?.sub === "ready") {
      const actor = s.players.find((p) => p.id === s.react?.playerId);
      if (actor?.isBot) {
        timers.push(
          window.setTimeout(() => {
            const cur = useGame.getState();
            if (cur.react?.sub !== "ready" || cur.react.playerId !== actor.id) return;
            cur.finishReact(botReactMisses(cur.seed, actor.id));
          }, 1100),
        );
      }
    }

    return () => {
      for (const t of timers) window.clearTimeout(t);
    };
  }, [practice, phase, flipSub, flipIndex, whoSub, whoVoter, whoIndex, truthSub, truthPid, reactSub, reactPid]);
}
