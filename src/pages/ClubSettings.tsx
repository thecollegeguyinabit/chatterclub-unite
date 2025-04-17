
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClubify } from '@/context/ClubifyContext';
import Navbar from '@/components/Navbar';
import ClubSidebar from '@/components/ClubSidebar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Import refactored components
import GeneralSettings from '@/components/club-settings/GeneralSettings';
import ChannelSettings from '@/components/club-settings/ChannelSettings';
import MemberSettings from '@/components/club-settings/MemberSettings';

const ClubSettings = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { 
    clubs, 
    setActiveClub, 
    currentUser, 
    updateClub, 
    addChannel, 
    removeChannel, 
    removeMember, 
    promoteMember 
  } = useClubify();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
                <GeneralSettings 
                  club={club} 
                  updateClub={updateClub}
                />
              </TabsContent>
              
              {/* Channels Settings Tab */}
              <TabsContent value="channels" className="space-y-6">
                <ChannelSettings 
                  club={club}
                  addChannel={addChannel}
                  removeChannel={removeChannel}
                />
              </TabsContent>
              
              {/* Members Settings Tab */}
              <TabsContent value="members" className="space-y-6">
                <MemberSettings 
                  club={club}
                  removeMember={removeMember}
                  promoteMember={promoteMember}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClubSettings;
