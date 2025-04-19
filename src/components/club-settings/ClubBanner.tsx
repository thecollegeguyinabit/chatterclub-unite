
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ImageIcon } from 'lucide-react';
import { Club } from '@/types/club';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ClubBannerProps {
  club: Club;
  updateClub: (clubId: string, data: Partial<Club>) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
}

const ClubBanner = ({ club, updateClub, isUploading, setIsUploading }: ClubBannerProps) => {
  const { toast } = useToast();
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${club.id}/banner.${fileExt}`;
      const filePath = `clubs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('club-content')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('club-content')
        .getPublicUrl(filePath);

      await updateClub(club.id, { banner: publicUrl });

      toast({
        title: "Success",
        description: "Club banner updated successfully"
      });
    } catch (error) {
      console.error('Error uploading banner:', error);
      toast({
        title: "Error",
        description: "Failed to update club banner",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFileUpload(file);
  };

  return (
    <div className="space-y-4">
      <Label>Club Banner</Label>
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-32 w-full bg-gray-100 rounded-md overflow-hidden">
          <img 
            src={club.banner || '/placeholder.svg'} 
            alt={club.name} 
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
          onClick={() => bannerInputRef.current?.click()}
          disabled={isUploading}
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          Change Banner
        </Button>
      </div>
    </div>
  );
};

export default ClubBanner;
