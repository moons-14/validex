"use client"
import { useValidexStore } from "@/store/useValidexStore"
import { Terminal } from "lucide-react"
import shallow from "zustand/shallow"

export const BottomBar = () => {

    const { activeContact } = useValidexStore(
        (state) => ({ activeContact: state.activeContact }),
        shallow
    )

    return (<div className="h-10 border-gray-400 border-t flex items-center overflow-x-hidden break-all">
        <button className="px-4">
            <Terminal size={20} />
        </button>
        {
            activeContact ?
                <>
                    <button className="px-2 truncate max-w-[60dvh]">
                        Working contract: {activeContact}
                    </button>
                </> : null
        }

    </div>)
}
