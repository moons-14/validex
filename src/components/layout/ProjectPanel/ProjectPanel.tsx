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
    const [newContactName, setNewContactName] = useState("");
    const [newContactAddress, setNewContactAddress] = useState("");
    const [newContractAbi, setNewContractAbi] = useState("");
    const [newContractProxy, setNewContractProxy] = useState(false);

    const changeFilterContract = (e: any) => {
        setFilterContract(e.target.value);
    }

    const addContractContinue = () => {
        if (activeProject) {
            if (newContactName && newContactAddress) {
                if (isAddress(newContactAddress)) {
                    addContract(activeProject, {
                        id: crypto.randomUUID(),
                        name: newContactName,
                        address: newContactAddress
                    })
                    setOpenNewContract(false);
                } else {
                    toast({
                        title: "Invalid contract address.",
                    })
                }
            } else {
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
                                    placeholder="Filter contact..."
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
                                                    <div className="truncate break-all">
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
                                            <Input id="name" placeholder="World Contract" value={newContactName} onChange={(e) => {
                                                setNewContactName(e.target.value);
                                            }} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Contract address</Label>
                                            <Input id="address" placeholder="0x00" value={newContactAddress} onChange={(e) => {
                                                setNewContactAddress(e.target.value);
                                            }} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="abi">Contract Abi (optional)</Label>
                                            <Textarea id="abi" placeholder="Type contract Abi (optional)" rows={6} value={newContractAbi} onChange={(e) => {
                                                setNewContractAbi(e.target.value);
                                            }} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Contract address</Label>
                                            <Input id="address" placeholder="0x00" value={newContactAddress} onChange={(e) => {
                                                setNewContactAddress(e.target.value);
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => updateOpenNewTab(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" onClick={addContractContinue}>Continue</Button>
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