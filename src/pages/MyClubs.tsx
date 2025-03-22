
import { Link } from 'react-router-dom';
import { useClubify } from '@/context/ClubifyContext';
import Navbar from '@/components/Navbar';
import ClubCard from '@/components/ClubCard';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

const MyClubs = () => {
  const { userClubs } = useClubify();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="container px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-slideDown">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                My Clubs
              </h1>
              <p className="text-gray-600">
                Clubs you've joined or created
              </p>
            </div>
            
            <div className="flex gap-4">
              <Link to="/explore">
                <Button variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Explore Clubs
                </Button>
              </Link>
              <Link to="/create-club">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Club
                </Button>
              </Link>
            </div>
          </div>
          
          {userClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userClubs.map((club, index) => (
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
            <div className="text-center py-16 animate-fadeIn">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-clubify-50 text-clubify-600 mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium mb-2">You haven't joined any clubs yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Explore clubs on your campus and join the ones that interest you, or create your own!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/explore">
                  <Button variant="outline" size="lg">
                    Explore Clubs
                  </Button>
                </Link>
                <Link to="/create-club">
                  <Button size="lg">
                    Create a Club
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyClubs;
