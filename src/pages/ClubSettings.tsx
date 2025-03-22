
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClubify } from '@/context/ClubifyContext';
import Navbar from '@/components/Navbar';
import ClubSidebar from '@/components/ClubSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, 
  ImageIcon,
  Hash, 
  Plus, 
  Shield, 
  Trash, 
  UserMinus, 
  X, 
  Save
} from 'lucide-react';

const ClubSettings = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { 
    clubs, 
    setActiveClub, 
    activeClub, 
    currentUser, 
    updateClub, 
    addChannel, 
    removeChannel, 
    removeMember, 
    promoteMember 
  } = useClubify();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Local state for form data
  const [clubName, setClubName] = useState('');
  const [clubDescription, setClubDescription] = useState('');
  const [clubAvatar, setClubAvatar] = useState('');
  const [clubBanner, setClubBanner] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [deletingChannelId, setDeletingChannelId] = useState<string | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [promotingMemberId, setPromotingMemberId] = useState<string | null>(null);
  
  // Find the club from the club ID
  const club = clubs.find(c => c.id === clubId);
  
  useEffect(() => {
    if (clubId) {
      setActiveClub(clubId);
    }
    
    return () => {
      setActiveClub(null);
    };
  }, [clubId, setActiveClub]);
  
  useEffect(() => {
    if (club) {
      setClubName(club.name);
      setClubDescription(club.description);
      setClubAvatar(club.avatar);
      setClubBanner(club.banner);
    }
  }, [club]);
  
  if (!club) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-medium mb-2">Club not found</h2>
            <p className="text-gray-600 mb-4">The club you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/explore')}>Explore Clubs</Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Check if current user is admin
  const isAdmin = club.admin === currentUser?.id;
  
  // Navigate away if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate(`/club/${clubId}`);
      toast({
        title: "Access Denied",
        description: "Only club administrators can access settings.",
        variant: "destructive"
      });
    }
  }, [isAdmin, navigate, clubId, toast]);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleSaveGeneral = () => {
    updateClub(club.id, {
      name: clubName,
      description: clubDescription,
      avatar: clubAvatar,
      banner: clubBanner
    });
    
    toast({
      title: "Settings saved",
      description: "Your club settings have been updated."
    });
  };
  
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
  
  const handleRemoveMember = (memberId: string) => {
    removeMember(club.id, memberId);
    
    toast({
      title: "Member removed",
      description: "The member has been removed from the club."
    });
    
    setDeletingMemberId(null);
  };
  
  const handlePromoteMember = (memberId: string) => {
    promoteMember(club.id, memberId);
    
    toast({
      title: "Member promoted",
      description: "The member has been promoted to moderator."
    });
    
    setPromotingMemberId(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 flex">
        <ClubSidebar />
        
        <div className="flex-1 p-6 overflow-y-auto pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Club Settings</h1>
              <Button onClick={() => navigate(`/club/${clubId}`)}>
                Back to Club
              </Button>
            </div>
            
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="channels">Channels</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
              </TabsList>
              
              {/* General Settings Tab */}
              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Club Information</CardTitle>
                    <CardDescription>
                      Edit your club's basic information and appearance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="clubName">Club Name</Label>
                        <Input 
                          id="clubName" 
                          value={clubName} 
                          onChange={(e) => setClubName(e.target.value)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="clubDescription">Description</Label>
                        <Input 
                          id="clubDescription" 
                          value={clubDescription} 
                          onChange={(e) => setClubDescription(e.target.value)} 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Label>Club Avatar</Label>
                          <div className="flex flex-col items-center gap-4">
                            <Avatar className="h-32 w-32 border-2 border-gray-200">
                              <AvatarImage src={clubAvatar} alt={clubName} />
                              <AvatarFallback>{getInitials(clubName)}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="sm">
                              <Camera className="mr-2 h-4 w-4" />
                              Change Avatar
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <Label>Club Banner</Label>
                          <div className="flex flex-col items-center gap-4">
                            <div className="relative h-32 w-full bg-gray-100 rounded-md overflow-hidden">
                              <img 
                                src={clubBanner || '/placeholder.svg'} 
                                alt={clubName} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button variant="outline" size="sm">
                              <ImageIcon className="mr-2 h-4 w-4" />
                              Change Banner
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSaveGeneral}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Channels Settings Tab */}
              <TabsContent value="channels" className="space-y-6">
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
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setDeletingChannelId(channel.id)}
                                >
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                              </DialogTrigger>
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
              </TabsContent>
              
              {/* Members Settings Tab */}
              <TabsContent value="members" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Club Members</CardTitle>
                    <CardDescription>
                      Manage your club's members
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {club.members.map((memberId, index) => (
                        <div 
                          key={memberId}
                          className="flex items-center justify-between p-3 rounded-md border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://ui-avatars.com/api/?name=Member+${index + 1}`} />
                              <AvatarFallback>M{index + 1}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {memberId === club.admin ? (
                                  <span className="flex items-center gap-1">
                                    Club Admin
                                    <Shield className="h-4 w-4 text-clubify-600" />
                                  </span>
                                ) : (
                                  <span>Member {index + 1}</span>
                                )}
                              </p>
                            </div>
                          </div>
                          
                          {memberId !== club.admin && (
                            <div className="flex gap-2">
                              <Dialog open={promotingMemberId === memberId} onOpenChange={(open) => {
                                if (!open) setPromotingMemberId(null);
                              }}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setPromotingMemberId(memberId)}
                                  >
                                    <Shield className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Promote to Moderator</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to promote this member to moderator? They will have additional permissions in the club.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => setPromotingMemberId(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      onClick={() => handlePromoteMember(memberId)}
                                    >
                                      Promote
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              <Dialog open={deletingMemberId === memberId} onOpenChange={(open) => {
                                if (!open) setDeletingMemberId(null);
                              }}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setDeletingMemberId(memberId)}
                                  >
                                    <UserMinus className="h-4 w-4 text-destructive" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Remove Member</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to remove this member from the club? This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => setDeletingMemberId(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleRemoveMember(memberId)}
                                    >
                                      Remove
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClubSettings;
