
import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Reply, MoreHorizontal } from 'lucide-react';
import { useClubify, Message } from '@/context/ClubifyContext';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
  showAvatar?: boolean;
}

// Mock user data for demo
const mockUsers = {
  '1': { name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe' },
  '2': { name: 'Jane Smith', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith' },
  '3': { name: 'Alex Johnson', avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson' },
  '4': { name: 'Sam Wilson', avatar: 'https://ui-avatars.com/api/?name=Sam+Wilson' },
};

const ChatMessage = ({ message, showAvatar = true }: ChatMessageProps) => {
  const { currentUser } = useClubify();
  const [liked, setLiked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const isCurrentUser = message.senderId === currentUser?.id;
  const sender = mockUsers[message.senderId as keyof typeof mockUsers];
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

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
      // Here you would typically upload or process the selected file
      console.log('File selected:', files[0].name);
      
      // Clear the input to allow selecting the same file again
      e.target.value = '';
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Here you would typically upload or process the selected image file
      console.log('Image selected:', files[0].name);
      
      // Clear the input to allow selecting the same image again
      e.target.value = '';
    }
  };

  const handleReactionClick = () => {
    // For now just toggle the liked state
    // In a real app, this would open an emoji picker
    setLiked(!liked);
  };
  
  return (
    <div className={cn(
      "group flex items-start gap-3 px-4 py-2 hover:bg-gray-50 transition-colors w-full",
      isCurrentUser && "flex-row-reverse"
    )}>
      {showAvatar && !isCurrentUser ? (
        <Avatar className="h-8 w-8 mt-0.5 flex-shrink-0">
          <AvatarImage src={sender?.avatar} alt={sender?.name} />
          <AvatarFallback>{sender?.name ? getInitials(sender.name) : 'U'}</AvatarFallback>
        </Avatar>
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
        
        <div className={cn(
          "rounded-2xl px-4 py-2",
          isCurrentUser ? 
            "bg-clubify-500 text-white" : 
            "bg-gray-100 text-gray-800"
        )}>
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>
        
        <div className={cn(
          "flex items-center mt-1 gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
          isCurrentUser && "justify-end"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleReactionClick}
          >
            <Heart className={cn(
              "h-3.5 w-3.5",
              liked ? "fill-red-500 text-red-500" : "text-gray-500"
            )} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleImageButtonClick}
          >
            <Reply className="h-3.5 w-3.5 text-gray-500" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleFileButtonClick}
          >
            <MoreHorizontal className="h-3.5 w-3.5 text-gray-500" />
          </Button>
          
          {!showAvatar && (
            <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
          )}
        </div>
      </div>

      {/* Hidden file inputs */}
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
  );
};

export default ChatMessage;
