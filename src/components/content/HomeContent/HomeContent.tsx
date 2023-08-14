import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useValidexStore } from "@/store/useValidexStore";
import { useEffect, useState } from "react";
import shallow from "zustand/shallow";

export const HomeContent = () => {

    const { toast } = useToast();

    const { contracts, activeContract, activeProject, updateContractName } = useValidexStore(
        (state) => ({
            contracts: state.projects.find(
                (project) => project.id === state.activeProject
            )?.contracts.find((contract) => contract.id === state.activeContract),
            activeContract: state.activeContract,
            activeProject: state.activeProject,
            updateContractName: state.updateContractName
        }),
        shallow
    );

    const [contractName, setContractName] = useState(contracts?.name || "");

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
            <div className="col-span-3 lg:col-span-4 lg:border-l">
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
                </div>
            </div>
            : <></>}
    </>)

}