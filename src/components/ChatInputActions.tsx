
import React, { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Smile } from "lucide-react";
import FileUploadButton from "./FileUploadButton";

type ChatInputActionsProps = {
  fileInputRef: RefObject<HTMLInputElement>;
  imageInputRef: RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ChatInputActions: React.FC<ChatInputActionsProps> = ({
  fileInputRef,
  imageInputRef,
  handleFileChange,
  handleImageChange,
}) => (
  <div className="flex items-center space-x-1">
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
    >
      <Plus className="h-5 w-5" />
    </Button>
    <FileUploadButton
      ref={imageInputRef}
      onChange={handleImageChange}
      type="image"
      accept="image/*"
    />
    <FileUploadButton
      ref={fileInputRef}
      onChange={handleFileChange}
      type="file"
    />
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
    >
      <Smile className="h-5 w-5" />
    </Button>
  </div>
);

export default ChatInputActions;
