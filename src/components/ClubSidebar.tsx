
import { Link, useParams } from 'react-router-dom';
import { useClubify } from '@/context/ClubifyContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, Hash, User, ChevronLeft, MessageSquare, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const ClubSidebar = () => {
  const { activeClub, activeChannel, setActiveChannel, userClubs, currentUser } = useClubify();
  const { clubId } = useParams<{ clubId: string }>();
  
  if (!activeClub) return null;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const isAdmin = activeClub.admin === currentUser?.id;
  
  return (
    <div className="flex flex-col h-full w-64 bg-sidebar border-r border-gray-200">
      <div className="flex items-center p-4 border-b border-gray-200">
        <Link to="/my-clubs" className="mr-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={activeClub.avatar} alt={activeClub.name} />
          <AvatarFallback>{getInitials(activeClub.name)}</AvatarFallback>
        </Avatar>
        <h2 className="font-medium text-base truncate">{activeClub.name}</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="px-2 py-4">
          <div className="px-2 mb-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              General
            </h3>
          </div>
          
          <Link to={`/club/${clubId}`}>
            <Button
              variant="ghost"
              className="w-full justify-start mb-1 text-sm font-normal"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          
          <Link to={`/club/${clubId}/members`}>
            <Button
              variant="ghost"
              className="w-full justify-start mb-1 text-sm font-normal"
            >
              <Users className="mr-2 h-4 w-4" />
              Members
            </Button>
          </Link>
          
          <div className="px-2 mb-2 mt-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Channels
            </h3>
          </div>
          
          {activeClub.channels.map((channel) => (
            <Button
              key={channel.id}
              variant="ghost"
              className={cn(
                "w-full justify-start mb-1 text-sm font-normal",
                activeChannel?.id === channel.id && "bg-accent text-accent-foreground"
              )}
              onClick={() => setActiveChannel(channel.id)}
            >
              <Hash className="mr-2 h-4 w-4" />
              {channel.name}
            </Button>
          ))}
          
          <div className="px-2 mb-2 mt-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Direct Messages
            </h3>
          </div>
          
          {/* User direct message list would go here, simplified for this version */}
          {activeClub.members
            .filter(memberId => memberId !== currentUser?.id)
            .slice(0, 5) // Limit for simplicity
            .map((memberId, index) => (
              <Link to={`/chat/${memberId}`} key={memberId}>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-1 text-sm font-normal"
                >
                  <User className="mr-2 h-4 w-4" />
                  {`Member ${index + 1}`}
                </Button>
              </Link>
            ))}
          
          {isAdmin && (
            <>
              <div className="px-2 mb-2 mt-4">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </h3>
              </div>
              
              <Link to={`/club/${clubId}/settings`}>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-1 text-sm font-normal"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Club Settings
                </Button>
              </Link>
            </>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
            <AvatarFallback>{currentUser?.name ? getInitials(currentUser.name) : 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium truncate">{currentUser?.name}</p>
            <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubSidebar;
