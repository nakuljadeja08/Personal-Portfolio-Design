import { Suspense } from "react";
import { ContactCard } from "@/components/ContactCard";
import { Extras } from "@/components/Extras";
import { FixtureList } from "@/components/FixtureList";
import { OffThePitch } from "@/components/OffThePitch";
import { PlayerCard } from "@/components/PlayerCard";
import { Loadout } from "@/components/ProjectCard";
import { Scorebug } from "@/components/Scorebug";
import { Ticker } from "@/components/Ticker";
import { TransferWindow } from "@/components/TransferWindow";
import { TrophyCabinet } from "@/components/TrophyCabinet";
import { tickerItems } from "@/content/profile";
import styles from "./page.module.css";

// Each boundary lets React hydrate that section separately, instead of in one long blocking task.
const belowTheFold = [FixtureList, Loadout, TransferWindow, TrophyCabinet, OffThePitch, ContactCard];

export default function Home() {
  return (
    <>
      <Scorebug />
      <main className={styles.main}>
        <PlayerCard />
        <Ticker items={tickerItems} />
        {/* Keyed by position: a client component's .name is empty here, because the server only holds a reference. */}
        {belowTheFold.map((Section, index) => (
          <Suspense key={index}>
            <Section />
          </Suspense>
        ))}
      </main>
      <Extras />
    </>
  );
}
