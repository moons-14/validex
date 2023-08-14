"use client"
import { Button } from "@/components/ui/button";
import { useValidexStore } from "@/store/useValidexStore";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { ethers } from "ethers";

export const EthersContent = () => {

    const { contract, updateEthersResult, updateEthersError, updateScript, activeContract, activeProject, } = useValidexStore(
        (state) => ({
            contract: state.projects.find(
                (project) => project.id === state.activeProject
            )?.contracts.find((contract) => contract.id === state.activeContract),
            updateEthersResult: state.updateEthersResult,
            updateEthersError: state.updateEthersError,
            updateScript: state.updateScript,
            activeContract: state.activeContract,
            activeProject: state.activeProject,
        }),
        shallow
    );

    const monaco = useMonaco();

    const javascriptCode = `/* already imported ethers for global
inserted Web3Provider as provider to global
inserted Loaded Contract as contract */

const signer = provider.getSigner();
const address = await signer.getAddress();
const balance = await provider.getBalance(address);
console.log(\`\${address} has \${ethers.utils.formatEther(balance)}ETH\`)`;

    const [script, setScript] = useState(javascriptCode);

    useEffect(() => {
        if (!activeProject || !activeContract) return;

        const timer = setTimeout(() => {
            if (activeProject) {
                updateScript(activeProject, activeContract, script)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [script, activeContract])

    useEffect(() => {
        if (!contract) return;
        setScript(contract.ethers.script || javascriptCode);
    }, [contract?.ethers.script]);

    const runScript = async () => {
        if (!window.ethereum) return;
        if (!contract) return;
        if (!activeProject || !activeContract) return;
        // @ts-expect-error
        window.ethers = ethers;
        // @ts-expect-error
        window.provider = new ethers.providers.Web3Provider(window.ethereum);
        // @ts-expect-error
        window.contract = new ethers.Contract(contract.address, contract.abi.abi ? JSON.parse(contract.abi.abi) : [], provider.getSigner());

        const backup = console.log;
        updateEthersError(activeProject, activeContract, "");
        try {
            let resultTmp: string[] = [];
            window.console.log = (any) => {
                resultTmp = [...resultTmp, String(any)];
            };
            await eval(`(async ()=>{${script}})()`);
            updateEthersResult(activeProject, activeContract, resultTmp);
        } catch (e) {
            updateEthersError(activeProject, activeContract, String(e));
        } finally {
            window.console.log = backup;
        }
    };

    return (
        <>
            {
                contract ?
                    <div className="card bg-base-100 gap-4 py-4 shadow-lg">
                        <h2 className="px-4 text-2xl font-bold mb-3">Ethers Playground</h2>
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
                        {contract.ethers.result.length > 0 && (
                            <pre className="mockup-code mx-4 overflow-x-auto pl-2">
                                {contract.ethers.result.map((result, i) => (
                                    <pre data-prefix="$" key={`${i}/${result}`}>
                                        <code>{result}</code>
                                    </pre>
                                ))}
                            </pre>
                        )}
                        {contract.ethers.error && (
                            <div className="text-error text-lg font-bold">Error: {contract.ethers.error}</div>
                        )}
                    </div> : <></>}
        </>
    );
};
