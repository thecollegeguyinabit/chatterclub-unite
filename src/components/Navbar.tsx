
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/explore' },
    { name: 'My Clubs', href: '/my-clubs' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const userDisplayName = user?.user_metadata?.name || '';
  const userEmail = user?.email || '';
  const userAvatar = user?.user_metadata?.avatar_url || '';
  const isAuthenticated = !!user;

  return (
    <header className="w-full fixed top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading font-bold text-2xl text-clubify-600 transition-all hover:text-clubify-700">
              Clubify
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-gray-700 hover:text-clubify-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-4">
                <Link to="/chat">
                  <Button variant="ghost" className="text-sm">
                    Messages
                  </Button>
                </Link>
                <Link to="/create-club">
                  <Button size="sm" variant="outline" className="rounded-full px-4">
                    Create Club
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-gray-200">
                    <AvatarImage src={userAvatar} alt={userDisplayName} />
                    <AvatarFallback>{userDisplayName ? getInitials(userDisplayName) : 'U'}</AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => signOut()}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-6 mt-6">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={userAvatar} alt={userDisplayName} />
                        <AvatarFallback>{userDisplayName ? getInitials(userDisplayName) : 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{userDisplayName}</span>
                        <span className="text-sm text-gray-500">{userEmail}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.href}
                          onClick={() => setIsOpen(false)}
                          className="block py-2 text-gray-700 hover:text-clubify-600 transition-colors"
                        >
                          {link.name}
                        </Link>
                      ))}
                      <Link
                        to="/chat"
                        onClick={() => setIsOpen(false)}
                        className="block py-2 text-gray-700 hover:text-clubify-600 transition-colors"
                      >
                        Messages
                      </Link>
                      <Link
                        to="/create-club"
                        onClick={() => setIsOpen(false)}
                        className="block py-2 text-gray-700 hover:text-clubify-600 transition-colors"
                      >
                        Create Club
                      </Link>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
              
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                  <div className="flex flex-col h-full pt-8">
                    <div className="space-y-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.href}
                          onClick={() => setIsOpen(false)}
                          className="block py-2 text-gray-700 hover:text-clubify-600 transition-colors"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t flex flex-col gap-2">
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
