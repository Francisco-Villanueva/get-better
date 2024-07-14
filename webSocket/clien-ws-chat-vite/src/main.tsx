import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/toaster.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <TooltipProvider>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </TooltipProvider>
);
