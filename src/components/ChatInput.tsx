
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Plus, Smile } from "lucide-react";
import FileUploadButton from "./FileUploadButton";

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
      {isExpanded ? (
        <Textarea
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none transition-all focus-visible:ring-clubify-500"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (message.trim()) handleSend(e);
            }
          }}
          autoFocus
        />
      ) : (
        <Input
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-gray-50 border-gray-200 focus-visible:ring-clubify-500"
          onFocus={() => setIsExpanded(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (message.trim()) handleSend(e);
            }
          }}
        />
      )}
      <div className="flex justify-between items-center">
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
