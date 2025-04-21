
import React from "react";
import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  isCurrentUser: boolean;
  text: string;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ isCurrentUser, text }) => {
  // Check if the text contains a markdown image link ![alt](url)
  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/;
  const imageMatch = text.match(imagePattern);
  
  // Check if the text contains a markdown file link [filename](url)
  const filePattern = /\[([^\]]*)\]\(([^)]+)\)/;
  const fileMatch = !imageMatch && text.match(filePattern);

  return (
    <div
      className={cn(
        "rounded-2xl px-4 py-2 max-w-[80%]",
        isCurrentUser
          ? "bg-clubify-500 text-white"
          : "bg-gray-100 text-gray-800"
      )}
    >
      {imageMatch ? (
        // Render image
        <div className="message-image">
          <img 
            src={imageMatch[2]} 
            alt={imageMatch[1] || "Shared image"} 
            className="rounded-md max-w-full max-h-64 object-contain"
            onError={(e) => {
              console.error("Image failed to load:", imageMatch[2]);
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          <p className="text-xs mt-1 opacity-75">{imageMatch[1]}</p>
        </div>
      ) : fileMatch ? (
        // Render file link
        <a 
          href={fileMatch[2]} 
          target="_blank" 
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-2 underline",
            isCurrentUser ? "text-white" : "text-blue-600"
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          {fileMatch[1]}
        </a>
      ) : (
        // Render regular text
        <p className="whitespace-pre-wrap break-words">{text}</p>
      )}
    </div>
  );
};

export default MessageBubble;
