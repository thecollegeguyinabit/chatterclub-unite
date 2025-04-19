
import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Camera, ImageIcon } from 'lucide-react';
import { Club } from '@/types/club';
import { supabase } from '@/integrations/supabase/client';

interface GeneralSettingsProps {
  club: Club;
  updateClub: (clubId: string, data: Partial<Club>) => void;
}

const GeneralSettings = ({ club, updateClub }: GeneralSettingsProps) => {
  const { toast } = useToast();
  
  // Local state for form data
  const [clubName, setClubName] = useState(club.name);
  const [clubDescription, setClubDescription] = useState(club.description);
  const [isUploading, setIsUploading] = useState(false);
  
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

  const handleFileUpload = async (file: File, type: 'avatar' | 'banner') => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${club.id}/${type}.${fileExt}`;
      const filePath = `clubs/${fileName}`;

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('club-content')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('club-content')
        .getPublicUrl(filePath);

      // Update club with new image URL
      await updateClub(club.id, {
        [type]: publicUrl
      });

      toast({
        title: "Success",
        description: `Club ${type} updated successfully`
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: `Failed to update club ${type}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFileUpload(file, 'avatar');
  };
  
  // Handle banner upload
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFileUpload(file, 'banner');
  };
  
  // Trigger file input click
  const triggerAvatarUpload = () => avatarInputRef.current?.click();
  const triggerBannerUpload = () => bannerInputRef.current?.click();
  
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
            <div className="space-y-4">
              <Label>Club Avatar</Label>
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32 border-2 border-gray-200">
                  <AvatarImage src={club.avatar} alt={clubName} />
                  <AvatarFallback>{getInitials(clubName)}</AvatarFallback>
                </Avatar>
                <input 
                  type="file" 
                  ref={avatarInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={triggerAvatarUpload}
                  disabled={isUploading}
                >
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
                    src={club.banner || '/placeholder.svg'} 
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={triggerBannerUpload}
                  disabled={isUploading}
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Change Banner
                </Button>
              </div>
            </div>
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
