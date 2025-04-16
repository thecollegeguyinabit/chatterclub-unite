
import { useParams } from 'react-router-dom';
import { useClubify } from '@/context/ClubifyContext';
import Navbar from '@/components/Navbar';
import ClubSidebar from '@/components/ClubSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Crown, Shield, User } from 'lucide-react';

const ClubMembers = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { clubs, currentUser } = useClubify();
  
  const club = clubs.find(c => c.id === clubId);
  
  if (!club) {
    return <div>Club not found</div>;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 flex">
        <ClubSidebar />
        
        <div className="flex-1 p-6">
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold">Club Members</h1>
              <p className="text-gray-500">{club.members.length} members</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Join Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {club.members.map((memberId, index) => (
                    <TableRow key={memberId}>
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://ui-avatars.com/api/?name=Member+${index + 1}`} />
                          <AvatarFallback>{`M${index + 1}`}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {memberId === club.admin ? 'Club Admin' : `Member ${index + 1}`}
                          </p>
                          <p className="text-sm text-gray-500">@username{index + 1}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {memberId === club.admin ? (
                            <>
                              <Crown className="h-4 w-4 text-yellow-500" />
                              <span>Admin</span>
                            </>
                          ) : (
                            <>
                              <User className="h-4 w-4 text-gray-500" />
                              <span>Member</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(club.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ClubMembers;
