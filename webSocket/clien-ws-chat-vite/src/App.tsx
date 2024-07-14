import { Mainpage } from "./components/Mainpage/Mainpage";
import { Chat } from "./components/Chat/Chat";
import { io } from "socket.io-client";
import { Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { useState } from "react";
const socket = io("ws://localhost:3001");
export default function App() {
  const [username, setUsername] = useState("");
  if (username) {
    socket.emit("setUsername", username);
  }
  const LogOut = () => setUsername("");
  return (
    <main className="h-[100vh]">
      <Mainpage socket={socket} handleLogout={LogOut} username={username}>
        {!username && <Login setUsername={setUsername} />}
        {username && (
          <Routes>
            <Route
              path="/"
              element={<Chat socket={socket} username={username} />}
            />
          </Routes>
        )}
      </Mainpage>
    </main>
  );
}
