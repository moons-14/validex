"use client"

import * as React from "react"
import {
    ChevronsUpDown,
    CheckIcon,
    PlusCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useValidexStore } from "@/store/useValidexStore"
import shallow from "zustand/shallow"
import { useToast } from "@/components/ui/use-toast"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface ProjectSwitchProps extends PopoverTriggerProps { }

export default function ProjectSwitch({ className }: ProjectSwitchProps) {
    const { toast } = useToast()

    const [open, setOpen] = React.useState(false);
    const [newProjectName, setNewProjectName] = React.useState("");
    const { projects, activeProject, updateActiveProject, openNewTab, updateOpenNewTab, addProject } = useValidexStore(
        (state) => ({
            projects: state.projects, activeProject: state.activeProject, updateActiveProject: state.updateActiveProject, openNewTab: state.openNewTab, updateOpenNewTab: state.updateOpenNewTab, addProject: state.addProject
        }),
        shallow
    );

    const createProject = () => {
        if (newProjectName) {
            const projectUUID = crypto.randomUUID();
            addProject({
                id: projectUUID,
                name: newProjectName,
            })
            updateActiveProject(projectUUID)
            updateOpenNewTab(false)
        } else {
            toast({
                title: "Please enter a project name",
            })
        }
    }

    return (
        <Dialog open={openNewTab} onOpenChange={updateOpenNewTab}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Select a project"
                        className={cn("w-56 xl:w-64 justify-between", className)}
                    >
                        {
                            activeProject ? projects.find(p => p.id === activeProject)?.name : "Select a project"
                        }
                        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 xl:w-64 p-0">
                    <Command>
                        <CommandList>
                            <CommandInput placeholder="Search project..." />
                            <CommandEmpty>No project found.</CommandEmpty>
                            {projects.map((project) => (
                                <CommandItem
                                    key={project.id}
                                    onSelect={() => {
                                        updateActiveProject(project.id)
                                        setOpen(false)
                                    }}
                                    className="text-sm"
                                >
                                    {project.name}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            activeProject === project.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandList>
                        <CommandSeparator />
                        <CommandList>
                            <CommandGroup>
                                <DialogTrigger asChild>
                                    <CommandItem
                                        onSelect={() => {
                                            setOpen(false)
                                            updateOpenNewTab(true)
                                        }}
                                    >
                                        <PlusCircle className="mr-2 h-5 w-5" />
                                        Create Project
                                    </CommandItem>
                                </DialogTrigger>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create project</DialogTitle>
                    <DialogDescription>
                        Create a project that brings together multiple contract tests.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className="space-y-4 py-2 pb-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Project name</Label>
                            <Input id="name" placeholder="World Contract" value={newProjectName} onChange={(e) => {
                                setNewProjectName(e.target.value)
                            }} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => updateOpenNewTab(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={createProject}>Continue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}