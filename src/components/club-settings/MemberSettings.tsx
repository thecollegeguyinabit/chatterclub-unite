
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Shield, UserMinus } from 'lucide-react';
import { Club } from '@/types/club';

interface MemberSettingsProps {
  club: Club;
  removeMember: (clubId: string, memberId: string) => void;
  promoteMember: (clubId: string, memberId: string) => void;
}

const MemberSettings = ({ club, removeMember, promoteMember }: MemberSettingsProps) => {
  const { toast } = useToast();
  
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [promotingMemberId, setPromotingMemberId] = useState<string | null>(null);
  
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPromotingMemberId(memberId)}
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setDeletingMemberId(memberId)}
                    >
                      <UserMinus className="h-4 w-4 text-destructive" />
                    </Button>
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
  );
};

export default MemberSettings;
