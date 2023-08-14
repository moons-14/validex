"use client"
import { Button } from "@/components/ui/button";
import { useValidexStore } from "@/store/useValidexStore";
import shallow from "zustand/shallow";

export const MainContent = ({
    children
}: {
    children: React.ReactNode
}) => {

    const { activeProject, activeContract, updateOpenNewTab } = useValidexStore(
        (state) => ({
            activeProject: state.activeProject,
            activeContract: state.activeContract,
            updateOpenNewTab: state.updateOpenNewTab
        }),
        shallow
    );

    return (<>
        {activeProject && activeContract ? children : <>
            <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                    <div className="text-3xl">
                        Please select a contract
                    </div>
                    <div className="text-xl">
                        OR
                    </div>
                    <Button onClick={() => {
                        updateOpenNewTab(true);
                    }}>
                        Create a new project
                    </Button>
                </div>
            </div>
        </>}
    </>)
}