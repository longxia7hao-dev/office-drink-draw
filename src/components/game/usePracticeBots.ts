import { useEffect } from "react";
import { botFlipVote, botNever, botTruth, botWhoTarget } from "@/game/bots";
import { reactMustTap } from "@/game/state";
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
  const neverSub = useGame((s) => s.never?.sub);
  const neverIndex = useGame((s) => s.never?.index);
  const artistSub = useGame((s) => s.artist?.sub);
  const artistIndex = useGame((s) => s.artist?.index);
  const reactSub = useGame((s) => s.react?.sub);
  const reactCard = useGame((s) => s.react?.card);
  const matchTurn = useGame((s) => s.match?.turn);
  const matchLock = useGame((s) => s.match?.lock);
  const matchSub = useGame((s) => s.match?.sub);
  const matchFound = useGame((s) => s.match?.found);
  const isOnline = useGame((s) => s.isOnline);
  const isHost = useGame((s) => s.isHost);
  const skillFlash = useGame((s) => s.skillFlash?.msg ?? "");
  const skillKey = useGame((s) => s.players.map((p) => (p.skillUsed ? p.id : "")).join(","));
  const punishKey = useGame((s) =>
    [
      ...(s.flip?.drinkerIds ?? []),
      ...(s.who?.punishedIds ?? []),
      s.truth?.took ?? "",
      ...(s.react?.dead ?? []),
      ...Object.keys(s.hitAmt ?? {}),
    ].join(","),
  );

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

    if (phase === "never" && s.never?.sub === "ask") {
      const passed = s.never.passed ?? [];
      s.players
        .filter((p) => p.isBot && !s.never!.marked.includes(p.id) && !passed.includes(p.id))
        .forEach((p, i) => {
          timers.push(
            window.setTimeout(() => {
              const cur = useGame.getState();
              if (cur.never?.sub !== "ask") return;
              const did = botNever(cur.seed, p.id, cur.never.index);
              cur.neverSay(did, p.id);
            }, 420 + i * 180),
          );
        });
    }

    if (phase === "artist" && s.artist) {
      const art = s.artist;
      const painter = s.players.find((p) => p.id === art.artistId);
      if (art.sub === "pick" && painter?.isBot) {
        timers.push(
          window.setTimeout(() => {
            const cur = useGame.getState();
            if (cur.artist?.sub !== "pick" || cur.artist.artistId !== painter.id) return;
            const word = cur.artist.choices[Math.floor(Math.random() * cur.artist.choices.length)];
            if (word) cur.artistPick(word, painter.id);
          }, 700),
        );
      }
      if (art.sub === "draw" && painter?.isBot) {
        timers.push(
          window.setTimeout(() => {
            const cur = useGame.getState();
            if (cur.artist?.sub !== "draw" || cur.artist.artistId !== painter.id) return;
            cur.artistStroke([200, 500, 400, 300, 600, 500, 500, 700], painter.id);
            useGame.getState().artistDone(painter.id);
          }, 900),
        );
      }
      if (art.sub === "guess") {
        s.players
          .filter((p) => p.isBot && p.id !== art.artistId && !art.guesses[p.id])
          .forEach((p, i) => {
            timers.push(
              window.setTimeout(() => {
                const cur = useGame.getState();
                if (cur.artist?.sub !== "guess" || cur.artist.guesses[p.id]) return;
                const opt = cur.artist.options[Math.floor(Math.random() * cur.artist.options.length)];
                if (opt) cur.artistGuess(opt, p.id);
              }, 500 + i * 220),
            );
          });
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

    if (phase === "react" && s.react?.sub === "play") {
      const r = s.react;
      const acc = 0.99;
      s.players
        .filter((p) => p.isBot && !r.hold && !(r.tapped ?? []).includes(p.id))
        .forEach((p, i) => {
          const delay = 120 + i * 40 + Math.random() * Math.min(140, Math.max(80, r.tempo * 0.18));
          timers.push(
            window.setTimeout(() => {
              const cur = useGame.getState();
              if (cur.react?.sub !== "play" || cur.react.hold || cur.react.card !== r.card) return;
              const must = reactMustTap(cur.react);
              const roll = Math.random();
              if (must) {
                if (roll < acc) cur.tapReact(p.id);
              } else if (roll < 0.008) {
                cur.tapReact(p.id);
              }
            }, delay),
          );
        });
    }

    if (phase === "match" && s.match?.sub === "play" && !s.match.lock) {
      const turn = s.players.find((p) => p.id === s.match?.turn);
      if (turn?.isBot) {
        timers.push(
          window.setTimeout(() => {
            const cur = useGame.getState();
            if (cur.match?.turn !== turn.id || cur.match.lock || cur.match.sub !== "play") return;
            const closed = cur.match.tiles
              .map((t, i) => ({ t, i }))
              .filter((x) => !x.t.open && !x.t.matched);
            if (closed.length < 2) return;
            const a = closed[Math.floor(Math.random() * closed.length)]!;
            cur.tapMatch(a.i, turn.id);
            timers.push(
              window.setTimeout(() => {
                const cur2 = useGame.getState();
                if (cur2.match?.turn !== turn.id || cur2.match.sub !== "play") return;
                const closed2 = cur2.match.tiles
                  .map((t, i) => ({ t, i }))
                  .filter((x) => !x.t.open && !x.t.matched);
                if (closed2.length === 0) return;
                const b = closed2[Math.floor(Math.random() * closed2.length)]!;
                cur2.tapMatch(b.i, turn.id);
              }, 420),
            );
          }, 700),
        );
      }
    }

    return () => {
      for (const t of timers) window.clearTimeout(t);
    };
  }, [
    practice,
    phase,
    flipSub,
    flipIndex,
    whoSub,
    whoVoter,
    whoIndex,
    truthSub,
    truthPid,
    neverSub,
    neverIndex,
    artistSub,
    artistIndex,
    reactSub,
    reactCard,
    matchTurn,
    matchLock,
    matchSub,
    matchFound,
  ]);

  useEffect(() => {
    if (isOnline && !isHost) return;
    if (!practice && !isOnline) return;
    if (skillFlash || phase === "skill" || phase === "react") return;
    const s = useGame.getState();
    if (!s.players.some((p) => p.isBot && !p.skillUsed)) return;
    const t = window.setTimeout(() => {
      useGame.getState().runBotSkill();
    }, 900);
    return () => window.clearTimeout(t);
  }, [practice, isOnline, isHost, phase, flipSub, whoSub, truthSub, neverSub, artistSub, matchSub, skillFlash, skillKey, punishKey]);
}
