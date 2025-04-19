
import React, { useRef } from 'react';
import { Avatar as UIAvatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Camera } from 'lucide-react';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16'
};

export const Avatar: React.FC<AvatarProps> = ({ size = 'md', editable = false }) => {
  const { user } = useAuth();
  const { profile, uploadAvatar } = useProfile(user?.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
    }
  };

  const getFallbackInitials = () => {
    return user?.email?.charAt(0).toUpperCase() || '?';
  };

  return (
    <div className="relative inline-block">
      <UIAvatar className={sizeClasses[size]}>
        <AvatarImage src={profile?.avatar_url || undefined} />
        <AvatarFallback>{getFallbackInitials()}</AvatarFallback>
      </UIAvatar>
      
      {editable && (
        <>
          <Button
            size="icon"
            variant="ghost"
            className="absolute bottom-0 right-0 rounded-full p-1 bg-background/80 hover:bg-background"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </>
      )}
    </div>
  );
};
