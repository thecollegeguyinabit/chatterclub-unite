import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Reply, MoreHorizontal, Trash2 } from 'lucide-react';
import { useClubify, Message } from '@/context/ClubifyContext';
import { cn } from '@/lib/utils';
import EmojiPicker from './EmojiPicker';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import AvatarWithInitials from "./AvatarWithInitials";
import MessageBubble from "./MessageBubble";
import MessageMetaActions from "./MessageMetaActions";
import { getInitials, formatTime } from "./messageUtils";

const mockUsers = {
  '1': { name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe' },
  '2': { name: 'Jane Smith', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith' },
  '3': { name: 'Alex Johnson', avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson' },
  '4': { name: 'Sam Wilson', avatar: 'https://ui-avatars.com/api/?name=Sam+Wilson' },
};

interface ChatMessageProps {
  message: Message;
  showAvatar?: boolean;
}

const ChatMessage = ({ message, showAvatar = true }: ChatMessageProps) => {
  const { currentUser, activeClub, deleteMessage } = useClubify();
  const [liked, setLiked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const isCurrentUser = message.senderId === currentUser?.id;
  const sender = mockUsers[message.senderId as keyof typeof mockUsers];
  
  const isAdminOrModerator = currentUser && activeClub && (
    activeClub.admin === currentUser.id ||
    currentUser.role === 'moderator'
  );

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageButtonClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('File selected:', files[0].name);
      e.target.value = '';
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('Image selected:', files[0].name);
      e.target.value = '';
    }
  };

  const handleReactionClick = () => {
    setLiked(!liked);
  };

  const handleEmojiSelect = (emoji: string) => {
    console.log('Emoji selected:', emoji);
    setLiked(true);
  };

  const handleDeleteMessage = () => {
    if (activeClub && isAdminOrModerator) {
      deleteMessage(message.id, activeClub.id);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className={cn(
          "group flex items-start gap-3 px-4 py-2 hover:bg-gray-50 transition-colors w-full",
          isCurrentUser && "flex-row-reverse"
        )}>
          {showAvatar && !isCurrentUser ? (
            <AvatarWithInitials
              name={sender?.name}
              avatar={sender?.avatar}
            />
          ) : showAvatar ? (
            <div className="h-8 w-8 flex-shrink-0"></div>
          ) : <div className="w-8 flex-shrink-0"></div>}
          
          <div className={cn(
            "flex flex-col max-w-3xl w-full",
            isCurrentUser ? "items-end" : "items-start"
          )}>
            {showAvatar && !isCurrentUser && (
              <div className="flex items-center mb-1 gap-2">
                <span className="font-medium text-sm">{sender?.name}</span>
                <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
              </div>
            )}
            
            <MessageBubble
              isCurrentUser={isCurrentUser}
              text={message.text}
            />
            
            <MessageMetaActions
              isCurrentUser={isCurrentUser}
              liked={liked}
              onReactionClick={handleReactionClick}
              onEmojiSelect={handleEmojiSelect}
              onImageButtonClick={handleImageButtonClick}
              onFileButtonClick={handleFileButtonClick}
              showAvatar={showAvatar}
              timestamp={message.timestamp}
            />
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
          <input 
            type="file" 
            ref={imageInputRef} 
            accept="image/*" 
            onChange={handleImageChange} 
            style={{ display: 'none' }} 
          />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {isAdminOrModerator && (
          <ContextMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            onClick={handleDeleteMessage}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Message
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ChatMessage;
