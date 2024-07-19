import React, { useRef, useState } from "react";
import axios from "axios";
import { Paperclip, Send } from "lucide-react";
import { Button } from "../ui/button";
const apiUrl = import.meta.env.VITE_API_URL;
interface UploadImageProps {
  onUpload: (imageUrl: string) => void;
}
const UploadImage = ({ onUpload }: UploadImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(`${apiUrl}/upload/image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("image previwe = ", response.data.path);
        setImagePreview(response.data.path);
        // onUpload(response.data.path);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };
  const deleteImageSelected = async () => {
    try {
      const response = await axios.delete(`${apiUrl}/upload/image`, {
        data: {
          filename:
            imagePreview?.split("/")[imagePreview?.split("/").length - 1],
        },
      });
      setImagePreview(null);
      console.log(response.data.message);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSendImage = () => {
    if (imagePreview) {
      onUpload(imagePreview);
      setImagePreview(null);
    }
  };

  console.log();
  return (
    <div>
      <Button onClick={handleButtonClick} variant={"ghost"} type="button">
        <Paperclip className="size-4" />
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {imagePreview ? (
        <div className=" absolute w-full h-screen top-0 left-0 flex items-center justify-center bg-black/50 ">
          <div className="bg-accent p-10 flex flex-col justify-center gap-10 items-center ">
            <img
              src={`${apiUrl}${imagePreview}`}
              alt="img-wechat"
              className="w-[500px] border-2 "
            />
            <div className="flex gap-8">
              <Button
                onClick={deleteImageSelected}
                variant={"outline"}
                type="button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendImage}
                variant={"default"}
                type="button"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UploadImage;
