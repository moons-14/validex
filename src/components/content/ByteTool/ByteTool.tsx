import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { useValidexStore } from "@/store/useValidexStore";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import shallow from "zustand/shallow";

export const ByteTool = () => {

    const { contracts, updateUseProxy, updateAbi, activeContract, activeProject, overrideTransacts } = useValidexStore(
        (state) => ({
            contracts: state.projects.find(
                (project) => project.id === state.activeProject
            )?.contracts.find((contract) => contract.id === state.activeContract),
            updateUseProxy: state.updateUseProxy,
            updateAbi: state.updateAbi,
            activeContract: state.activeContract,
            activeProject: state.activeProject,
            overrideTransacts: state.overrideTransacts,
        }),
        shallow
    );

    const [
        functionAndEvents,
        setFunctionAndEvents,
    ] = useState<{
        name: string;
        type: "function" | "event";
    }[]>([]);
    const [activeFunctionOrEvent, setActiveFunctionOrEvent] = useState<string | null>("");
    const [activeFragment, setActiveFragment] = useState<"FunctionData" | "FunctionResult" | "EventLog" | null>(null);

    const [byteData, setByteData] = useState<string>("");
    const [contractData, setContractData] = useState<ethers.Contract | null>(null);

    useEffect(() => {
        if (contracts) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const objectAbi = JSON.parse(contracts.abi.abi);
            const _contractData = new ethers.Contract(contracts.address, objectAbi || [], provider?.getSigner());
            setContractData(_contractData);
            const functions = Object.entries(_contractData.interface.functions);
            const events = Object.entries(_contractData.interface.events);
            const functionAndEvents = [...functions, ...events].map(([name, type]) => ({
                name,
                type: type.type === "function" ? "function" : "event"
            }));
            setFunctionAndEvents(functionAndEvents as {
                name: string;
                type: "function" | "event";
                fragment: "FunctionData" | "FunctionResult" | "EventLog" | null
            }[]);
        }
    }, [contracts]);

    const [result, setResult] = useState<string>("");
    const [error, setError] = useState<string>("");

    const encodeByteData = () => {
        if (!functionAndEvents.find((func) => func.name == activeFunctionOrEvent as unknown as string)) return;
        const activeFunctionOrEventObject = functionAndEvents.find((func) => func.name == activeFunctionOrEvent as unknown as string) as {
            name: string;
            type: "function" | "event";
        };
        if (!activeFunctionOrEventObject) return;
        if (!activeFunctionOrEvent || !activeFragment) return;
        if (!contractData) return;
        let result = "";
        setError("");
        setResult("");
        try {
            if (activeFragment == "FunctionResult") {
                result = contractData.interface.encodeFunctionResult(
                    activeFunctionOrEventObject.name,
                    JSON.parse(byteData) as never
                )
            } else if (activeFragment == "FunctionData") {
                result = contractData.interface.encodeFunctionData(
                    activeFunctionOrEventObject.name,
                    JSON.parse(byteData) as never
                )
            } else if (activeFragment == "EventLog") {
                result = JSON.stringify(contractData.interface.encodeEventLog(
                    activeFunctionOrEventObject.name,
                    JSON.parse(byteData) as never
                ), null, "\t");
            }
            setResult(result);
        } catch (e) {
            setError(String((e as Error).message) || "Some Error Happen");
            console.error(e);
        }
    };
    const decodeByteData = () => {
        if (!functionAndEvents.find((func) => func.name == activeFunctionOrEvent as unknown as string)) return;
        const activeFunctionOrEventObject = functionAndEvents.find((func) => func.name == activeFunctionOrEvent as unknown as string) as {
            name: string;
            type: "function" | "event";
        };
        if (!activeFunctionOrEventObject) return;
        if (!activeFunctionOrEvent || !activeFragment) return;
        if (!contractData) return;
        let result = "";
        setError("");
        setResult("");
        try {
            if (activeFragment == "FunctionResult") {
                result = JSON.stringify(contractData.interface.decodeFunctionResult(
                    activeFunctionOrEventObject.name,
                    byteData as never
                ), null, "\t");
            } else if (activeFragment == "FunctionData") {
                result = JSON.stringify(contractData.interface.decodeFunctionData(
                    activeFunctionOrEventObject.name,
                    byteData as never
                ), null, "\t");
            } else if (activeFragment == "EventLog") {
                result = JSON.stringify(contractData.interface.decodeEventLog(
                    activeFunctionOrEventObject.name,
                    byteData as never
                ), null, "\t");
            }
            setResult(result);
        } catch (e) {
            setError(String((e as Error).message) || "Some Error Happen");
            console.error(e);
        }
    };

    return (<>
        <div className="w-full p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Byte Data Tool</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Select value={
                        activeFunctionOrEvent ? activeFunctionOrEvent : undefined
                    }
                        onValueChange={(value) => {
                            setActiveFunctionOrEvent(value);
                        }}
                    >
                        <SelectTrigger className="">
                            <SelectValue placeholder="Functions or Events" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                functionAndEvents.map((func) => (
                                    <SelectItem
                                        value={func.name}
                                        key={"byte" + func.name}
                                    >{func.name}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <Select value={
                        activeFragment ? activeFragment : undefined
                    }
                        onValueChange={(value) => {
                            setActiveFragment(value as any);
                        }}
                    >
                        <SelectTrigger className="">
                            <SelectValue placeholder="Fragment" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                activeFunctionOrEvent ?
                                    functionAndEvents.find((func) => func.name == activeFunctionOrEvent)?.type === "function" ? (
                                        <>
                                            <SelectItem value="FunctionData">Function Data</SelectItem>
                                            <SelectItem value="FunctionResult">Function Result</SelectItem>
                                        </>
                                    ) : functionAndEvents.find((func) => func.name == activeFunctionOrEvent)?.type === "event" ? (
                                        <>
                                            <SelectItem value="EventLog">Event Log</SelectItem>
                                        </>
                                    ) : <></>
                                    : <></>
                            }
                        </SelectContent>
                    </Select>
                    <Textarea
                        placeholder="Type byte data"
                        value={byteData}
                        rows={8}
                        onChange={(e) => setByteData(e.target.value)}
                    />
                </CardContent>
                <CardFooter className="block">
                    <div className="flex gap-4 justify-end">
                        <Button className="w-56 max-w-[30%]" variant="secondary" onClick={encodeByteData}>
                            Encode
                        </Button>
                        <Button className="w-56 max-w-[30%]" onClick={decodeByteData}>
                            Decode
                        </Button>
                    </div>
                    <div>
                        {
                            result ? <>
                                <pre>
                                    <code>
                                        {result}
                                    </code>
                                </pre>
                            </> : <></>
                        }
                        {
                            error ? <>
                                <pre>
                                    <code>
                                        {error}
                                    </code>
                                </pre>
                            </> : <></>
                        }
                    </div>
                </CardFooter>
            </Card>
        </div>
    </>)
}