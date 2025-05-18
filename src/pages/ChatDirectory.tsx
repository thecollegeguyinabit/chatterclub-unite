
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useClubify } from '@/context/ClubifyContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Users, Hash, MessageSquare, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProfile } from '@/hooks/useProfile';
import { getInitials } from '@/components/messageUtils';

// Mock user data for demo
const mockUserIds = ['2', '3', '4'];

const ChatDirectory = () => {
  const { userClubs, directMessages, currentUser, setActiveClub, setActiveChat } = useClubify();
  
  useEffect(() => {
    // Clear any active selections
    setActiveClub(null);
    setActiveChat(null);
  }, [setActiveClub, setActiveChat]);
  
  if (!currentUser) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 bg-sidebar hidden md:block">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search conversations"
                className="pl-10"
              />
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="px-2 py-4">
              {/* Clubs */}
              <div className="px-2 mb-2">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  My Clubs
                </h3>
              </div>
              
              {userClubs.length > 0 ? (
                userClubs.map(club => (
                  <Link to={`/club/${club.id}`} key={club.id}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start mb-1 text-sm font-normal"
                    >
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarImage src={club.avatar} alt={club.name} />
                        <AvatarFallback>{getInitials(club.name)}</AvatarFallback>
                      </Avatar>
                      <span className="truncate">{club.name}</span>
                    </Button>
                  </Link>
                ))
              ) : (
                <div className="px-2 py-2 text-sm text-gray-500">
                  You haven't joined any clubs yet
                </div>
              )}
              
              <Link to="/explore">
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-1 text-sm font-normal"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Explore Clubs
                </Button>
              </Link>
              
              {/* Direct Messages */}
              <div className="px-2 mb-2 mt-4">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Direct Messages
                </h3>
              </div>
              
              {mockUserIds.map(userId => (
                <UserListItem key={userId} userId={userId} />
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="max-w-md text-center animate-fadeIn">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-clubify-50 text-clubify-600 mb-4">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Your Messages</h2>
            <p className="text-gray-600 mb-8">
              Select a conversation from the sidebar or start a new one below.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Link to="/explore">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                  <Hash className="h-6 w-6" />
                  <span>Join a Club</span>
                </Button>
              </Link>
              <Link to="/my-clubs">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>My Clubs</span>
                </Button>
              </Link>
            </div>
            
            <div className="md:hidden space-y-4">
              <h3 className="text-lg font-medium mb-2">Recent Conversations</h3>
              
              <div className="space-y-2">
                {userClubs.slice(0, 3).map(club => (
                  <Link to={`/club/${club.id}`} key={club.id} className="block">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={club.avatar} alt={club.name} />
                        <AvatarFallback>{getInitials(club.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{club.name}</p>
                        <p className="text-sm text-gray-500">Club</p>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {mockUserIds.slice(0, 3).map(userId => (
                  <MobileUserItem key={userId} userId={userId} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper component for user list items with profile data
const UserListItem = ({ userId }: { userId: string }) => {
  const { profile } = useProfile(userId);
  const userName = profile?.email || `User ${userId.slice(0, 4)}`;
  
  return (
    <Link to={`/chat/${userId}`}>
      <Button
        variant="ghost"
        className="w-full justify-start mb-1 text-sm font-normal"
      >
        <Avatar className="h-5 w-5 mr-2">
          <AvatarImage src={profile?.avatar_url || undefined} alt={userName} />
          <AvatarFallback>{getInitials(userName)}</AvatarFallback>
        </Avatar>
        <span className="truncate">{userName}</span>
      </Button>
    </Link>
  );
};

// Helper component for mobile user items with profile data
const MobileUserItem = ({ userId }: { userId: string }) => {
  const { profile } = useProfile(userId);
  const userName = profile?.email || `User ${userId.slice(0, 4)}`;
  
  return (
    <Link to={`/chat/${userId}`} className="block">
      <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile?.avatar_url || undefined} alt={userName} />
          <AvatarFallback>{getInitials(userName)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{userName}</p>
          <p className="text-sm text-gray-500">Direct Message</p>
        </div>
      </div>
    </Link>
  );
};

export default ChatDirectory;
