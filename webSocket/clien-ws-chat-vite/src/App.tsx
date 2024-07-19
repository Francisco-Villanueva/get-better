import { Mainpage } from "./components/Mainpage/Mainpage";
import { Chat } from "./components/Chat/Chat";
import { io } from "socket.io-client";
import { Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
const socket = io(apiUrl);
export default function App() {
  const [username, setUsername] = useState(localStorage.getItem("user") || "");
  if (username) {
    socket.emit("setUsername", username);
  }

  const LogOut = () => {
    setUsername("");
    localStorage.clear();
  };
  return (
    <main className="h-screen">
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
