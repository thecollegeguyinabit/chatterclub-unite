
import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClubify } from "@/context/ClubifyContext";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Video, Info, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import ChatInput from "@/components/ChatInput";
import MessageList from "@/components/MessageList";
import { Button } from "@/components/ui/button";

const DirectChat = () => {
  const { userId } = useParams<{ userId: string }>();
  const { setActiveChat, activeChat, sendMessage, currentUser } = useClubify();
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      setActiveChat(userId);
    }
    return () => {
      setActiveChat(null);
    };
  }, [userId, setActiveChat]);

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
            <p className="text-gray-600">
              Choose a person to start chatting with.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // File/image upload for direct messages
  const uploadChatFile = async (file: File, type: "file" | "image") => {
    if (!currentUser || !activeChat) return;
    const ext = file.name.split(".").pop();
    const path = `direct/${activeChat.id}/${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 8)}.${ext}`;
    const { data, error } = await supabase.storage
      .from("chat-files")
      .upload(path, file, { upsert: false });

    if (error) {
      console.error("File upload failed:", error);
      return;
    }
    const fileUrl = supabase.storage.from("chat-files").getPublicUrl(path).data
      .publicUrl;

    let messageText;
    if (type === "image") {
      messageText = `![${file.name}](${fileUrl})`;
    } else {
      messageText = `[${file.name}](${fileUrl})`;
    }
    const recipientId = activeChat.participants.find((id) => id !== currentUser.id);
    if (recipientId) {
      sendMessage(messageText, undefined, recipientId);
    }
  };

  const mockUsers = {
    "1": { name: "John Doe", avatar: "https://ui-avatars.com/api/?name=John+Doe" },
    "2": {
      name: "Jane Smith",
      avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
    },
    "3": {
      name: "Alex Johnson",
      avatar: "https://ui-avatars.com/api/?name=Alex+Johnson",
    },
    "4": {
      name: "Sam Wilson",
      avatar: "https://ui-avatars.com/api/?name=Sam+Wilson",
    },
  };

  const otherUserId = activeChat.participants.find((id) => id !== currentUser.id) || "";
  const otherUser = mockUsers[otherUserId as keyof typeof mockUsers] || {
    name: `User ${otherUserId.slice(0, 4)}`,
    avatar: `https://ui-avatars.com/api/?name=User+${otherUserId.slice(0, 4)}`,
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

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
              onClick={() => navigate("/chat")}
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
            {activeChat.messages.length === 0 && (
              <div className="text-center py-8 animate-fadeIn">
                <Avatar className="h-16 w-16 mx-auto mb-4">
                  <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                  <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-medium mb-2">{otherUser.name}</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  This is the beginning of your direct message history with{" "}
                  {otherUser.name}.
                </p>
              </div>
            )}
            <MessageList messages={activeChat.messages} />
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-gray-200 bg-white shadow-inner w-full">
          <ChatInput
            placeholder={`Message ${otherUser.name}`}
            onSend={(msg) => {
              const recipientId = activeChat.participants.find(
                (id) => id !== currentUser.id
              );
              if (recipientId) {
                sendMessage(msg, undefined, recipientId);
              }
            }}
            onUploadFile={uploadChatFile}
          />
        </div>
      </main>
    </div>
  );
};

export default DirectChat;
