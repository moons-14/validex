import { FileClock, FolderKanban, ScrollText, Search, Share2 } from "lucide-react"

export const SideBar = () => {
    return (<>
        <div className='w-16 h-full border-gray-400 border-r hidden lg:block'>
            <button className="px-5 py-4 hover:bg-gray-100">
                <FolderKanban size={24} color="#404040" />
            </button>
            <button className="px-5 py-4 hover:bg-gray-100">
                <Search size={24} color="#404040" />
            </button>
            <button className="px-5 py-4 hover:bg-gray-100">
                <Share2 size={24} color="#404040" />
            </button>
            <button className="px-5 py-4 hover:bg-gray-100">
                <FileClock size={24} color="#404040" />
            </button>
            <button className="px-5 py-4 hover:bg-gray-100">
                <ScrollText size={24} color="#404040" />
            </button>
        </div>
    </>)
}