
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!clubId || !channelId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("club_id", clubId)
      .eq("channel_id", channelId)
      .order("sent_at", { ascending: true });
    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  }, [clubId, channelId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Real-time updates
  useEffect(() => {
    if (!clubId || !channelId) return;

    const channel = supabase.channel(`messages-${clubId}-${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `club_id=eq.${clubId},channel_id=eq.${channelId}`,
        },
        (payload) => {
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clubId, channelId]);

  return { messages, loading, refetch: fetchMessages };
}
