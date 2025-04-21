
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ChatInputTextAreaProps = {
  message: string;
  setMessage: (val: string) => void;
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  placeholder?: string;
  onSend: (e: React.FormEvent) => void;
};

const ChatInputTextArea: React.FC<ChatInputTextAreaProps> = ({
  message,
  setMessage,
  isExpanded,
  setIsExpanded,
  placeholder,
  onSend,
}) => {
  return isExpanded ? (
    <Textarea
      placeholder={placeholder}
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="w-full resize-none transition-all focus-visible:ring-clubify-500"
      rows={3}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (message.trim()) onSend(e as any);
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
          if (message.trim()) onSend(e as any);
        }
      }}
    />
  );
};

export default ChatInputTextArea;
