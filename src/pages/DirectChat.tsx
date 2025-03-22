import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useClubify } from '@/context/ClubifyContext';
import Navbar from '@/components/Navbar';
import ChatMessage from '@/components/ChatMessage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Smile, Plus, ArrowLeft, Phone, Video, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DirectChat = () => {
  const { userId } = useParams<{ userId: string }>();
  const { setActiveChat, activeChat, sendMessage, currentUser } = useClubify();
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
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
      }
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 flex flex-col">
        <div className="border-b border-gray-200 py-3 px-4 flex items-center justify-between">
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
        
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="space-y-1">
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
              <div key={`group-${groupIndex}`}>
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
        
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="flex-shrink-0"
            >
              <Plus className="h-5 w-5 text-gray-500" />
            </Button>
            
            <Input
              placeholder={`Message ${otherUser.name}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="flex-shrink-0"
            >
              <Smile className="h-5 w-5 text-gray-500" />
            </Button>
            
            <Button 
              type="submit" 
              className="flex-shrink-0" 
              disabled={!message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default DirectChat;
