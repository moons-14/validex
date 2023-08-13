"use client"
import { useWeb3Store } from "@/store/useWeb3Store";
import { useEffect, useState } from "react"
import 'viem/window';

export const Web3Provider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [mounted, setMounted] = useState(false);
    const [noInstallMetaMask, setNoInstallMetaMask] = useState(false);
    const [connectWalletError, setConnectWalletError] = useState<string | null>(null);
    const {
        setAccounts,
        setChainId,
    } = useWeb3Store();

    const accountChange = (accountNo: string[]) => {
        setAccounts(accountNo)
    }

    const chainChange = (chainId: string) => {
        setChainId(parseInt(chainId))
    }

    useEffect(() => {

        if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(async (accounts: any) => {
                    setAccounts(accounts)
                    window.ethereum.request({ method: 'eth_chainId' })
                        .then((hexChainId: string) => {
                            setChainId(parseInt(hexChainId))
                            if (accounts.length > 0 && parseInt(hexChainId)) {
                                setMounted(true)
                            }
                        })
                        .catch((err: any) => {
                            setConnectWalletError(err.message)
                        })
                })
                .catch((err: any) => {
                    setConnectWalletError(err.message)
                })
            window.ethereum.on("accountsChanged", accountChange);
            window.ethereum.on("chainChanged", chainChange);
        } else {
            setNoInstallMetaMask(true);
        }

        return () => {
            window.ethereum.removeListener("accountsChanged", accountChange);
            window.ethereum.removeListener("chainChanged", chainChange);
        }
    }, []);

    return (
        <>
            {
                mounted ? children : ""
            }
            {
                noInstallMetaMask && !mounted ? <div className="text-4xl flex items-center justify-center h-[100dvh]">
                    <div>
                        Please Install <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="text-blue-500">MetaMask</a>
                    </div>
                </div> : ""
            }
            {
                connectWalletError && !mounted ? <div className="text-lg break-all flex items-center justify-center h-[100dvh]">
                    <div>
                        {connectWalletError}
                    </div>
                </div> : ""
            }
        </>
    )
}