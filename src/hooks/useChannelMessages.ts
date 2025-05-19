
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

type MessageRow = {
  id: string;
  club_id: string;
  channel_id: string;
  sender_id: string;
  text: string;
  sent_at: string;
};

export function useChannelMessages(clubId: string | null, channelId: string | null) {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!clubId || !channelId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("club_id", clubId)
        .eq("channel_id", channelId)
        .order("sent_at", { ascending: true });
        
      if (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error fetching messages",
          description: error.message,
          variant: "destructive"
        });
      } else if (data) {
        setMessages(data);
      }
    } catch (err) {
      console.error("Error in fetchMessages:", err);
    } finally {
      setLoading(false);
    }
  }, [clubId, channelId, toast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Real-time updates
  useEffect(() => {
    if (!clubId || !channelId) return;

    const channelName = `messages-${clubId}-${channelId}`;
    console.log(`Subscribing to channel: ${channelName}`);

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `club_id=eq.${clubId},channel_id=eq.${channelId}`,
        },
        (payload) => {
          console.log("Message event received:", payload);
          
          if (payload.eventType === "INSERT") {
            setMessages((msgs) => [...msgs, payload.new as MessageRow]);
          }
          if (payload.eventType === "DELETE") {
            setMessages((msgs) => msgs.filter(m => m.id !== payload.old.id));
          }
          if (payload.eventType === "UPDATE") {
            setMessages((msgs) => msgs.map(m => m.id === payload.new.id ? payload.new as MessageRow : m));
          }
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${channelName}:`, status);
      });

    return () => {
      console.log(`Unsubscribing from channel: ${channelName}`);
      supabase.removeChannel(channel);
    };
  }, [clubId, channelId]);

  return { messages, loading, refetch: fetchMessages };
}
