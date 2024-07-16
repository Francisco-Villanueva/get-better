import { useState, useRef } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function UploadImage({
  onUpload,
}: {
  onUpload: (imageUrl: string) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3001/upload/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = response.data.path;
      onUpload(imageUrl);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleCapture = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const dataUrl = canvasRef.current.toDataURL("image/png");
        const blob = await fetch(dataUrl).then((res) => res.blob());
        const file = new File([blob], "captured-image.png", {
          type: "image/png",
        });
        setSelectedFile(file);
        setIsCameraOpen(false);
        stopCamera();
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
      }
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  return (
    <div className="flex  items-center ">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2"
      />
      {selectedFile && <Button onClick={handleUpload}>Upload</Button>}
    </div>
  );
}
