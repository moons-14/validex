"use client"
import { useToast } from "@/components/ui/use-toast"
import { copyTextToClipboard } from "@/components/utils/copyTextToClipboard"
import { useValidexStore } from "@/store/useValidexStore"
import { Terminal } from "lucide-react"
import shallow from "zustand/shallow"

export const BottomBar = () => {
    const { toast } = useToast()

    const { activeContract } = useValidexStore(
        (state) => ({
            activeContract: state.projects.find(
                (project) => project.id === state.activeProject
            )?.contracts.find((contract) => contract.id === state.activeContract)?.address ?? null
        }),
        shallow
    )

    return (<div className="h-10 border-gray-400 border-t flex items-center overflow-x-hidden break-all">
        <button className="px-4">
            <Terminal size={20} />
        </button>
        {
            activeContract ?
                <>
                    <button className="px-2 truncate max-w-[60dvh]" onClick={() => {
                        copyTextToClipboard(activeContract)
                        toast({
                            title: "Copy Contract Address",
                            description: activeContract,
                        })
                    }}>
                        Working contract: {activeContract}
                    </button>
                </> : null
        }

    </div >)
}
