import { createFileRoute } from "@tanstack/react-router";
import { GameApp } from "@/components/game/GameApp";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>) => ({
    room: typeof s.room === "string" ? s.room : undefined,
  }),
  component: Home,
});

function Home() {
  const { room } = Route.useSearch();
  return <GameApp presetRoom={room} />;
}
