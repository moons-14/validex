import { Code, Cpu, Home, LayoutDashboard, LayoutPanelLeft, ListVideo, Play, Settings } from "lucide-react"

export const TabBar = () => {
    return (<>
        <div className="w-full lg:w-[calc(100dvw-20rem)] xl:w-[calc(100dvw-22rem)] h-12 border-gray-400 border-b hidden lg:flex scroll-bar-hide overflow-x-scroll">
            <button className="flex gap-2 items-center px-8 border-gray-400 border-r hover:bg-gray-200 shrink-0">
                <Home size={16} />
                Home
            </button>
            <button className="flex gap-2 items-center px-8 border-gray-400 border-r hover:bg-gray-200 shrink-0">
                <Settings size={16} />
                Setting
            </button>
            <button className="flex gap-2 items-center px-8 border-gray-400 border-r hover:bg-gray-200 shrink-0">
                <Play size={16} />
                Call and Transact
            </button>
            <button className="flex gap-2 items-center px-8 border-gray-400 border-r hover:bg-gray-200 shrink-0">
                <Code size={16} />
                Ethers
            </button>
            <button className="flex gap-2 items-center px-8 border-gray-400 border-r hover:bg-gray-200 shrink-0">
                <ListVideo size={16} />
                List view
            </button>
            <button className="flex gap-2 items-center px-8 border-gray-400 border-r hover:bg-gray-200 shrink-0">
                <LayoutDashboard size={16} />
                Customize Panel
            </button>
        </div>
    </>)
}