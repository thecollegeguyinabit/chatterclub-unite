
import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Camera, ImageIcon, Save } from 'lucide-react';
import { Club } from '@/types/club';

interface GeneralSettingsProps {
  club: Club;
  updateClub: (clubId: string, data: Partial<Club>) => void;
}

const GeneralSettings = ({ club, updateClub }: GeneralSettingsProps) => {
  const { toast } = useToast();
  
  // Local state for form data
  const [clubName, setClubName] = useState(club.name);
  const [clubDescription, setClubDescription] = useState(club.description);
  const [clubAvatar, setClubAvatar] = useState(club.avatar);
  const [clubBanner, setClubBanner] = useState(club.banner);
  
  // Refs for file inputs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
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
  
  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setClubAvatar(event.target.result as string);
        toast({
          title: "Avatar selected",
          description: "Click 'Save Changes' to update your club avatar."
        });
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Handle banner upload
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setClubBanner(event.target.result as string);
        toast({
          title: "Banner selected",
          description: "Click 'Save Changes' to update your club banner."
        });
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Trigger file input click
  const triggerAvatarUpload = () => {
    avatarInputRef.current?.click();
  };
  
  const triggerBannerUpload = () => {
    bannerInputRef.current?.click();
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
            <div className="space-y-4">
              <Label>Club Avatar</Label>
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32 border-2 border-gray-200">
                  <AvatarImage src={clubAvatar} alt={clubName} />
                  <AvatarFallback>{getInitials(clubName)}</AvatarFallback>
                </Avatar>
                <input 
                  type="file" 
                  ref={avatarInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
                <Button variant="outline" size="sm" onClick={triggerAvatarUpload}>
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
                <input 
                  type="file" 
                  ref={bannerInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleBannerUpload}
                />
                <Button variant="outline" size="sm" onClick={triggerBannerUpload}>
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
  );
};

export default GeneralSettings;
