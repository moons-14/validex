import { ScrollArea } from "@/components/ui/scroll-area"
import ProjectSwitch from "../ProjectSwitch/ProjectSwitch"
import { Button } from "@/components/ui/button"
import { Code2 } from "lucide-react"
import { Input } from "@/components/ui/input"

export const ProjectPanel = () => {
    return (<>
        <div className="h-full w-72 border-gray-400 border-r">
            <div className="px-4 py-4">
                <ProjectSwitch />
            </div>
            <div className="space-y-4">
                <div className="py-2">
                    <h2 className="relative px-7 text-lg font-semibold tracking-tight">
                        Contracts
                    </h2>
                    <div className="px-4 pt-4 pb-2">
                        <Input
                            placeholder="Filter contact..."
                            className="h-8 w-full"
                        />
                    </div>
                    <ScrollArea className="h-[calc(100dvh-20rem)] px-1 ">
                        <div className="space-y-1">
                            <Button variant="ghost" className="w-[16.5rem] justify-start gap-4">
                                <Code2 size={20} />
                                <div className="truncate break-all">
                                    Forwarder
                                </div>
                            </Button>
                            <Button variant="ghost" className="w-[16.5rem] justify-start gap-4">
                                <Code2 size={20} />
                                <div className="truncate break-all">
                                    Recipient
                                </div>
                            </Button>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    </>)
}