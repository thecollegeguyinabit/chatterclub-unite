
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Globe, MessageSquare, UserPlus } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-background z-0"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-8 md:space-y-12 animate-fadeIn">
              <div className="space-y-4 max-w-[800px]">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                  Connect with College Clubs that <span className="text-clubify-600">Matter</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-[600px] mx-auto">
                  Discover, join, and communicate with clubs on your campus. Build connections and make the most of your college experience.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="rounded-full px-8">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/explore">
                  <Button size="lg" variant="outline" className="rounded-full px-8">
                    Explore Clubs
                  </Button>
                </Link>
              </div>
              
              <div className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-elegant mt-8 md:mt-12">
                <div className="absolute inset-0 bg-gradient-to-tr from-clubify-500/10 to-clubify-500/5"></div>
                <img 
                  src="/placeholder.svg" 
                  alt="Clubify Dashboard Preview" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16 animate-slideDown">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How Clubify Works</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-[800px] mx-auto">
                Designed for college students to easily connect with clubs and organizations on campus
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Globe className="h-8 w-8 text-clubify-600" />,
                  title: "Discover Clubs",
                  description: "Browse through clubs and organizations at your college based on your interests."
                },
                {
                  icon: <UserPlus className="h-8 w-8 text-clubify-600" />,
                  title: "Join Instantly",
                  description: "Request to join clubs with a single click and get notified when you're accepted."
                },
                {
                  icon: <MessageSquare className="h-8 w-8 text-clubify-600" />,
                  title: "Communicate",
                  description: "Chat with club members through channels and direct messages."
                },
                {
                  icon: <Users className="h-8 w-8 text-clubify-600" />,
                  title: "Build Community",
                  description: "Connect with like-minded students and build your college network."
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both' 
                  }}
                >
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-clubify-50 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-clubify-500 to-clubify-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:max-w-[600px]">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to join the community?</h2>
                <p className="mt-4 text-lg text-white/90">
                  Create your account today and start exploring clubs on your campus.
                </p>
              </div>
              
              <div className="flex gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-clubify-600 hover:bg-white/90 rounded-full px-8">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 rounded-full px-8">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t border-gray-200 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <span className="font-heading font-bold text-xl text-clubify-600">Clubify</span>
            </div>
            
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Clubify. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6">
              <Link to="#" className="text-gray-600 hover:text-clubify-600 transition-colors">
                Terms
              </Link>
              <Link to="#" className="text-gray-600 hover:text-clubify-600 transition-colors">
                Privacy
              </Link>
              <Link to="#" className="text-gray-600 hover:text-clubify-600 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
