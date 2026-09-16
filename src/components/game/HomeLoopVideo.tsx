import { ART } from "@/game/art";
import { homeLoopSrc } from "@/game/preload";
import { AutoVideo } from "./AutoVideo";

/** 開場只暖快取 mp4 檔，真正解碼留給主選單這一個 video。 */
export function HomeLoopVideo() {
  return <AutoVideo className="home-party-vid" src={homeLoopSrc() || ART.homeLoop} poster={ART.homePoster} loop />;
}
