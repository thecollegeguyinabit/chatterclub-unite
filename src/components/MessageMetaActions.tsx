
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, Reply, MoreHorizontal } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import { cn } from "@/lib/utils";
import { formatTime } from "./messageUtils";

type MessageMetaActionsProps = {
  isCurrentUser: boolean;
  liked: boolean;
  onReactionClick: () => void;
  onEmojiSelect: (emoji: string) => void;
  onImageButtonClick: () => void;
  onFileButtonClick: () => void;
  showAvatar: boolean;
  timestamp: Date;
};

const MessageMetaActions: React.FC<MessageMetaActionsProps> = ({
  isCurrentUser,
  liked,
  onReactionClick,
  onEmojiSelect,
  onImageButtonClick,
  onFileButtonClick,
  showAvatar,
  timestamp,
}) => (
  <div
    className={cn(
      "flex items-center mt-1 gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
      isCurrentUser && "justify-end"
    )}
  >
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6"
      onClick={onReactionClick}
    >
      <Heart
        className={cn(
          "h-3.5 w-3.5",
          liked ? "fill-red-500 text-red-500" : "text-gray-500"
        )}
      />
    </Button>
    <EmojiPicker onEmojiSelect={onEmojiSelect} />
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6"
      onClick={onImageButtonClick}
    >
      <Reply className="h-3.5 w-3.5 text-gray-500" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6"
      onClick={onFileButtonClick}
    >
      <MoreHorizontal className="h-3.5 w-3.5 text-gray-500" />
    </Button>
    {!showAvatar && (
      <span className="text-xs text-gray-500">{formatTime(timestamp)}</span>
    )}
  </div>
);

export default MessageMetaActions;
