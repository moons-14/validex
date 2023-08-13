"use client"
import { useToast } from "@/components/ui/use-toast";
import { copyTextToClipboard } from "@/components/utils/copyTextToClipboard";
import { useWeb3Store } from "@/store/useWeb3Store"
import { UserCircle } from "lucide-react";
import { shallow } from 'zustand/shallow';

export const AddressButton = () => {

    const { accounts } = useWeb3Store(
        (state) => ({ accounts: state.accounts }),
        shallow
    )
    const { toast } = useToast()

    return (<>
        <button className="w-full"
            onClick={() => {
                copyTextToClipboard(accounts[0])
                toast({
                    title: "Copy Address",
                    description: accounts[0],
                })
            }}
        >
            <div className="h-16 border-gray-400 border-t border-r flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <UserCircle size={24} />
                    <div className="text-lg w-44 xl:w-56 break-all truncate">
                        {accounts[0]}
                    </div>
                </div>
            </div>
        </button>
    </>)
}