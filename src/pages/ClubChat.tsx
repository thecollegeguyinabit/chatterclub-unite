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
import { supabase } from '@/integrations/supabase/client';

const ClubChat = () => {
  const { clubId, channelId } = useParams<{ clubId: string; channelId?: string }>();
  const { clubs, activeClub, activeChannel, setActiveClub, setActiveChannel, sendMessage, currentUser } = useClubify();
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (clubId) {
      setActiveClub(clubId);
      
      if (channelId) {
        setActiveChannel(channelId);
      }
    }
    
    return () => {
      setActiveClub(null);
    };
  }, [clubId, channelId, setActiveClub, setActiveChannel]);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChannel?.messages]);
  
  if (!activeClub || !activeChannel) {
    return (
      <div className="h-screen w-screen flex flex-col overflow-hidden">
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

  const uploadChatFile = async (
    file: File,
    type: 'file' | 'image'
  ) => {
    if (!currentUser || !activeClub || !activeChannel) return;

    const ext = file.name.split('.').pop();
    const path = `${activeClub.id}/${activeChannel.id}/${Date.now()}-${Math.random().toString(36).substr(2, 8)}.${ext}`;
    const { data, error } = await supabase.storage
      .from('chat-files')
      .upload(path, file, { upsert: false });

    if (error) {
      console.error('File upload failed:', error);
      return;
    }

    const fileUrl = supabase.storage.from('chat-files').getPublicUrl(path).data.publicUrl;

    const { error: metaError } = await supabase
      .from('chat_files')
      .insert([
        {
          message_id: 'pending',
          club_id: activeClub.id,
          channel_id: activeChannel.id,
          file_name: file.name,
          file_url: fileUrl,
        }
      ]);

    if (metaError) {
      console.error('Failed to store file metadata:', metaError);
    }

    let messageText;
    if (type === 'image') {
      messageText = `![${file.name}](${fileUrl})`;
    } else {
      messageText = `[${file.name}](${fileUrl})`;
    }
    sendMessage(messageText, activeChannel.id);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadChatFile(files[0], 'file');
      e.target.value = '';
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadChatFile(files[0], 'image');
      e.target.value = '';
    }
  };

  const groupedMessages = activeChannel.messages.reduce((groups, message, index, array) => {
    const prevMessage = index > 0 ? array[index - 1] : null;
    
    const isSameSender = prevMessage && prevMessage.senderId === message.senderId;
    const isCloseTime = prevMessage && 
      (message.timestamp.getTime() - prevMessage.timestamp.getTime() < 5 * 60 * 1000);
    
    if (isSameSender && isCloseTime) {
      const lastGroup = groups[groups.length - 1];
      lastGroup.messages.push(message);
    } else {
      groups.push({
        senderId: message.senderId,
        messages: [message]
      });
    }
    
    return groups;
  }, [] as Array<{ senderId: string, messages: typeof activeChannel.messages }>);
  
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Navbar />
      
      <main className="flex-1 flex h-[calc(100vh-4rem)] pt-16 w-full max-w-full">
        <ClubSidebar />
        
        <div className="flex-1 flex flex-col w-full max-w-full">
          <div className="border-b border-gray-200 py-3 px-4 flex items-center justify-between shadow-sm bg-white z-10">
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
          
          <ScrollArea ref={scrollRef} className="flex-1 w-full h-full overflow-y-auto">
            <div className="p-4 w-full space-y-1">
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
        </div>
      </main>
    </div>
  );
};

export default ClubChat;
