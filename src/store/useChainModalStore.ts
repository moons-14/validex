import { createWithEqualityFn } from 'zustand/traditional'

export type ChainModalStore = {
    chainModalOpen: boolean
    setChainModalOpen: (chainModalOpen: boolean) => void
}

export const useChainModalStore = createWithEqualityFn<ChainModalStore>((set) => ({
    chainModalOpen: false,
    setChainModalOpen: (chainModalOpen) => set({ chainModalOpen }),
}),
    Object.is
)