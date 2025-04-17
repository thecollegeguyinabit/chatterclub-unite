
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Hash, Plus, Trash } from 'lucide-react';
import { Channel, Club } from '@/types/club';

interface ChannelSettingsProps {
  club: Club;
  addChannel: (clubId: string, channelName: string) => void;
  removeChannel: (clubId: string, channelId: string) => void;
}

const ChannelSettings = ({ club, addChannel, removeChannel }: ChannelSettingsProps) => {
  const { toast } = useToast();
  
  const [newChannelName, setNewChannelName] = useState('');
  const [deletingChannelId, setDeletingChannelId] = useState<string | null>(null);
  
  const handleCreateChannel = () => {
    if (!newChannelName.trim()) {
      toast({
        title: "Error",
        description: "Channel name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    addChannel(club.id, newChannelName.trim());
    
    toast({
      title: "Channel created",
      description: `${newChannelName} channel has been created.`
    });
    setNewChannelName('');
  };
  
  const handleDeleteChannel = (channelId: string, channelName: string) => {
    if (channelName === 'general') {
      toast({
        title: "Cannot delete general channel",
        description: "The general channel cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    
    removeChannel(club.id, channelId);
    
    toast({
      title: "Channel deleted",
      description: `${channelName} channel has been deleted.`
    });
    
    setDeletingChannelId(null);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Club Channels</CardTitle>
        <CardDescription>
          Manage the channels in your club
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input 
            placeholder="New channel name..." 
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
          />
          <Button onClick={handleCreateChannel}>
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </div>
        
        <div className="space-y-2">
          {club.channels.map(channel => (
            <div 
              key={channel.id}
              className="flex items-center justify-between p-3 rounded-md border border-gray-200"
            >
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <span>{channel.name}</span>
              </div>
              
              {channel.name !== 'general' && (
                <Dialog open={deletingChannelId === channel.id} onOpenChange={(open) => {
                  if (!open) setDeletingChannelId(null);
                }}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setDeletingChannelId(channel.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Channel</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete the #{channel.name} channel? This will permanently remove all messages and cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setDeletingChannelId(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleDeleteChannel(channel.id, channel.name)}
                      >
                        Delete Channel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChannelSettings;
