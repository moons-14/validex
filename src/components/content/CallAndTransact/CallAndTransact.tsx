"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ValidexStore, useValidexStore } from "@/store/useValidexStore"
import clsx from "clsx"
import { ethers } from "ethers"
import { CheckCircle, ChevronDownIcon, Pin, PlusIcon, StarIcon, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import shallow from "zustand/shallow"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"
import superjson from 'superjson';

export const CallAndTransact = () => {

    const { contract, activeContract, activeProject, updateContractName, updateContractTransactFilter, updateTransactPin, globalContractPins, updateContractSearchTransact, addGlobalPin, removeGlobalPin, updateTransactResult, updateTransactResultError } = useValidexStore(
        (state) => ({
            contract: state.projects.find(
                (project) => project.id === state.activeProject
            )?.contracts.find((contract) => contract.id === state.activeContract),
            activeContract: state.activeContract,
            activeProject: state.activeProject,
            updateContractName: state.updateContractName,
            updateContractTransactFilter: state.updateContractTransactFilter,
            updateTransactPin: state.updateTransactPin,
            globalContractPins: state.globalContractPins,
            updateContractSearchTransact: state.updateContractSearchTransact,
            addGlobalPin: state.addGlobalPin,
            removeGlobalPin: state.removeGlobalPin,
        }),
        shallow
    );

    const [searchTransact, setSearchTransact] = useState(contract?.callAndTransact.searchTransact || "");

    useEffect(() => {
        if (!activeProject || !activeContract) return;

        const timer = setTimeout(() => {
            if (activeProject) {
                updateContractSearchTransact(activeProject, activeContract, searchTransact)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTransact, activeProject])

    useEffect(() => {
        setSearchTransact(contract?.callAndTransact.searchTransact || "")
    }, [contract?.callAndTransact.searchTransact])

    return (<>
        {contract && activeProject && activeContract ?
            <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                    <Tabs defaultValue="all" className="h-full space-y-6" value={contract.callAndTransact.transactFilter}>
                        <div className="space-between items-center pb-8 hidden md:flex">
                            <TabsList>
                                <TabsTrigger value="call" className="relative" onClick={() => {
                                    updateContractTransactFilter(activeProject, activeContract, "call")
                                }}>
                                    Call
                                </TabsTrigger>
                                <TabsTrigger value="transact-not-payable" onClick={() => {
                                    updateContractTransactFilter(activeProject, activeContract, "transact-not-payable")
                                }}>Transact (not payable)</TabsTrigger>
                                <TabsTrigger value="transact-payable" className="text-red-500" onClick={() => {
                                    updateContractTransactFilter(activeProject, activeContract, "transact-payable")
                                }}>
                                    Transact (payable)
                                </TabsTrigger>
                                <TabsTrigger value="all" onClick={() => {
                                    updateContractTransactFilter(activeProject, activeContract, "all")
                                }}>
                                    All
                                </TabsTrigger>
                            </TabsList>
                            <div className="ml-auto mr-4">
                                <Input
                                    placeholder="Filter transact..."
                                    className="h-8 w-full"
                                    value={searchTransact}
                                    onChange={(e) => setSearchTransact(e.target.value)}
                                />
                            </div>
                        </div>
                        <TabsContent
                            value="call"
                            className="border-none p-0 outline-none"
                        >
                            <div className="container mx-auto px-4">
                                {
                                    contract.callAndTransact.transactList
                                        .filter((transact) => (transact.type == "call"))
                                        .length == 0 ?
                                        <div className="flex items-center justify-center text-3xl h-[calc(100dvh-18rem)]">
                                            transact not found
                                        </div> : <ScrollArea className="h-[calc(100dvh-18rem)] px-3">
                                            {
                                                contract.callAndTransact.transactList
                                                    .filter((transact) => (transact.type == "call"))
                                                    .filter((transact) => transact.pin || globalContractPins.find(pin => pin.functionName == transact.functionName))
                                                    .filter((transact) => searchTransact == "" || transact.functionName.toLowerCase().includes(searchTransact.toLowerCase()))
                                                    .map((transact, index) => {
                                                        return (<TransactCard
                                                            transact={transact}
                                                            updateTransactPin={updateTransactPin}
                                                            activeProject={activeProject}
                                                            activeContract={activeContract}
                                                            key={"transactList" + index}
                                                            globalContractPins={globalContractPins}
                                                            addGlobalPin={addGlobalPin}
                                                            removeGlobalPin={removeGlobalPin}
                                                            contract={contract}
                                                        />)
                                                    })
                                            }
                                            {
                                                contract.callAndTransact.transactList
                                                    .filter((transact) => (transact.type == "call"))
                                                    .filter((transact) => !transact.pin && !globalContractPins.find(pin => pin.functionName == transact.functionName))
                                                    .filter((transact) => searchTransact == "" || transact.functionName.toLowerCase().includes(searchTransact.toLowerCase()))
                                                    .map((transact, index) => {
                                                        return (<TransactCard
                                                            transact={transact}
                                                            updateTransactPin={updateTransactPin}
                                                            activeProject={activeProject}
                                                            activeContract={activeContract}
                                                            key={"transactList" + index}
                                                            globalContractPins={globalContractPins}
                                                            addGlobalPin={addGlobalPin}
                                                            removeGlobalPin={removeGlobalPin}
                                                            contract={contract}
                                                        />)
                                                    })
                                            }
                                        </ScrollArea>
                                }
                            </div>
                        </TabsContent>
                        <TabsContent
                            value="transact-not-payable"
                            className="border-none p-0 outline-none"
                        >
                            <div className="container mx-auto px-4">
                                {
                                    contract.callAndTransact.transactList
                                        .filter((transact) => (!transact.payable && transact.type == "transact"))
                                        .length == 0 ?
                                        <div className="flex items-center justify-center text-3xl h-[calc(100dvh-18rem)]">
                                            transact not found
                                        </div> : <ScrollArea className="h-[calc(100dvh-18rem)] px-3">
                                            {
                                                contract.callAndTransact.transactList
                                                    .filter((transact) => (!transact.payable && transact.type == "transact"))
                                                    .filter((transact) => transact.pin || globalContractPins.find(pin => pin.functionName == transact.functionName))
                                                    .filter((transact) => searchTransact == "" || transact.functionName.toLowerCase().includes(searchTransact.toLowerCase()))
                                                    .map((transact, index) => {
                                                        return (<TransactCard
                                                            transact={transact}
                                                            updateTransactPin={updateTransactPin}
                                                            activeProject={activeProject}
                                                            activeContract={activeContract}
                                                            key={"transactList" + index}
                                                            globalContractPins={globalContractPins}
                                                            addGlobalPin={addGlobalPin}
                                                            removeGlobalPin={removeGlobalPin}
                                                            contract={contract}
                                                        />)
                                                    })
                                            }
                                            {
                                                contract.callAndTransact.transactList
                                                    .filter((transact) => (!transact.payable && transact.type == "transact"))
                                                    .filter((transact) => !transact.pin && !globalContractPins.find(pin => pin.functionName == transact.functionName))
                                                    .filter((transact) => searchTransact == "" || transact.functionName.toLowerCase().includes(searchTransact.toLowerCase()))
                                                    .map((transact, index) => {
                                                        return (<TransactCard
                                                            transact={transact}
                                                            updateTransactPin={updateTransactPin}
                                                            activeProject={activeProject}
                                                            activeContract={activeContract}
                                                            key={"transactList" + index}
                                                            globalContractPins={globalContractPins}
                                                            addGlobalPin={addGlobalPin}
                                                            removeGlobalPin={removeGlobalPin}
                                                            contract={contract}
                                                        />)
                                                    })
                                            }
                                        </ScrollArea>
                                }
                            </div>
                        </TabsContent>
                        <TabsContent
                            value="transact-payable"
                            className="border-none p-0 outline-none"
                        >
                            <div className="container mx-auto px-4">
                                {
                                    contract.callAndTransact.transactList
                                        .filter((transact) => transact.payable)
                                        .length == 0 ?
                                        <div className="flex items-center justify-center text-3xl h-[calc(100dvh-18rem)]">
                                            transact not found
                                        </div> : <ScrollArea className="h-[calc(100dvh-18rem)] px-3">
                                            {
                                                contract.callAndTransact.transactList
                                                    .filter((transact) => transact.payable)
                                                    .filter((transact) => transact.pin || globalContractPins.find(pin => pin.functionName == transact.functionName))
                                                    .filter((transact) => searchTransact == "" || transact.functionName.toLowerCase().includes(searchTransact.toLowerCase()))
                                                    .map((transact, index) => {
                                                        return (<TransactCard
                                                            transact={transact}
                                                            updateTransactPin={updateTransactPin}
                                                            activeProject={activeProject}
                                                            activeContract={activeContract}
                                                            key={"transactList" + index}
                                                            globalContractPins={globalContractPins}
                                                            addGlobalPin={addGlobalPin}
                                                            removeGlobalPin={removeGlobalPin}
                                                            contract={contract}
                                                        />)
                                                    })
                                            }
                                            {
                                                contract.callAndTransact.transactList
                                                    .filter((transact) => transact.payable)
                                                    .filter((transact) => !transact.pin && !globalContractPins.find(pin => pin.functionName == transact.functionName))
                                                    .filter((transact) => searchTransact == "" || transact.functionName.toLowerCase().includes(searchTransact.toLowerCase()))
                                                    .map((transact, index) => {
                                                        return (<TransactCard
                                                            transact={transact}
                                                            updateTransactPin={updateTransactPin}
                                                            activeProject={activeProject}
                                                            activeContract={activeContract}
                                                            key={"transactList" + index}
                                                            globalContractPins={globalContractPins}
                                                            addGlobalPin={addGlobalPin}
                                                            removeGlobalPin={removeGlobalPin}
                                                            contract={contract}
                                                        />)
                                                    })
                                            }
                                        </ScrollArea>
                                }
                            </div>
                        </TabsContent>
                        <TabsContent
                            value="all"
                            className="border-none p-0 outline-none"
                        >
                            <div className="container mx-auto px-4">
                                {
                                    contract.callAndTransact.transactList.length == 0 ?
                                        <div className="flex items-center justify-center text-3xl h-[calc(100dvh-18rem)]">
                                            transact not found
                                        </div> : <ScrollArea className="h-[calc(100dvh-18rem)] px-3">
                                            {
                                                contract.callAndTransact.transactList
                                                    .filter((transact) => transact.pin || globalContractPins.find(pin => pin.functionName == transact.functionName))
                                                    .filter((transact) => searchTransact == "" || transact.functionName.toLowerCase().includes(searchTransact.toLowerCase()))
                                                    .map((transact, index) => {
                                                        return (<TransactCard
                                                            transact={transact}
                                                            updateTransactPin={updateTransactPin}
                                                            activeProject={activeProject}
                                                            activeContract={activeContract}
                                                            key={"transactList" + index}
                                                            globalContractPins={globalContractPins}
                                                            addGlobalPin={addGlobalPin}
                                                            removeGlobalPin={removeGlobalPin}
                                                            contract={contract}
                                                        />)
                                                    })
                                            }
                                            {
                                                contract.callAndTransact.transactList
                                                    .filter((transact) => !transact.pin && !globalContractPins.find(pin => pin.functionName == transact.functionName))
                                                    .filter((transact) => searchTransact == "" || transact.functionName.toLowerCase().includes(searchTransact.toLowerCase()))
                                                    .map((transact, index) => {
                                                        return (<TransactCard
                                                            transact={transact}
                                                            updateTransactPin={updateTransactPin}
                                                            activeProject={activeProject}
                                                            activeContract={activeContract}
                                                            key={"transactList" + index}
                                                            globalContractPins={globalContractPins}
                                                            addGlobalPin={addGlobalPin}
                                                            removeGlobalPin={removeGlobalPin}
                                                            contract={contract}
                                                        />)
                                                    })
                                            }
                                        </ScrollArea>
                                }
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            : <></>}
    </>)
}

const TransactCard = (
    {
        transact,
        updateTransactPin,
        activeProject,
        activeContract,
        globalContractPins,
        addGlobalPin,
        removeGlobalPin,
        contract,
    }: {
        transact: ValidexStore["projects"][0]["contracts"][0]["callAndTransact"]["transactList"][0],
        updateTransactPin: ValidexStore["updateTransactPin"],
        activeProject: string,
        activeContract: string,
        globalContractPins: ValidexStore["globalContractPins"],
        addGlobalPin: ValidexStore["addGlobalPin"],
        removeGlobalPin: ValidexStore["removeGlobalPin"],
        contract: ValidexStore["projects"][0]["contracts"][0],
    }
) => {
    const { toast } = useToast()

    const [result, setResult] = useState<any>("");
    const [resultError, setResultError] = useState<any>("");

    const [resultOpen, setResultOpen] = useState<boolean>(true);
    const [resultErrorOpen, setResultErrorOpen] = useState<boolean>(true);

    const [payValue, setPayValue] = useState<string>("");

    const [value, setValue] = useState<string[]>(transact.args.map(v => v.value));

    const callButton = (contract: ValidexStore["projects"][0]["contracts"][0], transact: ValidexStore["projects"][0]["contracts"][0]["callAndTransact"]["transactList"][0]) => {
        if (transact.type == "transact") return;
        if (!contract) return;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contractProvider = new ethers.Contract(contract.address, contract.abi.abi ? JSON.parse(contract.abi.abi) : [], provider.getSigner());
        contractProvider[transact.functionName](...value)
            .then((result: any) => {
                setResult(JSON.stringify(superjson.serialize(result).json))
                setResultOpen(true)
                setResultError("")
            })
            .catch((error: any) => {
                setResultError(JSON.stringify(superjson.serialize(error).json))
                setResultErrorOpen(true)
                setResult("")
            })
    }

    const runButton = (contract: ValidexStore["projects"][0]["contracts"][0], transact: ValidexStore["projects"][0]["contracts"][0]["callAndTransact"]["transactList"][0]) => {
        if (transact.type == "call") return;
        if (!contract) return;
        if (transact.payable) {
            if (payValue == "") {
                toast({
                    title: "Payable",
                    description: "Payable value is not empty",
                })
                return;
            } else {
                const amountInWei = ethers.utils.parseEther(payValue);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contractProvider = new ethers.Contract(contract.address, contract.abi.abi ? JSON.parse(contract.abi.abi) : [], provider.getSigner());
                const sendValue = value.map((v, i) => {
                    return transact.args[i].type == "bigint" ? ethers.BigNumber.from(v) : v;
                })
                contractProvider[transact.functionName](...sendValue, { value: amountInWei })
                    .then((result: any) => {
                        setResult(result)
                        setResultOpen(true)
                        setResultError("")
                    })
                    .catch((error: any) => {
                        setResultError(error.message)
                        setResultErrorOpen(true)
                        setResult("")
                    })
            }
        } else {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contractProvider = new ethers.Contract(contract.address, contract.abi.abi ? JSON.parse(contract.abi.abi) : [], provider.getSigner());
            const sendValue = value.map((v, i) => {
                if (transact.args[i].type.includes("int")) {
                    try {
                        return ethers.BigNumber.from(v)
                    } catch (e) {
                        setResultError(e.message)
                    }
                }
                return v;
            })
            contractProvider[transact.functionName](...sendValue)
                .then((result: any) => {
                    setResult(result)
                    setResultOpen(true)
                    setResultError("")
                })
                .catch((error: any) => {
                    setResultError(error.message)
                    setResultErrorOpen(true)
                    setResult("")
                })
        }

    }

    return (<Card className="my-4">
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <CardTitle>
                        {transact.functionName}{" "}
                        ({
                            transact.args.map(v => v.name).join(" , ")
                        })</CardTitle>
                    <CardDescription>{transact.type == "call" ? "call" : transact.type == "transact" ? "transact" : "Call or Transact"} - {transact.payable ? "payable" : "not payable"} - {transact.args.length}args</CardDescription>
                </div>
                <div className="w-28">
                    <div className={clsx("flex items-center space-x-1 rounded-md", transact.pin ? "text-primary-foreground bg-primary" : "text-secondary-foreground bg-secondary")}>
                        <Button
                            variant="link"
                            className={clsx("px-3 shadow-none", transact.pin ? "text-primary-foreground" : "text-secondary-foreground")}
                            onClick={() => {
                                updateTransactPin(activeProject, activeContract, transact.id, !transact.pin)
                            }}
                        >
                            <Pin className="mr-2 h-4 w-4" />
                            Pin
                        </Button>
                        <Separator orientation="vertical" className="h-[20px]" />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="link" className="px-2 shadow-none">
                                    <ChevronDownIcon className={clsx("h-4 w-4", transact.pin ? "text-primary-foreground" : "text-secondary-foreground")} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                alignOffset={-5}
                                className="w-[200px]"
                                forceMount
                            >
                                <DropdownMenuLabel>Suggested Lists</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked={transact.pin} onClick={() => {
                                    if (transact.pin) {
                                        removeGlobalPin(globalContractPins.find(pin => pin.functionName == transact.functionName)!.id)
                                    }
                                    updateTransactPin(activeProject, activeContract, transact.id, !transact.pin)
                                }}>
                                    Pin(only this contract)
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={!!globalContractPins.find(pin => pin.functionName == transact.functionName)}
                                    onClick={() => {
                                        if (globalContractPins.find(pin => pin.functionName == transact.functionName)) {
                                            removeGlobalPin(globalContractPins.find(pin => pin.functionName == transact.functionName)!.id)
                                        } else {
                                            addGlobalPin(crypto.randomUUID(), transact.functionName)
                                            updateTransactPin(activeProject, activeContract, transact.id, true)
                                        }
                                    }}
                                >Pin(all contract)</DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">

                {
                    transact.payable ? <>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label>Pay Value</Label>
                                <Input placeholder="Pay Value"
                                    type="number"
                                    value={payValue?.toString() || ""}
                                    onChange={(e) => {
                                        setPayValue(e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                        <Separator />
                    </> : <></>
                }

                {
                    transact.args.map((arg, index) => {
                        return (<div className="grid w-full items-center gap-4" key={"all" + index}>
                            <div className="flex flex-col space-y-1.5">
                                <Label>{arg.name + " (" + arg.type + ")"}</Label>
                                <Input
                                    placeholder={arg.name}
                                    value={value[index] || ""}
                                    onChange={(e) => {
                                        const newValue = [...value]
                                        newValue[index] = e.target.value
                                        setValue(newValue)
                                    }}
                                />
                            </div>
                        </div>)
                    })
                }

            </div>
        </CardContent>
        <CardFooter className="block">
            <div className="flex justify-end w-full">
                {
                    transact.type == "call" ?
                        <Button className="w-36" variant="secondary" onClick={() => {
                            callButton(contract, transact)
                        }}>
                            Call
                        </Button>
                        : transact.type == "transact" ?
                            <Button className="w-36" variant={transact.payable ? "destructive" : "default"} onClick={() => {
                                runButton(contract, transact)
                            }}>
                                Run
                            </Button>
                            : <div className="flex gap-6">
                                <Button className="w-36" variant="secondary" onClick={() => {
                                    callButton(contract, transact)
                                }}>
                                    Call
                                </Button>
                                <Button className="w-36" variant={transact.payable ? "destructive" : "default"} onClick={() => {
                                    runButton(contract, transact)
                                }}>
                                    Run
                                </Button>
                            </div>
                }
            </div><Accordion type="multiple" value={[
                resultOpen ? "result" : "",
                resultErrorOpen ? "resultError" : ""
            ]} >
                {result ? <>

                    <AccordionItem value="result">
                        <AccordionTrigger onClick={() => {
                            setResultOpen(!resultOpen)
                        }}>Result</AccordionTrigger>
                        <AccordionContent className="break-all">
                            {result}
                        </AccordionContent>
                    </AccordionItem>

                </> : <></>
                }
                {resultError ? <>
                    <AccordionItem value="resultError">
                        <AccordionTrigger onClick={() => {
                            setResultErrorOpen(!resultErrorOpen)
                        }}>
                            <span className="text-red-500">
                                Error
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-red-500 break-all">
                            {resultError}
                        </AccordionContent>
                    </AccordionItem>
                </> : <></>
                }
            </Accordion>
        </CardFooter>
    </Card>)
}