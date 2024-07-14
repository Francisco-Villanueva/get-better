import { CornerDownLeft, Group, Mic, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { IMessage } from "@/types/message.type";
import Message from "./Message";
import { Input } from "../ui/input";
import axios from "axios";

export function Chat({
  socket,
  username,
}: {
  socket: Socket;
  username: string;
}) {
  const [message, setMessage] = useState<IMessage>({
    owner: username,
    message: "",
    time: "",
  });
  const [newMessage, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  // Ref para el contenedor de mensajes
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleMessage = (msg: string) => {
    socket.emit("typing", { message: msg, owner: username });
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    setMessage({
      message: `${msg}`,
      time: formattedTime,
      owner: username,
    });
  };

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    socket.emit("message", message);
    setMessage({ message: "", time: "", owner: username });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get(
        "http://localhost:3001/websocket/messages"
      );

      setMessages(
        response.data.map(({ message, owner, time }: IMessage) => ({
          message,
          owner,
          time,
        }))
      );
    };

    fetchMessages();
    socket.on("serverMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      setIsTyping(false);
    });
    socket.on("ownMessage", (message) => {
      if (message.owner === username) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });
    socket.on("typing", (data) => {
      if (data.owner !== username) {
        setTypingUser(data.owner);
        setIsTyping(data.message.length && true);
        setTimeout(() => setIsTyping(false), 3000); // Mostrar "escribiendo" por 3 segundos
      }
    });

    return () => {
      socket.off("serverMessage");
      socket.off("ownMessage");
      socket.off("typing");
    };
  }, [socket]);

  // Desplazar al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [newMessage]);

  return (
    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 pt-[50px] w-full">
      <div className="absolute top-0 left-0 rounded-t-md w-full bg-accent  h-[50px] flex items-center px-4 gap-2 ">
        <Group />
        <h1 className="text-xl font-medium">Developers</h1>
      </div>
      <div className=" flex flex-col flex-grow items-start text-accent w-full rounded-md mx-auto max-h-full overflow-auto h-full">
        {newMessage.map((msg, index) => (
          <Message key={index} data={msg} socket={socket} username={username} />
        ))}
        {isTyping && (
          <div className="text-black text-sm italic">
            {`Usuario ${typingUser.slice(0, 3)} está escribiendo...`}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-1" />
      <form
        onSubmit={sendMessage}
        className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring pb-3"
        x-chunk="dashboard-03-chunk-1"
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Input
          id="message"
          placeholder="Type your message here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          value={message.message}
          onChange={(e) => handleMessage(e.target.value)}
          autoComplete="off"
        />
        <div className="flex items-center p-3 pt-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" type="button">
                <Paperclip className="size-4" />
                <span className="sr-only">Attach file</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Attach File</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" type="button">
                <Mic className="size-4" />
                <span className="sr-only">Use Microphone</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Use Microphone</TooltipContent>
          </Tooltip>
          <Button
            type="submit"
            size="sm"
            className="ml-auto gap-1.5"
            disabled={message.message.length === 0}
          >
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
