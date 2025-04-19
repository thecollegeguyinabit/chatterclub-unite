
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';
import { Club } from '@/types/club';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ClubAvatarProps {
  club: Club;
  updateClub: (clubId: string, data: Partial<Club>) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
}

const ClubAvatar = ({ club, updateClub, isUploading, setIsUploading }: ClubAvatarProps) => {
  const { toast } = useToast();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${club.id}/avatar.${fileExt}`;
      const filePath = `clubs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('club-content')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('club-content')
        .getPublicUrl(filePath);

      await updateClub(club.id, { avatar: publicUrl });

      toast({
        title: "Success",
        description: "Club avatar updated successfully"
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to update club avatar",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFileUpload(file);
  };

  return (
    <div className="space-y-4">
      <Label>Club Avatar</Label>
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-32 w-32 border-2 border-gray-200">
          <AvatarImage src={club.avatar} alt={club.name} />
          <AvatarFallback>{getInitials(club.name)}</AvatarFallback>
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
          onClick={() => avatarInputRef.current?.click()}
          disabled={isUploading}
        >
          <Camera className="mr-2 h-4 w-4" />
          Change Avatar
        </Button>
      </div>
    </div>
  );
};

export default ClubAvatar;
