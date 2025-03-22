
import { useState, useEffect } from 'react';
import { useClubify } from '@/context/ClubifyContext';
import Navbar from '@/components/Navbar';
import ClubCard from '@/components/ClubCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Explore = () => {
  const { clubs, userClubs } = useClubify();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [filteredClubs, setFilteredClubs] = useState(clubs);
  
  // Categories derived from the clubs data
  const categories = ['all', ...Array.from(new Set(clubs.map(club => club.category)))];
  
  useEffect(() => {
    let result = clubs;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(club => 
        club.name.toLowerCase().includes(query) || 
        club.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (category !== 'all') {
      result = result.filter(club => club.category === category);
    }
    
    setFilteredClubs(result);
  }, [searchQuery, category, clubs]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="container px-4 md:px-6 py-8">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8 animate-slideDown">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Explore Clubs
            </h1>
            <p className="text-gray-600">
              Discover clubs and organizations across your campus. Find your community and get involved.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative animate-fadeIn">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search clubs by name or description"
                className="pl-10 py-6 rounded-full border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-slideUp" style={{ animationDelay: '100ms' }}>
              <div className="flex-1">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
          
          {filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club, index) => (
                <div 
                  key={club.id} 
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both' 
                  }}
                  className="animate-slideUp"
                >
                  <ClubCard club={club} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 animate-fadeIn">
              <h3 className="text-xl font-medium mb-2">No clubs found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Explore;
