
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Club } from '@/types/club';
import ClubAvatar from './ClubAvatar';
import ClubBanner from './ClubBanner';

interface GeneralSettingsProps {
  club: Club;
  updateClub: (clubId: string, data: Partial<Club>) => void;
}

const GeneralSettings = ({ club, updateClub }: GeneralSettingsProps) => {
  const { toast } = useToast();
  const [clubName, setClubName] = useState(club.name);
  const [clubDescription, setClubDescription] = useState(club.description);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleSaveGeneral = () => {
    updateClub(club.id, {
      name: clubName,
      description: clubDescription
    });
    
    toast({
      title: "Settings saved",
      description: "Your club settings have been updated."
    });
  };
  
  return (
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
            <ClubAvatar 
              club={club}
              updateClub={updateClub}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
            />
            
            <ClubBanner
              club={club}
              updateClub={updateClub}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveGeneral} disabled={isUploading}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
