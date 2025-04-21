
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useClubify } from "@/context/ClubifyContext";
import Navbar from "@/components/Navbar";
import ClubSidebar from "@/components/ClubSidebar";
import { Hash, PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import ChatInput from "@/components/ChatInput";
import MessageList from "@/components/MessageList";
import { Button } from "@/components/ui/button";
import { useChannelMessages } from "@/hooks/useChannelMessages";

// Temporary, should match Message shape expected by MessageList
function mapDbMessageToContextMsg(dbMsg) {
  return {
    id: dbMsg.id,
    senderId: dbMsg.sender_id,
    text: dbMsg.text,
    timestamp: new Date(dbMsg.sent_at),
  };
}

const ClubChat = () => {
  const { clubId, channelId } = useParams<{ clubId: string; channelId?: string }>();
  const {
    clubs,
    activeClub,
    activeChannel,
    setActiveClub,
    setActiveChannel,
    sendMessage,
    currentUser,
  } = useClubify();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use new hook for Supabase-backed messages
  const { messages: dbMessages, loading } = useChannelMessages(
    activeClub?.id || null,
    activeChannel?.id || null
  );

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
  }, [dbMessages]);

  if (!activeClub || !activeChannel) {
    return (
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center animate-fadeIn">
            <h2 className="text-2xl font-medium mb-2">Select a channel</h2>
            <p className="text-gray-600">
              Choose a channel from the sidebar to start chatting.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Updated: Save chat files as before, but send via Supabase instead of context
  const uploadChatFile = async (file: File, type: "file" | "image") => {
    if (!currentUser || !activeClub || !activeChannel) return;

    const ext = file.name.split(".").pop();
    const path = `${activeClub.id}/${activeChannel.id}/${Date.now()}-${Math.random()
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

    const { error: metaError } = await supabase.from("chat_files").insert([
      {
        message_id: "pending",
        club_id: activeClub.id,
        channel_id: activeChannel.id,
        file_name: file.name,
        file_url: fileUrl,
      },
    ]);

    if (metaError) {
      console.error("Failed to store file metadata:", metaError);
    }

    let messageText;
    if (type === "image") {
      messageText = `![${file.name}](${fileUrl})`;
    } else {
      messageText = `[${file.name}](${fileUrl})`;
    }
    // Use the new sendMessageToSupabase function
    await sendMessageToSupabase(messageText);
  };

  // Send message: Insert into Supabase
  const sendMessageToSupabase = async (msg: string) => {
    if (!currentUser || !activeClub || !activeChannel) return;

    const { error } = await supabase.from("messages").insert({
      club_id: activeClub.id,
      channel_id: activeChannel.id,
      sender_id: currentUser.id,
      text: msg,
    });
    if (error) {
      console.error("Failed to send message:", error);
    }
    // Real-time will auto-update UI
  };

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
              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading messages...</div>
              ) : dbMessages.length === 0 ? (
                <div className="text-center py-8 animate-fadeIn">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-clubify-50 text-clubify-600 mb-4">
                    <Hash className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    Welcome to #{activeChannel.name}!
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    This is the start of the #{activeChannel.name} channel. Send a
                    message to start the conversation.
                  </p>
                </div>
              ) : (
                <MessageList messages={dbMessages.map(mapDbMessageToContextMsg)} />
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-gray-200 bg-white shadow-inner w-full">
            <ChatInput
              placeholder={`Message #${activeChannel.name}`}
              onSend={sendMessageToSupabase}
              onUploadFile={uploadChatFile}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClubChat;
