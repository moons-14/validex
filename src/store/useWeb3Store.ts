import { createWithEqualityFn } from 'zustand/traditional'

export type Web3Store = {
    accounts: string[];
    chainId: number | null;
    setAccounts: (accounts: string[]) => void;
    setChainId: (chainId: number) => void;
}

export const useWeb3Store = createWithEqualityFn<Web3Store>((set) => ({
    accounts: [],
    chainId: null,
    setAccounts: (accounts: string[]) => set({ accounts }),
    setChainId: (chainId: number) => set({ chainId }),
}),
    Object.is
)