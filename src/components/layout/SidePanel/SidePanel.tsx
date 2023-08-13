"use client"
import { ProjectPanel } from "../ProjectPanel"
import { AddressButton } from "../AddressButton"
import { useValidexStore } from "@/store/useValidexStore"
import shallow from "zustand/shallow"
import { SearchPanel } from "../SearchPanel"
import { SharePanel } from "../SharePanel"
import { HistoryPanel } from "../HistoryPanel"

export const SidePanel = () => {

    const { activeSidePanel } = useValidexStore(
        (state) => ({ activeSidePanel: state.activeSidePanel }),
        shallow
    )

    return (<>
        {
            activeSidePanel != null ?
                <div className="h-[calc(100%-4rem)] hidden lg:block border-gray-400 border-r w-64 xl:w-72">

                    {
                        activeSidePanel == "project" ? <ProjectPanel /> : null
                    }

                    {
                        activeSidePanel == "search" ? <SearchPanel /> : null
                    }

                    {
                        activeSidePanel == "share" ? <SharePanel /> : null
                    }

                    {
                        activeSidePanel == "history" ? <HistoryPanel /> : null
                    }

                    <AddressButton />

                </div>
                : null}
    </>)
}