import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export const ContractSettings = () => {
    return (<>
        <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8">
                <div className="space-y-6">
                    <div className="grid w-full gap-1.5">
                        <Label>Contract Abi (optional)</Label>
                        <Textarea placeholder="Type contract Abi" rows={8} />
                    </div>
                    <div className="flex justify-end">
                        <Button className="w-32">
                            Apply
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </>)
}