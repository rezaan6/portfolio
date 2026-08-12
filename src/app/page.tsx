import { SignalHomeV8 } from "./components/signal-room";

// The years-of-experience figure is derived at render time. Revalidating
// hourly means the number stays correct even if the site isn't redeployed
// for a year — which is exactly the case it exists for.
export const revalidate = 3600;

// Single flagship home. Older portfolio versions and the version switcher were
// removed — this is the one canonical build.
export default function Home() {
  return <SignalHomeV8 />;
}
