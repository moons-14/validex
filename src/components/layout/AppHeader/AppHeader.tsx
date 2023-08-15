"use client"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { copyTextToClipboard } from "@/components/utils/copyTextToClipboard"

export function AppHeader() {
  const copyUrl = () => {
    copyTextToClipboard("https://validex.app/")
  }
  return (
    <Menubar className="rounded-none border-r-[0px] border-l-[0px] border-t-[0px] px-2 lg:px-4 border-gray-400 border-b">
      <MenubarMenu>
        <MenubarTrigger className="font-bold">Validex</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={copyUrl}>Copy URL</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => {
            window.open("https://twitter.com/moons_dev")
          }}>
            Twitter
          </MenubarItem>
          <MenubarSeparator />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}