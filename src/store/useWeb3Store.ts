import { create } from "zustand";

export const useWeb3Store = create<{
    accounts: string[];
    chainId: number | null;
    setAccounts: (accounts: string[]) => void;
    setChainId: (chainId: number) => void;
}>((set) => ({
    accounts: [],
    chainId: null,
    setAccounts: (accounts: string[]) => set({ accounts }),
    setChainId: (chainId: number) => set({ chainId }),
}))