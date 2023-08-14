"use client"
import { Button } from "@/components/ui/button";
import { useValidexStore } from "@/store/useValidexStore";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useState } from "react";
import shallow from "zustand/shallow";

export const EthersContent = () => {

    const { contract } = useValidexStore(
        (state) => ({
            contract: state.projects.find(
                (project) => project.id === state.activeProject
            )?.contracts.find((contract) => contract.id === state.activeContract),
        }),
        shallow
    );

    const monaco = useMonaco();
    // const { contract, contractTag } = useContracts();
    // const { toolData, setScript } = useToolData();
    const [results, setResults] = useState<string[]>([]);
    const [error, setError] = useState("");

    const javascriptCode = `/* already imported ethers for global
inserted Web3Provider as provider to global
inserted Loaded Contract as contract */

const signer = provider.getSigner();
const address = await signer.getAddress();
const balance = await provider.getBalance(address);
console.log(\`\${address} has \${ethers.utils.formatEther(balance)}ETH\`)`;

    const [script, setScript] = useState(javascriptCode);

    const runScript = async () => {
        if (!window.ethereum) return;
        if (!contract) return;

        // @ts-expect-error
        window.ethers = ethers;
        // @ts-expect-error
        window.provider = new ethers.providers.Web3Provider(window.ethereum);
        // @ts-expect-error
        window.contract = new ethers.Contract(contract.address, contract.abi.abi ? JSON.parse(contract.abi.abi) : [], provider.getSigner());

        const backup = console.log;
        setError("");
        try {
            let resultTmp = results;
            window.console.log = (any) => {
                resultTmp = [...resultTmp, String(any)];
            };
            await eval(`(async ()=>{${script}})()`);
            setResults(resultTmp);
        } catch (e) {
            setError(String(e));
        } finally {
            window.console.log = backup;
        }
    };

    return (
        <div className="card bg-base-100 gap-4 py-4 shadow-lg">
            <h2 className="px-4 text-2xl font-bold">Ethers Playground</h2>
            <Editor
                height="60dvh"
                defaultLanguage="javascript"
                path={`files:///${contract?.name || "default"}.js`}
                defaultValue={javascriptCode}
                onChange={(e) => setScript(e || "")}
            />
            <div className="flex justify-end">
                <Button className="mx-4 w-48" onClick={runScript}>
                    Run
                </Button>
            </div>
            {results.length > 0 && (
                <pre className="mockup-code mx-4 overflow-x-auto pl-2">
                    {results.map((result, i) => (
                        <pre data-prefix="$" key={`${i}/${result}`}>
                            <code>{result}</code>
                        </pre>
                    ))}
                </pre>
            )}
            {error && (
                <div className="text-error text-lg font-bold">Error: {error}</div>
            )}
        </div>
    );
};
