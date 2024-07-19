import { IMessage } from "@/types/message.type";
import { Socket } from "socket.io-client";
const apiUrl = import.meta.env.VITE_API_URL;
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash } from "lucide-react";
import { Button } from "../ui/button";

export default function Message({
  data,
  username,
  handleDeleteMessage,
}: {
  data: IMessage;
  socket: Socket;
  username: string;
  handleDeleteMessage: (id: string) => void;
}) {
  const { message, owner, time, type, _id } = data;

  const isOwner = owner.toLowerCase() === username.toLowerCase();
  // if (!_id) return null;
  return (
    <div
      className={`relative ${
        isOwner ? "bg-primary self-end " : "bg-black/90"
      } p-2 m-2 rounded-md text-secondary flex flex-col items-start text-[16px] max-md:text-[14px] min-w-[250px] max-w-[50%] text-wrap   `}
    >
      <section className="  text-green-200 ">
        <p>{owner}</p>
      </section>

      {isOwner && (
        <div className="absolute right-0 top-1">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="p-0">
                <Button
                  onClick={() => {
                    if (_id) handleDeleteMessage(_id);
                  }}
                  className="flex w-full items-center justify-start gap-2"
                  variant={"ghost"}
                >
                  <Trash className="size-4" />
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {type === "text" && (
        <div className=" max-w-[100%] text-wrap w-full    ">
          <p className="max-w-[100%] ">{message}</p>
        </div>
      )}
      {type === "image" && (
        <div className=" w-full    ">
          <img
            src={`${apiUrl}${message}`}
            alt="img-wechat"
            className="w-full"
          />
        </div>
      )}
      <p className="text-accent/50  w-full text-right text-[11px]  ">{time}</p>
    </div>
  );
}
