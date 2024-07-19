import { Group, LogOut, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { IMessage } from "@/types/message.type";
import Message from "./Message";
import { Input } from "../ui/input";
import axios from "axios";
import UploadImage from "../Upload/UploadImage";
const apiUrl = import.meta.env.VITE_API_URL;
export function Chat({
  socket,
  username,
}: {
  socket: Socket;
  username: string;
}) {
  const [codeRoom, setRoomCode] = useState<string>("");
  const [joinedRoom, setJoinedRoom] = useState<boolean>(false);
  const INITIAL_MESSAGE: IMessage = {
    owner: username,
    message: "",
    time: "",
    type: "text",
    codeRoom,
  };
  const [message, setMessage] = useState<IMessage>(INITIAL_MESSAGE);
  const [newMessage, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const handleJoinRoom = (e: FormEvent) => {
    e.preventDefault();
    socket.emit("joinRoom", codeRoom);
    setJoinedRoom(true);
  };
  // Ref para el contenedor de mensajes
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleMessage = (msg: string) => {
    socket.emit("typing", { codeRoom, message: msg, owner: username });
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
      type: "text",
      codeRoom: codeRoom,
    });
  };

  const handleImageUpload = (imageUrl: string) => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    const imageMessage: IMessage = {
      owner: username,
      message: imageUrl,
      time: formattedTime,
      type: "image",
      codeRoom: codeRoom,
    };

    socket.emit("message", { codeRoom, message: imageMessage });
    setMessage(INITIAL_MESSAGE);
  };
  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    socket.emit("message", { codeRoom, message });
    setMessage(INITIAL_MESSAGE);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get(
        `${apiUrl}/websocket/messages/${codeRoom}`
      );

      setMessages(
        response.data.map(
          ({ message, owner, time, type, _id, codeRoom }: IMessage) => ({
            _id,
            message,
            owner,
            time,
            type,
            codeRoom,
          })
        )
      );
    };
    if (codeRoom) {
      fetchMessages();
    }
    socket.on("ownMessage", (message) => {
      if (message.owner === username) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });
    socket.on("typing", (data) => {
      if (data.owner !== username) {
        setTypingUser(data.owner);
        setIsTyping(data.message.length && true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });
    socket.on("serverMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      setIsTyping(false);
    });

    return () => {
      socket.off("serverMessage");
      socket.off("ownMessage");
      socket.off("typing");
    };
  }, [codeRoom]);

  // Desplazar al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [newMessage]);

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevState) =>
      prevState.filter((msg) => msg._id !== messageId)
    );
  };
  if (!joinedRoom) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <img src="/welcome.jpg" alt="we chat" className="w-1/4" />
        <form onSubmit={handleJoinRoom} className="flex items-center">
          <Input
            type="text"
            placeholder="Enter room code"
            value={codeRoom}
            onChange={(e) => setRoomCode(e.target.value)}
            className="mr-2"
          />
          <Button type="submit" disabled={codeRoom.length === 0}>
            Join Room
          </Button>
        </form>
      </div>
    );
  }
  return (
    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 pt-[50px] max-md:px-1 max-md:pb-1 max-md:pt-[50px]  w-full">
      <div className="absolute  top-0 left-0 rounded-t-md w-full bg-accent  h-[54px] flex justify-between pt-1 px-4">
        <div>
          <section className="flex items-center gap-2">
            <Group />
            <h1 className="text-xl font-medium">{codeRoom}</h1>
          </section>
          {isTyping ? (
            <div className="text-black text-sm italic">
              {`${typingUser} está escribiendo...`}
            </div>
          ) : null}
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setRoomCode("");
            setJoinedRoom(false);
          }}
        >
          <LogOut />
          <h1 className="text-xl font-medium">Salir</h1>
        </Button>
      </div>
      <div className=" flex flex-col flex-grow items-start text-accent w-full rounded-md mx-auto max-h-full overflow-auto h-full ">
        {newMessage.map((msg, index) => (
          <Message
            key={index}
            data={msg}
            socket={socket}
            username={username}
            handleDeleteMessage={handleDeleteMessage}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex-1" />
      <form
        onSubmit={sendMessage}
        className="overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring pb-3 h-32"
        x-chunk="dashboard-03-chunk-1"
      >
        <Input
          id="message"
          placeholder="Type your message here..."
          className="min-h-[60%] resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          value={message.message}
          onChange={(e) => handleMessage(e.target.value)}
          autoComplete="off"
        />
        <div className="flex items-center p-3 pt-0 justify-between">
          <UploadImage onUpload={handleImageUpload} />

          <div>
            {message.message.length === 0 ? (
              <Button size="icon" type="button">
                <Mic className="size-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                className=""
                disabled={message.message.length === 0}
              >
                <Send className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
