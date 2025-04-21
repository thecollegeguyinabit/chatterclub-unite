import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Plus, Smile } from "lucide-react";
import FileUploadButton from "./FileUploadButton";
import ChatInputTextArea from "./ChatInputTextArea";
import ChatInputActions from "./ChatInputActions";

type ChatInputProps = {
  placeholder?: string;
  onSend: (message: string) => void;
  onUploadFile?: (file: File, type: "file" | "image") => void;
  isSendDisabled?: boolean;
};

const ChatInput: React.FC<ChatInputProps> = ({
  placeholder,
  onSend,
  onUploadFile,
  isSendDisabled,
}) => {
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
      setIsExpanded(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onUploadFile) {
      await onUploadFile(files[0], "file");
      e.target.value = "";
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onUploadFile) {
      await onUploadFile(files[0], "image");
      e.target.value = "";
    }
  };

  return (
    <form onSubmit={handleSend} className="space-y-2 w-full">
      <ChatInputTextArea
        message={message}
        setMessage={setMessage}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        placeholder={placeholder}
        onSend={handleSend}
      />
      <div className="flex justify-between items-center">
        <ChatInputActions
          fileInputRef={fileInputRef}
          imageInputRef={imageInputRef}
          handleFileChange={handleFileChange}
          handleImageChange={handleImageChange}
        />
        <Button
          type="submit"
          className="bg-clubify-500 hover:bg-clubify-600 transition-colors"
          disabled={isSendDisabled || !message.trim()}
        >
          <Send className="h-4 w-4 mr-1" />
          Send
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
