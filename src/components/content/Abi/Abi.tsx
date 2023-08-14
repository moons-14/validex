"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { loadAbi } from "@/components/utils/loadAbi"
import { useValidexStore } from "@/store/useValidexStore"
import { useEffect, useState } from "react"
import shallow from "zustand/shallow"

export const Abi = () => {

    const { toast } = useToast();

    const { contracts, updateUseProxy, updateAbi, activeContract, activeProject } = useValidexStore(
        (state) => ({
            contracts: state.projects.find(
                (project) => project.id === state.activeProject
            )?.contracts.find((contract) => contract.id === state.activeContract),
            updateUseProxy: state.updateUseProxy,
            updateAbi: state.updateAbi,
            activeContract: state.activeContract,
            activeProject: state.activeProject
        }),
        shallow
    );

    const [abi, setAbi] = useState(contracts?.abi.abi || "");
    const [proxy, setProxy] = useState(contracts?.abi.proxy || false);

    useEffect(() => {
        setAbi(contracts?.abi.abi || "");
        setProxy(contracts?.abi.proxy || false);
    }, [activeContract, activeProject])

    const applyAbi = async () => {
        if (!activeProject || !activeContract) return;
        if (abi) {
            //abiを適用する
            updateAbi(activeProject, activeContract, abi);
        } else {
            if (proxy) {
                //proxy設定無しでabiを推測する
            } else {
                //proxy設定無しでabiを推測する
            }
        }
        updateUseProxy(activeProject, activeContract, proxy);
        toast({
            title: "Updated ABI settings.",
        })
    }

    return (<>
        {contracts ?
            <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                    <div className="space-y-6">
                        <div className="grid w-full gap-1.5">
                            <Label>Contract Abi (optional)</Label>
                            <Textarea placeholder="Type contract Abi (optional)" rows={8} value={abi} onChange={(e) => { setAbi(e.target.value) }} />
                        </div>
                        <div className="items-top flex space-x-2 cursor-pointer"
                            onClick={() => {
                                setProxy(!proxy);
                            }}
                        >
                            <Checkbox checked={proxy} />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Read beyond the proxy
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    Compensate for the ABI of the contract beyond the proxy
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button className="w-32" onClick={applyAbi}>
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            : <></>}
    </>)
}