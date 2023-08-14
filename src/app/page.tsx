"use client";
import { CallAndTransact, Abi, HomeContent } from "@/components/content";
import { useValidexStore } from "@/store/useValidexStore";
import shallow from "zustand/shallow";

export default function Home() {

  const { activeTab } = useValidexStore(
    (state) => ({
      activeTab: state.projects.find((project) => project.id === state.activeProject)?.contracts.find((tab) => tab.id === state.activeContract)?.activeTab || "abi",
    }),
    shallow
  );

  return (
    <>
      {
        activeTab == "callAndTransact" ? <CallAndTransact /> : null
      }

      {
        activeTab == "abi" ? <Abi /> : null
      }

      {
        activeTab == "home" ? <HomeContent /> : null
      }

    </>
  )
}
