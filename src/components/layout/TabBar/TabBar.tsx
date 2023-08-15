"use client"
import { ValidexStore, useValidexStore } from "@/store/useValidexStore";
import clsx from "clsx";
import { Code, Cpu, Home, LayoutDashboard, LayoutPanelLeft, ListVideo, PencilRuler, Play, Settings } from "lucide-react"
import shallow from "zustand/shallow";

export const TabBar = () => {

    const { activeProject, activeContract, activeTab, updateContractActiveTab } = useValidexStore(
        (state) => ({
            activeProject: state.activeProject,
            activeContract: state.activeContract,
            activeTab: state.projects.find((project) => project.id === state.activeProject)?.contracts.find((tab) => tab.id === state.activeContract)?.activeTab || "abi",
            updateContractActiveTab: state.updateContractActiveTab
        }),
        shallow
    );

    const tabContents = [
        {
            icon: <Home size={16} />,
            name: "Home",
            id: "home"
        },
        {
            icon: <Settings size={16} />,
            name: "Abi",
            id: "abi"
        },
        {
            icon: <Play size={16} />,
            name: "Call and Transact",
            id: "callAndTransact"
        },
        {
            icon: <Code size={16} />,
            name: "Ethers",
            id: "ethers"
        },
        {
            icon: <PencilRuler size={16} />,
            name: "Byte Tool",
            id: "byteTool"
        },
        {
            icon: <ListVideo size={16} />,
            name: "List view",
            id: "listView"
        },
    ]

    return (<>
        {activeProject && activeContract ?
            <div className="w-full lg:w-[calc(100dvw-20rem)] xl:w-[calc(100dvw-22rem)] h-12 border-gray-400 border-b hidden lg:flex scroll-bar-hide overflow-x-scroll">
                {
                    tabContents.map((tabContent, index) => {
                        return (<button
                            className={clsx("flex gap-2 items-center px-8 border-gray-400 border-r hover:bg-gray-200 shrink-0",
                                activeTab === tabContent.id ? "bg-gray-200" : "bg-white"
                            )}
                            key={"tab-" + index}
                            onClick={() => {
                                updateContractActiveTab(activeProject, activeContract, tabContent.id as ValidexStore["projects"][0]["contracts"][0]["activeTab"])
                            }}
                        >
                            {tabContent.icon}
                            {tabContent.name}
                        </button>)
                    })
                }
            </div>
            : <></>}
    </>)
}