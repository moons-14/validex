import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type ValidexStore = {
    activeSidePanel: "project" | "search" | "share" | "history" | "docs" | null,
    projects: {
        id: string,
        name: string,
        plan: "free" | "team",
        contacts: {
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
                    type: "call" | "transact",
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
        activeContact: string,
    }[],
    activeProject: string | null,
    activeContact: string | null,
    customizePanel: {}[],
    globalContactPins: {
        id: string,
        functionName: string,
    }[],
    searchWord: string,
}

export const useValidexStore = create(
    persist<ValidexStore>(
        (set, get) => ({
            activeSidePanel: null,
            updateActiveSidePanel: (activeSidePanel: ValidexStore["activeSidePanel"]) => set({ activeSidePanel: activeSidePanel }),
            projects: [],
            activeProject: null,
            activeContact: null,
            customizePanel: [],
            globalContactPins: [],
            searchWord: '',
            addProject: (project: {
                id: string,
                name: string,
                plan: "free" | "team",
            }) => set({
                projects: [...get().projects, {
                    ...project,
                    contacts: [],
                    contractFilter: "",
                    activeContact: "",
                }]
            }),
            deleteProject: (id: string) => set({ projects: get().projects.filter(project => project.id !== id) }),
            updateProjectName: (id: string, name: string) => set({ projects: get().projects.map(project => project.id === id ? { ...project, name: name } : project) }),
            updateProjectPlan: (id: string, plan: "free" | "team") => set({ projects: get().projects.map(project => project.id === id ? { ...project, plan: plan } : project) }),
            updateProjectContractFilter: (id: string, contractFilter: string) => set({ projects: get().projects.map(project => project.id === id ? { ...project, contractFilter: contractFilter } : project) }),
            updateProjectActiveContact: (id: string, activeContact: string) => set({ projects: get().projects.map(project => project.id === id ? { ...project, activeContact: activeContact } : project) }),
            addContact: (projectId: string, contact: {
                id: string,
                address: string,
                name: string,
            }) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: [...project.contacts, {
                        ...contact,
                        activeTab: "abi",
                        callAndTransact: {
                            searchTransact: "",
                            transactFilter: "all",
                            transactList: [],
                        },
                        abi: {
                            abi: "",
                            proxy: false,
                        }
                    }]
                } : project)
            }),
            deleteContact: (projectId: string, id: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: project.contacts.filter(contact => contact.id !== id)
                } : project)
            }),
            updateContactAddress: (projectId: string, id: string, address: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: project.contacts.map(contact => contact.id === id ? { ...contact, address: address } : contact)
                } : project)
            }),
            updateContactName: (projectId: string, id: string, name: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: project.contacts.map(contact => contact.id === id ? { ...contact, name: name } : contact)
                } : project)
            }),
            updateContactActiveTab: (projectId: string, id: string, activeTab: ValidexStore["projects"][0]["contacts"][0]["activeTab"]) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: project.contacts.map(contact => contact.id === id ? { ...contact, activeTab: activeTab } : contact)
                } : project)
            }),
            updateContactSearchTransact: (projectId: string, id: string, searchTransact: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: project.contacts.map(contact => contact.id === id ? {
                        ...contact,
                        callAndTransact: {
                            ...contact.callAndTransact,
                            searchTransact: searchTransact
                        }
                    } : contact)
                } : project)
            }),
            updateContactTransactFilter: (projectId: string, id: string, transactFilter: ValidexStore["projects"][0]["contacts"][0]["callAndTransact"]["transactFilter"]) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: project.contacts.map(contact => contact.id === id ? {
                        ...contact,
                        callAndTransact: {
                            ...contact.callAndTransact,
                            transactFilter: transactFilter
                        }
                    } : contact)
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
                type: "call" | "transact",
                payable: boolean,
                result: string,
                resultError: string,
                pin: boolean,
            }[]) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: project.contacts.map(contact => contact.id === id ? {
                        ...contact,
                        callAndTransact: {
                            ...contact.callAndTransact,
                            transactList: [...contact.callAndTransact.transactList, ...transacts]
                        }
                    } : contact)
                } : project)
            }),
            deleteTransact: (projectId: string, id: string, transactId: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: project.contacts.map(contact => contact.id === id ? {
                        ...contact,
                        callAndTransact: {
                            ...contact.callAndTransact,
                            transactList: contact.callAndTransact.transactList.filter(transact => transact.id !== transactId)
                        }
                    } : contact)
                } : project)
            }),
            updateTransactFunctionName: (projectId: string, id: string, transactId: string, functionName: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: project.contacts.map(contact => contact.id === id ? {
                        ...contact,
                        callAndTransact: {
                            ...contact.callAndTransact,
                            transactList: contact.callAndTransact.transactList.map(transact => transact.id === transactId ? {
                                ...transact,
                                functionName: functionName
                            } : transact)
                        }
                    } : contact)
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
                    contacts: project.contacts.map(contact => contact.id === id ? {
                        ...contact,
                        callAndTransact: {
                            ...contact.callAndTransact,
                            transactList: contact.callAndTransact.transactList.map(transact => transact.id === transactId ? {
                                ...transact,
                                args: args
                            } : transact)
                        }
                    } : contact)
                } : project)
            }),
            updateTransactType: (projectId: string, id: string, transactId: string, type: "call" | "transact") => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: project.contacts.map(contact => contact.id === id ? {
                        ...contact,
                        callAndTransact: {
                            ...contact.callAndTransact,
                            transactList: contact.callAndTransact.transactList.map(transact => transact.id === transactId ? {
                                ...transact,
                                type: type
                            } : transact)
                        }
                    } : contact)
                } : project)
            }),
            updateTransactPayable: (projectId: string, id: string, transactId: string, payable: boolean) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: project.contacts.map(contact => contact.id === id ? {
                        ...contact,
                        callAndTransact: {
                            ...contact.callAndTransact,
                            transactList: contact.callAndTransact.transactList.map(transact => transact.id === transactId ? {
                                ...transact,
                                payable: payable
                            } : transact)
                        }
                    } : contact)
                } : project)
            }),
            updateTransactResult: (projectId: string, id: string, transactId: string, result: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: project.contacts.map(contact => contact.id === id ? {
                        ...contact,
                        callAndTransact: {
                            ...contact.callAndTransact,
                            transactList: contact.callAndTransact.transactList.map(transact => transact.id === transactId ? {
                                ...transact,
                                result: result
                            } : transact)
                        }
                    } : contact)
                } : project)
            }),
            updateTransactResultError: (projectId: string, id: string, transactId: string, resultError: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: project.contacts.map(contact => contact.id === id ? {
                        ...contact,
                        callAndTransact: {
                            ...contact.callAndTransact,
                            transactList: contact.callAndTransact.transactList.map(transact => transact.id === transactId ? {
                                ...transact,
                                resultError: resultError
                            } : transact)
                        }
                    } : contact)
                } : project)
            }),
            updateTransactPin: (projectId: string, id: string, transactId: string, pin: boolean) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: project.contacts.map(contact => contact.id === id ? {
                        ...contact,
                        callAndTransact: {
                            ...contact.callAndTransact,
                            pin: pin,
                        }
                    } : contact)
                } : project)
            }),
            updateAbi: (projectId: string, id: string, abi: string) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: project.contacts.map(contact => contact.id === id ? {
                        ...contact,
                        abi: {
                            ...contact.abi,
                            abi: abi
                        }
                    } : contact)
                } : project)
            }),
            updateUseProxy: (projectId: string, id: string, useProxy: boolean) => set({
                projects: get().projects.map(project => project.id === projectId ? {
                    ...project,
                    contacts: project.contacts.map(contact => contact.id === id ? {
                        ...contact,
                        abi: {
                            ...contact.abi,
                            proxy: useProxy
                        }
                    } : contact)
                } : project)
            }),
            updateActiveProject: (projectId: string) => set({
                activeProject: projectId
            }),
            updateActiveContact: (projectId: string, id: string) => set({
                activeContact: id
            }),
            addGlobalPin: (id: string, functionName: string) => set({
                globalContactPins: [
                    ...get().globalContactPins.filter(pin => pin.id !== id),
                    {
                        id: id,
                        functionName: functionName
                    }
                ]
            }),
            removeGlobalPin: (id: string) => set({
                globalContactPins: get().globalContactPins.filter(pin => pin.id !== id)
            }),
            updateSearchWorld: (searchWord: string) => set({
                searchWord: searchWord
            }),
        }),
        {
            name: 'validex-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
)