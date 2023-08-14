import { persist, createJSONStorage } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

export type ValidexStore = {
    activeSidePanel: "project" | "search" | "share" | "history" | null,
    projects: {
        id: string,
        name: string,
        contracts: {
            id: string,
            address: string,
            name: string,
            activeTab: "callAndTransact" | "home" | "abi" | "ethers" | "listView" | "customizePanel" | "byteTool",
            callAndTransact: {
                searchTransact: string,
                transactFilter: "call" | "transact-not-payable" | "transact-payable" | "all",
                transactList: {
                    id: string,
                    functionName: string,
                    args: {
                        id: string,
                        name: string,
                        type: string,
                        value: string,
                    }[],
                    type: "call" | "transact" | null,
                    payable: boolean,
                    result: string,
                    resultError: string,
                    pin: boolean,
                }[],
            },
            abi: {
                abi: string,
                proxy: boolean,
            }
        }[],
        contractFilter: string,
        activeContract: string,
    }[],
    activeProject: string | null,
    activeContract: string | null,
    customizePanel: {}[],
    globalContractPins: {
        id: string,
        functionName: string,
    }[],
    searchWord: string,
    openNewTab: boolean,
    updateActiveSidePanel: (activeSidePanel: ValidexStore["activeSidePanel"]) => void,
    addProject: (project: {
        id: string,
        name: string
    }) => void,
    deleteProject: (id: string) => void,
    updateProjectName: (id: string, name: string) => void,
    updateProjectContractFilter: (id: string, contractFilter: string) => void,
    updateProjectActiveContract: (id: string, activeContract: string) => void,
    addContract: (projectId: string, contract: {
        id: string,
        address: string,
        name: string,
        abi: {
            abi: string,
            proxy: boolean,
        },
        transacts: {
            id: string,
            functionName: string,
            args: {
                id: string,
                name: string,
                type: string,
                value: string,
            }[],
            type: "call" | "transact" | null,
            payable: boolean,
            result: string,
            resultError: string,
            pin: boolean,
        }[]
    }) => void,
    deleteContract: (projectId: string, id: string) => void,
    updateContractAddress: (projectId: string, id: string, address: string) => void,
    updateContractName: (projectId: string, id: string, name: string) => void,
    updateContractActiveTab: (projectId: string, id: string, activeTab: ValidexStore["projects"][0]["contracts"][0]["activeTab"]) => void,
    updateContractSearchTransact: (projectId: string, id: string, searchTransact: string) => void,
    updateContractTransactFilter: (projectId: string, id: string, transactFilter: ValidexStore["projects"][0]["contracts"][0]["callAndTransact"]["transactFilter"]) => void,
    addTransacts: (projectId: string, id: string, transacts: {
        id: string,
        functionName: string,
        args: {
            id: string,
            name: string,
            type: string,
            value: string,
        }[],
        type: "call" | "transact" | null,
        payable: boolean,
        result: string,
        resultError: string,
        pin: boolean,
    }[]) => void,
    overrideTransacts: (projectId: string, id: string, transacts: {
        id: string,
        functionName: string,
        args: {
            id: string,
            name: string,
            type: string,
            value: string,
        }[],
        type: "call" | "transact" | null,
        payable: boolean,
        result: string,
        resultError: string,
        pin: boolean,
    }[]) => void,
    deleteTransact: (projectId: string, id: string, transactId: string) => void,
    deleteAllTransact: (projectId: string, id: string) => void,
    updateTransactFunctionName: (projectId: string, id: string, transactId: string, functionName: string) => void,
    updateTransactArgs: (projectId: string, id: string, transactId: string, args: {
        id: string,
        name: string,
        type: string,
        value: string,
    }[]) => void,
    updateTransactType: (projectId: string, id: string, transactId: string, type: "call" | "transact" | null) => void,
    updateTransactPayable: (projectId: string, id: string, transactId: string, payable: boolean) => void,
    updateTransactResult: (projectId: string, id: string, transactId: string, result: string) => void,
    updateTransactResultError: (projectId: string, id: string, transactId: string, resultError: string) => void,
    updateTransactPin: (projectId: string, id: string, transactId: string, pin: boolean) => void,
    updateAbi: (projectId: string, id: string, abi: string) => void,
    updateUseProxy: (projectId: string, id: string, useProxy: boolean) => void,
    updateActiveProject: (projectId: string) => void,
    updateActiveContract: (id: string) => void,
    addGlobalPin: (id: string, functionName: string) => void,
    removeGlobalPin: (id: string) => void,
    updateSearchWorld: (searchWord: string) => void,
    updateOpenNewTab: (openNewTab: boolean) => void,
}

export const useValidexStore = createWithEqualityFn(
    persist<ValidexStore>(
        (set, get) => ({
            activeSidePanel: null,
            updateActiveSidePanel: (activeSidePanel: ValidexStore["activeSidePanel"]) => set({ activeSidePanel: activeSidePanel }),
            projects: [],
            activeProject: null,
            activeContract: null,
            customizePanel: [],
            globalContractPins: [],
            searchWord: '',
            openNewTab: false,
            addProject: (project: {
                id: string,
                name: string,
            }) => set({
                projects: [...get().projects, {
                    ...project,
                    contracts: [],
                    contractFilter: "",
                    activeContract: "",
                }]
            }),
            deleteProject: (id: string) => set({ projects: get().projects.filter(project => project.id !== id) }),
            updateProjectName: (id: string, name: string) => set({ projects: get().projects.map(project => project.id === id ? { ...project, name: name } : project) }),
            updateProjectContractFilter: (id: string, contractFilter: string) => set({ projects: get().projects.map(project => project.id === id ? { ...project, contractFilter: contractFilter } : project) }),
            updateProjectActiveContract: (id: string, activeContract: string) => set({ projects: get().projects.map(project => project.id === id ? { ...project, activeContract: activeContract } : project) }),
            addContract: (projectId: string, contract: {
                id: string,
                address: string,
                name: string,
                abi: {
                    abi: string,
                    proxy: boolean,
                },
                transacts: {
                    id: string,
                    functionName: string,
                    args: {
                        id: string,
                        name: string,
                        type: string,
                        value: string,
                    }[],
                    type: "call" | "transact" | null,
                    payable: boolean,
                    result: string,
                    resultError: string,
                    pin: boolean,
                }[]
            }) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: [...project.contracts, {
                        ...contract,
                        activeTab: "callAndTransact",
                        callAndTransact: {
                            searchTransact: "",
                            transactFilter: "all",
                            transactList: [],
                        },
                        abi: contract.abi,
                        transacts: contract.transacts
                    }]
                } : project)
            }),
            deleteContract: (projectId: string, id: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.filter(contract => contract.id !== id)
                } : project)
            }),
            updateContractAddress: (projectId: string, id: string, address: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? { ...contract, address: address } : contract)
                } : project)
            }),
            updateContractName: (projectId: string, id: string, name: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? { ...contract, name: name } : contract)
                } : project)
            }),
            updateContractActiveTab: (projectId: string, id: string, activeTab: ValidexStore["projects"][0]["contracts"][0]["activeTab"]) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? { ...contract, activeTab: activeTab } : contract)
                } : project)
            }),
            updateContractSearchTransact: (projectId: string, id: string, searchTransact: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? {
                        ...contract,
                        callAndTransact: {
                            ...contract.callAndTransact,
                            searchTransact: searchTransact
                        }
                    } : contract)
                } : project)
            }),
            updateContractTransactFilter: (projectId: string, id: string, transactFilter: ValidexStore["projects"][0]["contracts"][0]["callAndTransact"]["transactFilter"]) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? {
                        ...contract,
                        callAndTransact: {
                            ...contract.callAndTransact,
                            transactFilter: transactFilter
                        }
                    } : contract)
                } : project)
            }),
            addTransacts: (projectId: string, id: string, transacts: {
                id: string,
                functionName: string,
                args: {
                    id: string,
                    name: string,
                    type: string,
                    value: string,
                }[],
                type: "call" | "transact" | null,
                payable: boolean,
                result: string,
                resultError: string,
                pin: boolean,
            }[]) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? {
                        ...contract,
                        callAndTransact: {
                            ...contract.callAndTransact,
                            transactList: [...contract.callAndTransact.transactList, ...transacts]
                        }
                    } : contract)
                } : project)
            }),
            overrideTransacts: (projectId: string, id: string, transacts: {
                id: string,
                functionName: string,
                args: {
                    id: string,
                    name: string,
                    type: string,
                    value: string,
                }[],
                type: "call" | "transact" | null,
                payable: boolean,
                result: string,
                resultError: string,
                pin: boolean,
            }[]) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? {
                        ...contract,
                        callAndTransact: {
                            ...contract.callAndTransact,
                            transactList: [...transacts]
                        }
                    } : contract)
                } : project)
            }),
            deleteTransact: (projectId: string, id: string, transactId: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? {
                        ...contract,
                        callAndTransact: {
                            ...contract.callAndTransact,
                            transactList: contract.callAndTransact.transactList.filter(transact => transact.id !== transactId)
                        }
                    } : contract)
                } : project)
            }),
            deleteAllTransact: (projectId: string, id: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? {
                        ...contract,
                        callAndTransact: {
                            ...contract.callAndTransact,
                            transactList: []
                        }
                    } : contract)
                } : project)
            }),
            updateTransactFunctionName: (projectId: string, id: string, transactId: string, functionName: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? {
                        ...contract,
                        callAndTransact: {
                            ...contract.callAndTransact,
                            transactList: contract.callAndTransact.transactList.map(transact => transact.id === transactId ? {
                                ...transact,
                                functionName: functionName
                            } : transact)
                        }
                    } : contract)
                } : project)
            }),
            updateTransactArgs: (projectId: string, id: string, transactId: string, args: {
                id: string,
                name: string,
                type: string,
                value: string,
            }[]) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? {
                        ...contract,
                        callAndTransact: {
                            ...contract.callAndTransact,
                            transactList: contract.callAndTransact.transactList.map(transact => transact.id === transactId ? {
                                ...transact,
                                args: args
                            } : transact)
                        }
                    } : contract)
                } : project)
            }),
            updateTransactType: (projectId: string, id: string, transactId: string, type: "call" | "transact" | null) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? {
                        ...contract,
                        callAndTransact: {
                            ...contract.callAndTransact,
                            transactList: contract.callAndTransact.transactList.map(transact => transact.id === transactId ? {
                                ...transact,
                                type: type
                            } : transact)
                        }
                    } : contract)
                } : project)
            }),
            updateTransactPayable: (projectId: string, id: string, transactId: string, payable: boolean) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? {
                        ...contract,
                        callAndTransact: {
                            ...contract.callAndTransact,
                            transactList: contract.callAndTransact.transactList.map(transact => transact.id === transactId ? {
                                ...transact,
                                payable: payable
                            } : transact)
                        }
                    } : contract)
                } : project)
            }),
            updateTransactResult: (projectId: string, id: string, transactId: string, result: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? {
                        ...contract,
                        callAndTransact: {
                            ...contract.callAndTransact,
                            transactList: contract.callAndTransact.transactList.map(transact => transact.id === transactId ? {
                                ...transact,
                                result: result
                            } : transact)
                        }
                    } : contract)
                } : project)
            }),
            updateTransactResultError: (projectId: string, id: string, transactId: string, resultError: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? {
                        ...contract,
                        callAndTransact: {
                            ...contract.callAndTransact,
                            transactList: contract.callAndTransact.transactList.map(transact => transact.id === transactId ? {
                                ...transact,
                                resultError: resultError
                            } : transact)
                        }
                    } : contract)
                } : project)
            }),
            updateTransactPin: (projectId: string, id: string, transactId: string, pin: boolean) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? {
                        ...contract,
                        callAndTransact: {
                            ...contract.callAndTransact,
                            transactList: contract.callAndTransact.transactList.map(transact => transact.id === transactId ? {
                                ...transact,
                                pin: pin
                            } : transact)
                        }
                    } : contract)
                } : project)
            }),
            updateAbi: (projectId: string, id: string, abi: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? {
                        ...contract,
                        abi: {
                            ...contract.abi,
                            abi: abi
                        }
                    } : contract)
                } : project)
            }),
            updateUseProxy: (projectId: string, id: string, useProxy: boolean) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contracts: project.contracts.map(contract => contract.id === id ? {
                        ...contract,
                        abi: {
                            ...contract.abi,
                            proxy: useProxy
                        }
                    } : contract)
                } : project)
            }),
            updateActiveProject: (projectId: string) => set({
                activeProject: projectId
            }),
            updateActiveContract: (id: string) => set({
                activeContract: id
            }),
            addGlobalPin: (id: string, functionName: string) => set({
                globalContractPins: [
                    ...get().globalContractPins.filter(pin => pin.id !== id),
                    {
                        id: id,
                        functionName: functionName
                    }
                ]
            }),
            removeGlobalPin: (id: string) => set({
                globalContractPins: get().globalContractPins.filter(pin => pin.id !== id)
            }),
            updateSearchWorld: (searchWord: string) => set({
                searchWord: searchWord
            }),
            updateOpenNewTab: (openNewTab: boolean) => set({
                openNewTab: openNewTab
            }),
        }),
        {
            name: 'validex-storage',
            storage: createJSONStorage(() => localStorage)
        }
    ),
    Object.is
)