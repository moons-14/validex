import { UserCircle } from "lucide-react"
import { ProjectPanel } from "../ProjectPanel"
import { AddressButton } from "../AddressButton"

export const SidePanel = () => {
    return (<>
        <div className="h-[calc(100%-4rem)] hidden lg:block border-gray-400 border-r w-64 xl:w-72">
            <ProjectPanel />
            <AddressButton />
        </div>
    </>)
}