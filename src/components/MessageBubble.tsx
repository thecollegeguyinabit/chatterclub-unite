
import React from "react";
import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  isCurrentUser: boolean;
  text: string;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ isCurrentUser, text }) => (
  <div
    className={cn(
      "rounded-2xl px-4 py-2",
      isCurrentUser
        ? "bg-clubify-500 text-white"
        : "bg-gray-100 text-gray-800"
    )}
  >
    <p className="whitespace-pre-wrap break-words">{text}</p>
  </div>
);

export default MessageBubble;
