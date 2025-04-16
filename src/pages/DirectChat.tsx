
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useClubify } from '@/context/ClubifyContext';
import Navbar from '@/components/Navbar';
import ChatMessage from '@/components/ChatMessage';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Smile, Plus, ArrowLeft, Phone, Video, Info, Paperclip, Image as ImageIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DirectChat = () => {
  const { userId } = useParams<{ userId: string }>();
  const { setActiveChat, activeChat, sendMessage, currentUser } = useClubify();
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  // Set active chat based on URL params
  useEffect(() => {
    if (userId) {
      setActiveChat(userId);
    }
    
    return () => {
      setActiveChat(null);
    };
  }, [userId, setActiveChat]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat?.messages]);
  
  if (!activeChat || !currentUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center animate-fadeIn">
            <h2 className="text-2xl font-medium mb-2">Select a conversation</h2>
            <p className="text-gray-600">Choose a person to start chatting with.</p>
          </div>
        </div>
      </div>
    );
  }
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      const recipientId = activeChat.participants.find(id => id !== currentUser.id);
      if (recipientId) {
        sendMessage(message, undefined, recipientId);
        setMessage('');
        setIsExpanded(false);
      }
    }
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
      // Here you would typically upload the file and then send a message with the file
      console.log('File selected:', files[0].name);
      
      // Clear the input to allow selecting the same file again
      e.target.value = '';
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Here you would typically upload the image and then send a message with the image
      console.log('Image selected:', files[0].name);
      
      // Clear the input to allow selecting the same image again
      e.target.value = '';
    }
  };
  
  // Mock user data for demo
  const mockUsers = {
    '1': { name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe' },
    '2': { name: 'Jane Smith', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith' },
    '3': { name: 'Alex Johnson', avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson' },
    '4': { name: 'Sam Wilson', avatar: 'https://ui-avatars.com/api/?name=Sam+Wilson' },
  };
  
  const otherUserId = activeChat.participants.find(id => id !== currentUser.id) || '';
  const otherUser = mockUsers[otherUserId as keyof typeof mockUsers] || { 
    name: `User ${otherUserId.slice(0, 4)}`, 
    avatar: `https://ui-avatars.com/api/?name=User+${otherUserId.slice(0, 4)}` 
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Group messages by date and sender for better UI
  const groupedMessages = activeChat.messages.reduce((groups, message, index, array) => {
    const prevMessage = index > 0 ? array[index - 1] : null;
    
    // Check if this message is from the same sender as the previous one
    // and within 5 minutes of the previous message
    const isSameSender = prevMessage && prevMessage.senderId === message.senderId;
    const isCloseTime = prevMessage && 
      (message.timestamp.getTime() - prevMessage.timestamp.getTime() < 5 * 60 * 1000);
    
    // If both conditions are met, add to the last group
    if (isSameSender && isCloseTime) {
      const lastGroup = groups[groups.length - 1];
      lastGroup.messages.push(message);
    } else {
      // Otherwise, create a new group
      groups.push({
        senderId: message.senderId,
        messages: [message]
      });
    }
    
    return groups;
  }, [] as Array<{ senderId: string, messages: typeof activeChat.messages }>);
  
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Navbar />
      
      <main className="flex-1 flex flex-col pt-16 h-[calc(100vh-4rem)] w-full max-w-full">
        <div className="border-b border-gray-200 py-3 px-4 flex items-center justify-between shadow-sm bg-white z-10">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 md:hidden"
              onClick={() => navigate('/chat')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
              <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="font-medium text-sm md:text-base">{otherUser.name}</h2>
              <p className="text-xs text-gray-500">Active now</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Phone className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Video className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon">
              <Info className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
        
        <ScrollArea ref={scrollRef} className="flex-1 w-full h-full overflow-y-auto">
          <div className="p-4 w-full space-y-1">
            {/* Welcome message */}
            {activeChat.messages.length === 0 && (
              <div className="text-center py-8 animate-fadeIn">
                <Avatar className="h-16 w-16 mx-auto mb-4">
                  <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                  <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-medium mb-2">{otherUser.name}</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  This is the beginning of your direct message history with {otherUser.name}.
                </p>
              </div>
            )}
            
            {/* Messages */}
            {groupedMessages.map((group, groupIndex) => (
              <div key={`group-${groupIndex}`} className="w-full">
                {group.messages.map((message, messageIndex) => (
                  <ChatMessage 
                    key={message.id} 
                    message={message} 
                    showAvatar={messageIndex === 0}
                  />
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-gray-200 bg-white shadow-inner w-full">
          <form onSubmit={handleSendMessage} className="space-y-2 w-full">
            {isExpanded ? (
              <Textarea 
                placeholder={`Message ${otherUser.name}`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none transition-all focus-visible:ring-clubify-500"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (message.trim()) handleSendMessage(e);
                  }
                }}
                autoFocus
              />
            ) : (
              <Input
                placeholder={`Message ${otherUser.name}`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-gray-50 border-gray-200 focus-visible:ring-clubify-500"
                onFocus={() => setIsExpanded(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (message.trim()) handleSendMessage(e);
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
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  onClick={handleImageButtonClick}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  onClick={handleFileButtonClick}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
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
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4 mr-1" />
                Send
              </Button>
            </div>
          </form>

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
      </main>
    </div>
  );
};

export default DirectChat;
