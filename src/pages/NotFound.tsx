
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full text-center animate-fadeIn">
        <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-clubify-100 text-clubify-600 mb-6">
          <span className="text-5xl font-bold">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Page not found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </Link>
          <Link to="/explore">
            <Button variant="outline" className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Explore Clubs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
