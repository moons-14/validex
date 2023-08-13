import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDownIcon, Pin, PlusIcon, StarIcon } from "lucide-react"

export const CallAndTransact = () => {
    return (<>
        <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8">
                <Tabs defaultValue="all" className="h-full space-y-6">
                    <div className="space-between items-center pb-8 hidden md:flex">
                        <TabsList>
                            <TabsTrigger value="call" className="relative">
                                Call
                            </TabsTrigger>
                            <TabsTrigger value="transact-not-payable">Transact (not payable)</TabsTrigger>
                            <TabsTrigger value="transact-payable" className="text-red-500">
                                Transact (payable)
                            </TabsTrigger>
                            <TabsTrigger value="all">
                                All
                            </TabsTrigger>
                        </TabsList>
                        <div className="ml-auto mr-4">
                            <Input
                                placeholder="Filter transact..."
                                className="h-8 w-full"
                            />
                        </div>
                    </div>
                    <TabsContent
                        value="all"
                        className="border-none p-0 outline-none"
                    >
                        <div className="container mx-auto px-4">

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <CardTitle>ownerOf (uint256)</CardTitle>
                                            <CardDescription>view - not payable - 1arg</CardDescription>
                                        </div>
                                        <div className="w-28">
                                            <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
                                                <Button variant="secondary" className="px-3 shadow-none">
                                                    <Pin className="mr-2 h-4 w-4" />
                                                    Pin
                                                </Button>
                                                <Separator orientation="vertical" className="h-[20px]" />
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="secondary" className="px-2 shadow-none">
                                                            <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        alignOffset={-5}
                                                        className="w-[200px]"
                                                        forceMount
                                                    >
                                                        <DropdownMenuLabel>Suggested Lists</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuCheckboxItem checked>
                                                            Pin(only this contract)
                                                        </DropdownMenuCheckboxItem>
                                                        <DropdownMenuCheckboxItem>Pin(all contract)</DropdownMenuCheckboxItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <form>
                                        <div className="grid w-full items-center gap-4">
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="name">tokenId</Label>
                                                <Input id="name" placeholder="tokenId" />
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button className="w-36">
                                        Call
                                    </Button>
                                </CardFooter>
                            </Card>


                        </div>
                    </TabsContent>
                    <TabsContent
                        value="transact-not-payable"
                        className="border-none p-0 outline-none"
                    >

                    </TabsContent>
                    <TabsContent
                        value="transact-payable"
                        className="border-none p-0 outline-none"
                    >

                    </TabsContent>
                    <TabsContent
                        value="all"
                        className="border-none p-0 outline-none"
                    >

                    </TabsContent>
                </Tabs>
            </div>
        </div>
    </>)
}