
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Channel } from "@/types/club";

export function useClubChannels(clubId: string | null) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clubId) {
      setChannels([]);
      setLoading(false);
      return;
    }

    async function fetchChannels() {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from("channels")
          .select("*")
          .eq("club_id", clubId)
          .order("name", { ascending: true });
          
        if (error) {
          console.error("Error fetching channels:", error);
          return;
        }
        
        // Transform to match Channel type in our app
        if (data) {
          const formattedChannels: Channel[] = data.map(channel => ({
            id: channel.id,
            name: channel.name,
            isPrivate: channel.is_private || false
          }));
          
          setChannels(formattedChannels);
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChannels();
    
    // Set up realtime subscription for channel changes
    const channel = supabase
      .channel(`club-${clubId}-channels`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "channels",
          filter: `club_id=eq.${clubId}`
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newChannel: Channel = {
              id: payload.new.id,
              name: payload.new.name,
              isPrivate: payload.new.is_private || false
            };
            setChannels(current => [...current, newChannel]);
          } else if (payload.eventType === "DELETE") {
            setChannels(current => current.filter(c => c.id !== payload.old.id));
          } else if (payload.eventType === "UPDATE") {
            setChannels(current => 
              current.map(c => c.id === payload.new.id ? {
                ...c,
                name: payload.new.name,
                isPrivate: payload.new.is_private || false
              } : c)
            );
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [clubId]);

  return { channels, loading };
}
