import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bell, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import sound from "/sounds/notification.mp3";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { IMessage } from "@/types/message.type";
const audio = new Audio(sound);
interface NotificationsProps {
  socket: Socket;
}
export default function Notifications({ socket }: NotificationsProps) {
  const [notifications, setNotifications] = useState(0);
  const { toast } = useToast();
  const playNotificationSound = () => {
    audio.play();
  };
  useEffect(() => {
    socket.on("serverMessage", (message: IMessage) => {
      toast({
        title: message.owner,
        description: message.message,
        action: (
          <Button variant={"secondary"}>
            <MessageCircle size={10} />
          </Button>
        ),
      });
      setNotifications((s) => s + 1);
      playNotificationSound();
    });

    return () => {
      socket.off("serverMessage");
    };
  }, [socket]);
  const navigate = useNavigate();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="mt-auto rounded-lg relative"
          aria-label="Account"
          onClick={() => navigate("/")}
        >
          <Bell className="size-5" />
          {notifications > 0 && (
            <Badge className="absolute top-[-2px] right-[-2px] size-3 p-2 flex justify-center items-center text-center  ">
              {notifications}
            </Badge>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        {socket.id}
      </TooltipContent>
    </Tooltip>
  );
}
