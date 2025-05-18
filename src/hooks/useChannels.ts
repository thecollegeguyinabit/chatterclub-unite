
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export function useChannels(clubId: string | null) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Add a new channel to the club
  const addChannel = useCallback(async (channelName: string) => {
    if (!clubId) return null;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("channels")
        .insert({
          club_id: clubId,
          name: channelName,
          is_private: false
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error adding channel:", error);
        toast({
          title: "Error adding channel",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
      
      toast({
        title: "Channel created",
        description: `${channelName} channel has been created.`
      });
      
      return data;
    } catch (error) {
      console.error("Error adding channel:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [clubId, toast]);

  // Remove a channel from the club
  const removeChannel = useCallback(async (channelId: string) => {
    if (!clubId || !channelId) return false;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from("channels")
        .delete()
        .eq("id", channelId)
        .eq("club_id", clubId);
        
      if (error) {
        console.error("Error removing channel:", error);
        toast({
          title: "Error removing channel",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Channel deleted",
        description: "The channel has been removed."
      });
      
      return true;
    } catch (error) {
      console.error("Error removing channel:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [clubId, toast]);

  return {
    addChannel,
    removeChannel,
    loading
  };
}
