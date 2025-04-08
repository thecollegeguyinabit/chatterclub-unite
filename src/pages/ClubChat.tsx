
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useClubify } from '@/context/ClubifyContext';
import Navbar from '@/components/Navbar';
import ClubSidebar from '@/components/ClubSidebar';
import ChatMessage from '@/components/ChatMessage';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Plus, Hash, PlusCircle, Smile, Paperclip, Image as ImageIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const ClubChat = () => {
  const { clubId, channelId } = useParams<{ clubId: string; channelId?: string }>();
  const { clubs, activeClub, activeChannel, setActiveClub, setActiveChannel, sendMessage, currentUser } = useClubify();
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Set active club and channel based on URL params
  useEffect(() => {
    if (clubId) {
      setActiveClub(clubId);
      
      // If no channelId is provided, don't set any channel
      if (channelId) {
        setActiveChannel(channelId);
      }
    }
    
    return () => {
      setActiveClub(null);
    };
  }, [clubId, channelId, setActiveClub, setActiveChannel]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChannel?.messages]);
  
  if (!activeClub || !activeChannel) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center animate-fadeIn">
            <h2 className="text-2xl font-medium mb-2">Select a channel</h2>
            <p className="text-gray-600">Choose a channel from the sidebar to start chatting.</p>
          </div>
        </div>
      </div>
    );
  }
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && currentUser) {
      sendMessage(message, activeChannel.id);
      setMessage('');
      setIsExpanded(false);
    }
  };
  
  // Group messages by date and sender for better UI
  const groupedMessages = activeChannel.messages.reduce((groups, message, index, array) => {
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
  }, [] as Array<{ senderId: string, messages: typeof activeChannel.messages }>);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 flex">
        <ClubSidebar />
        
        <div className="flex-1 flex flex-col">
          <div className="border-b border-gray-200 py-3 px-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
              <Hash className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="font-medium">{activeChannel.name}</h2>
            </div>
            
            <div>
              <Button variant="ghost" size="sm">
                <PlusCircle className="h-4 w-4 mr-1" />
                Create Event
              </Button>
            </div>
          </div>
          
          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="space-y-1">
              {/* Welcome message */}
              {activeChannel.messages.length === 0 && (
                <div className="text-center py-8 animate-fadeIn">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-clubify-50 text-clubify-600 mb-4">
                    <Hash className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Welcome to #{activeChannel.name}!</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    This is the start of the #{activeChannel.name} channel. Send a message to start the conversation.
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
          
          <div className="p-4 border-t border-gray-200 bg-white shadow-inner">
            <form onSubmit={handleSendMessage} className="space-y-2">
              {isExpanded ? (
                <Textarea 
                  placeholder={`Message #${activeChannel.name}`}
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
                  placeholder={`Message #${activeChannel.name}`}
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
                  >
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClubChat;
