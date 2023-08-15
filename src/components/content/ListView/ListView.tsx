import { ScrollArea } from "@/components/ui/scroll-area"
import { Abi } from "../Abi"
import { ByteTool } from "../ByteTool"
import { EthersContent } from "../EthersContent"
import { CallAndTransact } from "../CallAndTransact"

export const ListView = () => {
    return (<>
        <ScrollArea className="h-[calc(100dvh-8rem)]">
            <div className="container mx-auto px-4 my-4">
                <Abi fullButton />
                <ByteTool />
                <EthersContent />
                <CallAndTransact withoutScrollArea />
            </div>
        </ScrollArea>
    </>)
}