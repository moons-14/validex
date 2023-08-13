import { UserCircle } from "lucide-react"
import { ProjectPanel } from "../ProjectPanel"

export const SidePanel = () => {
    return (<>
        <div className="h-[calc(100%-4rem)] hidden lg:block border-gray-400 border-r w-64 xl:w-72">
            <ProjectPanel />
            <button className="w-full">
                <div className="h-16 border-gray-400 border-t border-r flex items-center justify-center">
                    <div className="flex items-center gap-3">
                        <UserCircle size={24} />
                        <div className="text-lg w-44 xl:w-56 break-all truncate">
                            0x1dED19A2722856B202263D50F86c2476c99DCc2E
                        </div>
                    </div>
                </div>
            </button>
        </div>
    </>)
}