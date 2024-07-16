import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { PropsWithChildren } from "react";
import Notifications from "./Notifications/Notifications";
import { Socket } from "socket.io-client";
interface MainpageProps extends PropsWithChildren {
  socket: Socket;
  username: string;
  handleLogout: () => void;
}
export function Mainpage({
  children,
  socket,
  username,
  handleLogout,
}: MainpageProps) {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-[100vw] ">
      <ResizablePanel defaultSize={12} minSize={12} maxSize={12}>
        <aside className="inset-y   left-0 z-20 flex h-full flex-col border-r  items-center ">
          <div className="border-b p-2 w-full flex justify-center">
            <Button
              variant="outline"
              size="icon"
              aria-label="Home"
              onClick={handleLogout}
            >
              {username?.slice(0, 3).toUpperCase()}
            </Button>
          </div>
          <nav className="flex flex-col items-center w-full p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="Models"
                >
                  <Bot className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Models
              </TooltipContent>
            </Tooltip>
          </nav>
          <nav className="mt-auto grid gap-1 p-2">
            <Notifications socket={socket} />
          </nav>
        </aside>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="flex flex-col flex-grow h-full">
          <main className=" flex-1 gap-4 overflow-auto">{children}</main>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
