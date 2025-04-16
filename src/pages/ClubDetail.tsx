import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useClubify } from '@/context/ClubifyContext';
import Navbar from '@/components/Navbar';
import ClubSidebar from '@/components/ClubSidebar';
import ClubCalendar from '@/components/ClubCalendar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, MessageSquare, Bell, BellOff, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ClubDetail = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { clubs, currentUser, joinClub, leaveClub, setActiveClub, activeClub } = useClubify();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  
  const isMember = club.members.includes(currentUser?.id || '');
  const isAdmin = club.admin === currentUser?.id;
  
  const memberCount = club.members.length;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleJoinClub = () => {
    if (!isMember) {
      joinClub(club.id);
      toast({
        title: "Joined club",
        description: `You have successfully joined ${club.name}!`
      });
    }
  };
  
  const handleLeaveClub = () => {
    if (isMember && !isAdmin) {
      leaveClub(club.id);
      toast({
        title: "Left club",
        description: `You have left ${club.name}.`
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 flex">
        {isMember && (
          <ClubSidebar />
        )}
        
        <div className="flex-1 overflow-y-auto pb-12">
          <div className="relative h-64 bg-gray-100">
            <img 
              src={club.banner || '/placeholder.svg'} 
              alt={club.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 relative z-10 animate-slideUp">
              <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                <AvatarImage src={club.avatar} alt={club.name} />
                <AvatarFallback>{getInitials(club.name)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-white md:text-gray-900">{club.name}</h1>
                      <Badge className="bg-white/90 text-gray-800 hover:bg-white/80">
                        {club.category}
                      </Badge>
                    </div>
                    <p className="text-white/90 md:text-gray-600 mt-1">
                      <Users className="inline h-4 w-4 mr-1" />
                      {memberCount} {memberCount === 1 ? 'member' : 'members'}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {isMember ? (
                      <>
                        <Link to={`/club/${club.id}/chat`}>
                          <Button variant="default">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Chat
                          </Button>
                        </Link>
                        
                        <Button variant="outline">
                          <Bell className="mr-2 h-4 w-4" />
                          Notifications
                        </Button>
                        
                        {isAdmin && (
                          <Link to={`/club/${club.id}/settings`}>
                            <Button variant="outline">
                              <Settings className="mr-2 h-4 w-4" />
                              Settings
                            </Button>
                          </Link>
                        )}
                        
                        {!isAdmin && (
                          <Button 
                            variant="outline" 
                            onClick={handleLeaveClub}
                            className="bg-white text-gray-700 hover:bg-gray-100"
                          >
                            Leave
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button onClick={handleJoinClub}>
                        Join Club
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8 animate-slideInLeft">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <p className="text-gray-700 whitespace-pre-line">{club.description}</p>
                </div>
                
                {isMember && clubId && (
                  <ClubCalendar clubId={clubId} />
                )}
                
                {!isMember && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Upcoming Events</h2>
                    </div>
                    
                    <div className="text-center py-8 text-gray-500">
                      <CalendarDays className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                      <p>Join this club to see and create events</p>
                      <Button className="mt-4" size="sm" onClick={handleJoinClub}>
                        Join Club
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-8 animate-slideInRight">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Members</h2>
                    <Link to={`/club/${clubId}/members`}>
                      <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {club.members.slice(0, 5).map((memberId, index) => (
                      <div key={memberId} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://ui-avatars.com/api/?name=Member+${index + 1}`} />
                          <AvatarFallback>M{index + 1}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {memberId === club.admin ? (
                              <span>Club Admin</span>
                            ) : (
                              <span>Member {index + 1}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold mb-4">Channels</h2>
                  
                  <div className="space-y-2">
                    {club.channels.map(channel => (
                      <Link 
                        to={`/club/${club.id}/chat/${channel.id}`} 
                        key={channel.id}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-gray-500">#</span>
                        <span>{channel.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClubDetail;
