
import { useClubify, Club } from '@/context/ClubifyContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ClubCardProps {
  club: Club;
  variant?: 'default' | 'compact';
}

const ClubCard = ({ club, variant = 'default' }: ClubCardProps) => {
  const { currentUser, joinClub, userClubs } = useClubify();
  
  const isJoined = userClubs.some(c => c.id === club.id);
  
  // Check if the current user is a member of this club
  const isMember = club.members.includes(currentUser?.id || '');
  
  const handleJoinClub = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    joinClub(club.id);
  };
  
  if (variant === 'compact') {
    return (
      <Link to={`/club/${club.id}`}>
        <Card className="h-full overflow-hidden hover:shadow-md transition-all border border-gray-100 hover:border-gray-200">
          <div className="flex items-center p-4 gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src={club.avatar} 
                alt={club.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{club.name}</h3>
              <p className="text-xs text-gray-500 truncate">{club.description}</p>
            </div>
          </div>
        </Card>
      </Link>
    );
  }
  
  return (
    <Link to={`/club/${club.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 ease-in-out border border-gray-100 hover:border-gray-200">
        <div className="relative h-36 overflow-hidden bg-gray-100">
          <img 
            src={club.banner || '/placeholder.svg'} 
            alt={club.name} 
            className="w-full h-full object-cover transition-all"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800 hover:bg-white/80">
            {club.category}
          </Badge>
        </div>
        
        <CardHeader className="relative pt-0 pb-2">
          <div className="flex items-center gap-3 -mt-6">
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white bg-white shadow-sm">
              <img 
                src={club.avatar} 
                alt={club.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="font-semibold mt-4">{club.name}</h3>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 pb-4">
          <p className="text-sm text-gray-600 line-clamp-2">{club.description}</p>
          
          <div className="flex items-center gap-1 mt-3">
            <Users className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">{club.members.length} members</span>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 pb-4">
          {isMember ? (
            <Button size="sm" variant="outline" className="w-full">
              View Club
            </Button>
          ) : (
            <Button size="sm" className="w-full" onClick={handleJoinClub}>
              Join Club
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ClubCard;
