import { FileClock, FolderKanban, ScrollText, Search, Share2 } from "lucide-react"

export const SideBar = () => {
    return (<>
        <div className='w-16 h-full border-gray-400 border-r'>
            <button className="px-[1.125rem] py-4 hover:bg-gray-100">
                <FolderKanban size={28} color="#404040" />
            </button>
            <button className="px-[1.125rem] py-4 hover:bg-gray-100">
                <Search size={28} color="#404040" />
            </button>
            <button className="px-[1.125rem] py-4 hover:bg-gray-100">
                <Share2 size={28} color="#404040" />
            </button>
            <button className="px-[1.125rem] py-4 hover:bg-gray-100">
                <FileClock size={28} color="#404040" />
            </button>
            <button className="px-[1.125rem] py-4 hover:bg-gray-100">
                <ScrollText size={28} color="#404040" />
            </button>
        </div>
    </>)
}