import { useState } from "react";
import { Button } from "../ui/button";

export function Login({
  setUsername,
}: {
  setUsername: (username: string) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUsername(inputValue);
    localStorage.setItem("user", inputValue);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          placeholder="Enter your username"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="p-2 border rounded mb-4"
        />
        <Button type="submit">Log In</Button>
      </form>
    </div>
  );
}
