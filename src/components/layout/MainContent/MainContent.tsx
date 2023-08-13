"use client"
import { useValidexStore } from "@/store/useValidexStore";
import shallow from "zustand/shallow";

export const MainContent = ({
    children
}: {
    children: React.ReactNode
}) => {

    const { activeProject, activeContract } = useValidexStore(
        (state) => ({
            activeProject: state.activeProject,
            activeContract: state.activeContract
        }),
        shallow
    );

    return (<>
        {activeProject && activeContract ? children : <>
            <div className="flex items-center justify-center text-3xl h-full">
                Please select a contract
            </div>
        </>}
    </>)
}