/** Sticker portraits + animation frames for 公司酒局 */

export function asset(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${path.replace(/^\//, "")}`;
}

export const ROLE_ART: Record<string, string> = {
  ceo: asset("/art/roles/ceo.png"),
  manager: asset("/art/roles/manager.png"),
  worker: asset("/art/roles/worker.png"),
  intern: asset("/art/roles/intern.png"),
  sales: asset("/art/roles/sales.png"),
  hr: asset("/art/roles/hr.png"),
  accountant: asset("/art/roles/accountant.png"),
  engineer: asset("/art/roles/engineer.png"),
  overtime: asset("/art/roles/overtime.png"),
};

export const ART = {
  internIdle: [
    asset("/art/mascot/idle-1.png"),
    asset("/art/mascot/idle-2.png"),
    asset("/art/mascot/idle-3.png"),
    asset("/art/mascot/idle-4.png"),
  ],
  spray: [asset("/art/fx/fx-1.png"), asset("/art/fx/fx-2.png"), asset("/art/fx/fx-3.png"), asset("/art/fx/fx-4.png")],
  cardBack: asset("/art/ui/card-back.png"),
  logo: asset("/art/ui/logo.jpg"),
  homeScene: asset("/art/ui/home-scene.jpg"),
  homePoster: asset("/art/ui/home-poster.jpg"),
  homeFreeze: asset("/art/ui/home-ui-freeze.webp"),
  homeLoop: asset("/art/ui/home-loop.mp4"),
  studioSprite: asset("/art/ui/studio-sprite.jpg"),
  homePartySprite: asset("/art/ui/home-party-sprite.jpg"),
  studioIntro: asset("/art/ui/studio-intro.mp4"),
  studioSting: asset("/art/ui/studio-sting.json"),
  catWalk: asset("/art/ui/cat-walk.json"),
  loadCat: asset("/art/ui/load-cat.png"),
  catsPoster: asset("/art/ui/cats-poster.jpg"),
  modesPoster: asset("/art/ui/modes-poster.jpg"),
};

export const STUDIO_FRAMES: string[] = Array.from({ length: 18 }, (_, i) => asset(`/art/ui/studio/f${String(i + 1).padStart(2, "0")}.jpg`));
export const HOME_IDLE: string[] = Array.from({ length: 24 }, (_, i) => asset(`/art/ui/home-idle/f${String(i + 1).padStart(2, "0")}.jpg`));

export function roleArt(roleId: string): string {
  return ROLE_ART[roleId] ?? ROLE_ART.worker!;
}
