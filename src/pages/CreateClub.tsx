import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubify } from '@/context/ClubifyContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload } from 'lucide-react';
import { getClubSampleImage } from '@/integrations/supabase/sample-club-images';

const categories = ['Technology', 'Academic', 'Sports', 'Arts', 'Culture', 'Community Service', 'Professional', 'Other'];

const CreateClub = () => {
  const { createClub } = useClubify();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    avatar: 'https://ui-avatars.com/api/?name=Club',
    banner: '/placeholder.svg'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCategoryChange = (value: string) => {
    const sampleImages = getClubSampleImage(value);
    
    setFormData(prev => ({
      ...prev, 
      category: value,
      avatar: sampleImages.avatar,
      banner: sampleImages.banner
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      createClub({
        ...formData,
        channels: []
      });
      
      toast({
        title: "Club created",
        description: "Your club has been successfully created!"
      });
      
      navigate('/my-clubs');
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating your club. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
      
      <main className="flex-1 pt-16 pb-12">
        <div className="container px-4 md:px-6 py-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8 animate-slideDown">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Create a New Club
            </h1>
            <p className="text-gray-600">
              Start your own club and build a community of like-minded individuals.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-elegant border border-gray-100 overflow-hidden animate-fadeIn">
            <div 
              className="relative h-48 bg-gradient-to-r from-clubify-400 to-clubify-600"
              style={{ 
                backgroundImage: `url(${formData.banner})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-opacity-80">
                  <Button variant="outline" className="bg-white/20 border-white text-white hover:bg-white/30">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Banner
                  </Button>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative -mt-12 md:-mt-20 mx-auto md:mx-0">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                    <AvatarImage src={formData.avatar} alt="Club avatar" />
                    <AvatarFallback>{formData.name ? getInitials(formData.name) : 'C'}</AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full bg-white"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 space-y-6 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="name">Club Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="E.g., Programming Club"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="What is your club about? What activities do you do?"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/my-clubs')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Club'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateClub;
