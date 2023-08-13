"use client"
import { ValidexStore, useValidexStore } from "@/store/useValidexStore"
import clsx from "clsx"
import { FileClock, FolderKanban, ScrollText, Search, Share2 } from "lucide-react"
import shallow from "zustand/shallow"

const SideBarIcons = [
    {
        icon: <FolderKanban size={24} color="#404040" />,
        id: "project"
    },
    {
        icon: <Search size={24} color="#404040" />,
        id: "search"
    },
    {
        icon: <Share2 size={24} color="#404040" />,
        id: "share"
    },
    {
        icon: <FileClock size={24} color="#404040" />,
        id: "history"
    }
]

export const SideBar = () => {

    const { activeSidePanel, updateActiveSidePanel } = useValidexStore(
        (state) => ({ activeSidePanel: state.activeSidePanel, updateActiveSidePanel: state.updateActiveSidePanel }),
        shallow
    )

    return (<>
        <div className='w-16 h-full border-gray-400 border-r hidden lg:block'>
            {
                SideBarIcons.map((icon, index) => {
                    return (<button border-r
                        className={clsx("px-5 py-4 hover:bg-gray-100",
                            activeSidePanel === icon.id ? "bg-gray-200" : ""
                        )}
                        key={"sidebar-button-" + index}
                        onClick={() => {
                            if (activeSidePanel === icon.id) {
                                updateActiveSidePanel(null)
                            } else {
                                updateActiveSidePanel(icon.id as ValidexStore["activeSidePanel"])
                            }

                        }}
                    >
                        {
                            icon.icon
                        }
                    </button>)
                })
            }
        </div>
    </>)
}