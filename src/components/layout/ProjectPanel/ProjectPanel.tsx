"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import ProjectSwitch from "../ProjectSwitch/ProjectSwitch"
import { Button } from "@/components/ui/button"
import { Code2, PlusCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useValidexStore } from "@/store/useValidexStore"
import shallow from "zustand/shallow"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { isAddress } from 'viem'
import { clsx } from "clsx"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { loadAbi } from "@/components/utils/loadAbi"
import { ethers } from "ethers"

export const ProjectPanel = () => {
    const { toast } = useToast()


    const { contracts, activeProject, updateOpenNewTab, addContract, updateProjectContractFilter, updateProjectActiveContract, updateActiveContract } = useValidexStore(
        (state) => ({
            contracts: state.projects.find(
                (project) => project.id === state.activeProject
            ), activeProject: state.activeProject, updateOpenNewTab: state.updateOpenNewTab, addContract: state.addContract, updateProjectContractFilter: state.updateProjectContractFilter, updateProjectActiveContract: state.updateProjectActiveContract, updateActiveContract: state.updateActiveContract
        }),
        shallow
    );
    const [filterContract, setFilterContract] = useState(contracts?.contractFilter || "");
    const [openNewContract, setOpenNewContract] = useState(false);
    const [newContractName, setNewContractName] = useState("");
    const [newContractAddress, setNewContractAddress] = useState("");
    const [newContractAbi, setNewContractAbi] = useState("");
    const [newContractProxy, setNewContractProxy] = useState(false);
    const [loading, setLoading] = useState(false);

    const changeFilterContract = (e: any) => {
        setFilterContract(e.target.value);
    }

    const addContractContinue = async () => {
        if (!window.ethereum) return;
        setLoading(true);
        if (activeProject) {
            if (newContractName && newContractAddress) {
                if (isAddress(newContractAddress)) {
                    const contractId = crypto.randomUUID();
                    if (newContractAbi) {
                        const provider = new ethers.providers.Web3Provider(window.ethereum);
                        const objectAbi = JSON.parse(newContractAbi);
                        const contractData = new ethers.Contract(newContractAddress, objectAbi || [], provider?.getSigner());
                        const functions = Object.entries(contractData.interface.functions);
                        const transacts = functions.map((func) => {
                            const id = crypto.randomUUID();
                            return {
                                id: id,
                                functionName: func[1].name,
                                type: (func[1].stateMutability == "view" ? "call" : "transact") as "call" | "transact",
                                payable: func[1].payable,
                                pin: false,
                                args: func[1].inputs.map((input) => {
                                    return {
                                        id: crypto.randomUUID(),
                                        name: input.name ? input.name : input.type,
                                        type: input.type,
                                        value: "",
                                    }
                                }),
                            }
                        })
                        addContract(activeProject, {
                            id: contractId,
                            name: newContractName,
                            address: newContractAddress,
                            abi: {
                                abi: newContractAbi,
                                proxy: newContractProxy
                            },
                            transacts: transacts
                        });
                    } else {
                        const provider = new ethers.providers.Web3Provider(window.ethereum);
                        const abi = await loadAbi(provider as ethers.providers.Provider, newContractAddress, {
                            backProxy: newContractProxy,
                        });
                        const contractData = new ethers.Contract(newContractAddress, abi || [], provider?.getSigner());
                        const functions = Object.entries(contractData.interface.functions);
                        const transacts = functions.map((func) => {
                            const id = crypto.randomUUID();
                            return {
                                id: id,
                                functionName: func[1].name,
                                type: (func[1].stateMutability == "view" ? "call" : "transact") as "call" | "transact",
                                payable: func[1].payable,
                                pin: false,
                                args: func[1].inputs.map((input) => {
                                    return {
                                        id: crypto.randomUUID(),
                                        name: input.name ? input.name : input.type,
                                        type: input.type,
                                        value: "",
                                    }
                                }),
                            }
                        })
                        addContract(activeProject, {
                            id: contractId,
                            name: newContractName,
                            address: newContractAddress,
                            abi: {
                                abi: abi,
                                proxy: newContractProxy
                            },
                            transacts: transacts
                        })
                    }
                    setLoading(false);
                    setOpenNewContract(false);
                    setNewContractName("");
                    setNewContractAddress("");
                    setNewContractAbi("");
                    setNewContractProxy(false);
                } else {
                    setLoading(false);
                    toast({
                        title: "Invalid contract address.",
                    })
                }
            } else {
                setLoading(false);
                toast({
                    title: "Contract name and address are required.",
                })
            }
        } else {
            toast({
                title: "Please select a project.",
            })
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (activeProject) {
                updateProjectContractFilter(activeProject, filterContract)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [filterContract, activeProject])

    return (<>
        <div className="h-full">
            <div className="px-4 py-4">
                <ProjectSwitch />
            </div>
            {
                activeProject && contracts ?
                    <div className="space-y-4">
                        <div className="py-2">
                            <div className="flex items-center">
                                <div className="relative pl-7 text-lg font-semibold tracking-tight flex-1">
                                    Contracts
                                </div>
                                <div className="mr-3">
                                    <Button variant="ghost" onClick={() => {
                                        setOpenNewContract(true);
                                    }}>
                                        <PlusCircle size={20} />
                                    </Button>
                                </div>
                            </div>
                            <div className="px-4 pt-4 pb-4">
                                <Input
                                    placeholder="Filter contract..."
                                    className="h-8 w-full"
                                    value={filterContract}
                                    onChange={changeFilterContract}
                                />
                            </div>
                            <ScrollArea className="h-[calc(100dvh-20rem)] px-3 ">
                                <div className="space-y-1">
                                    {
                                        contracts.contracts
                                            .filter((contract) => {
                                                return contract.name.toLowerCase().includes(filterContract.toLowerCase()) || contract.address.toLowerCase().includes(filterContract.toLowerCase())
                                            })
                                            .map((contract, index) => {
                                                return (<Button
                                                    variant="ghost"
                                                    className={clsx("w-full justify-start gap-4",
                                                        contract.id === contracts.activeContract ? "bg-gray-100" : "bg-transparent"
                                                    )}
                                                    key={"contracts" + index}
                                                    onClick={() => {
                                                        if (activeProject) {
                                                            updateProjectActiveContract(activeProject, contract.id)
                                                            updateActiveContract(contract.id)
                                                        }
                                                    }}
                                                >
                                                    <Code2 size={20} />
                                                    <div className="truncate break-all overflow-hidden">
                                                        {contract.name ? contract.name : contract.address}
                                                    </div>
                                                </Button>)
                                            })
                                    }
                                </div>
                            </ScrollArea>
                        </div>
                        <Dialog open={openNewContract} onOpenChange={setOpenNewContract}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Contract</DialogTitle>
                                    <DialogDescription>
                                        Add a new contract to the project.
                                    </DialogDescription>
                                </DialogHeader>
                                <div>
                                    <div className="space-y-4 py-2 pb-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Contract name</Label>
                                            <Input id="name" placeholder="World Contract" value={newContractName} onChange={(e) => {
                                                setNewContractName(e.target.value);
                                            }} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Contract address</Label>
                                            <Input id="address" placeholder="0x00" value={newContractAddress} onChange={(e) => {
                                                setNewContractAddress(e.target.value);
                                            }} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="abi">Contract Abi (optional)</Label>
                                            <Textarea id="abi" placeholder="Type contract Abi (optional)" rows={6} value={newContractAbi} onChange={(e) => {
                                                setNewContractAbi(e.target.value);
                                            }} />
                                        </div>
                                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => {
                                            setNewContractProxy(!newContractProxy);
                                        }} >
                                            <Checkbox id="proxy" checked={newContractProxy} />
                                            <label
                                                htmlFor="proxy"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Read beyond the proxy
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => updateOpenNewTab(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" onClick={addContractContinue} disabled={loading}>
                                        {
                                            loading ? "Loading" : "Continue"
                                        }
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    </div>
                    : <>
                        <div className="h-full w-full flex items-center justify-center">
                            <div className="text-center">
                                There is no Project.
                                <Button className="mt-4" onClick={() => {
                                    updateOpenNewTab(true);
                                }}>
                                    Create a new project
                                </Button>
                            </div>
                        </div>
                    </>}
        </div>
    </>)
}