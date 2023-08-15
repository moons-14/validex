"use client"
import { Button } from "@/components/ui/button";
import { useChainModalStore } from "@/store/useChainModalStore";
import { useValidexStore } from "@/store/useValidexStore";
import { ethers } from "ethers";
import { useEffect } from "react";
import shallow from "zustand/shallow";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import clsx from "clsx";

export const MainContent = ({
    children
}: {
    children: React.ReactNode
}) => {


    const { activeProject, activeContract, updateOpenNewTab, project } = useValidexStore(
        (state) => ({
            activeProject: state.activeProject,
            activeContract: state.activeContract,
            updateOpenNewTab: state.updateOpenNewTab,
            project: state.projects.find((project) => project.id === state.activeProject)
        }),
        shallow
    );

    const { chainModalOpen, setChainModalOpen } = useChainModalStore((state) => ({
        chainModalOpen: state.chainModalOpen,
        setChainModalOpen: state.setChainModalOpen
    }), shallow);

    const checkChain = async () => {
        if (!window.ethereum) return;
        if (activeProject && activeContract && project) {
            const contract = project.contracts.find((contract) => contract.id === activeContract);
            if (contract) {
                const activeContractAddress = contract.address;
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const code = await provider.getCode(activeContractAddress);
                if (code && code !== "0x") {
                    setChainModalOpen(false);
                } else {
                    setChainModalOpen(true);
                }
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(checkChain, 2000);
        return () => clearInterval(interval);
    }, [activeProject, activeContract]);

    useEffect(() => {
        if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
            window.ethereum.on("chainChanged", checkChain);
        }

        return () => {
            if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
                window.ethereum.removeListener("chainChanged", checkChain);
            }
        }
    }, []);

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
        <div className={clsx(chainModalOpen ? "fixed top-8 left-0 right-0 flex justify-center" : "hidden")} onClick={() => {
            setChainModalOpen(false);
        }}>
            <div className="bg-yellow-300 p-8 rounded-md cursor-pointer">
                <div className="text-xl">Chain may not be correct</div>
                <div>
                    The contract cannot be identified on the current chain. Please check if the chain is correct.
                </div>
            </div>
        </div>
    </>)
}
