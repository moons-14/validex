import { Terminal } from "lucide-react"

export const BottomBar = () => {
    return (<div className="h-10 border-gray-400 border-t flex items-center overflow-x-hidden break-all">
        <button className="px-4">
            <Terminal size={20} />
        </button>
        <button className="px-2 truncate max-w-[60dvh]">
            Working contract:0x1dED19A2722856B202263D50F86c2476c99DCc2E
        </button>
    </div>)
}