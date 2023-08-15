import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useValidexStore } from "@/store/useValidexStore";
import { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export const HomeContent = () => {

    const { toast } = useToast();

    const { contracts, activeContract, activeProject, updateContractName, deleteContract, updateActiveContract } = useValidexStore(
        (state) => ({
            contracts: state.projects.find(
                (project) => project.id === state.activeProject
            )?.contracts.find((contract) => contract.id === state.activeContract),
            activeContract: state.activeContract,
            activeProject: state.activeProject,
            updateContractName: state.updateContractName,
            deleteContract: state.deleteContract,
            updateActiveContract: state.updateActiveContract
        }),
        shallow
    );

    const [contractName, setContractName] = useState(contracts?.name || "");

    const [openRemoveContractModal, setOpenRemoveContractModal] = useState(false);

    const removeContract = () => {
        if (!activeContract || !activeProject) return;
        deleteContract(activeProject, activeContract);
        updateActiveContract(null);
    }

    useEffect(() => {
        setContractName(contracts?.name || "");
    }, [activeContract, activeProject])

    const applySetting = () => {
        if (!activeContract || !activeProject) return;
        if (contractName) {
            updateContractName(activeProject, activeContract, contractName);
            toast({
                title: "Contract name updated",
            });
        } else {
            toast({
                title: "Contract name can't be empty",
            });
        }
    }

    return (<>
        {contracts ?
            <div className="col-span-3">
                <div className="h-full px-4 py-6 lg:px-8">
                    <div className="space-y-6">
                        <div className="grid w-full gap-1.5">
                            <Label>Contract Name</Label>
                            <Input placeholder="Type contract name" value={contractName} onChange={(e) => { setContractName(e.target.value) }} />
                        </div>
                        <div className="flex justify-end">
                            <Button className="w-32" onClick={applySetting}>
                                Apply
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <p className="leading-7 [&:not(:first-child)]:mt-6">
                            Delete a contract from the Project<br></br>
                            <span className="text-yellow-700">
                                Note: No contracts on the blockchain will be affected.
                            </span>
                        </p>
                        <Button variant="destructive" onClick={() => { setOpenRemoveContractModal(true) }}>Remove Contract</Button>
                    </div>
                </div>
            </div>
            : <></>}
        <AlertDialog open={openRemoveContractModal} onOpenChange={setOpenRemoveContractModal}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove Contract</AlertDialogTitle>
                    <AlertDialogDescription>
                        Delete a contract from the Project<br></br>
                        <span className="text-yellow-700">
                            Note: No contracts on the blockchain will be affected.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={removeContract}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>)

}