import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();

  const handleSignIn = () => {
    loginWithRedirect();
  };

  const handleSignUp = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-t-0 rounded-none border-x-0"
    >
      <div className="container px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">Fusion Dev</span>
        </a>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          ) : isAuthenticated ? (
            <>
              <span className="hidden sm:inline-flex text-sm text-muted-foreground">
                {user?.name || user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
                Projects
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="hidden sm:inline-flex" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button size="sm" onClick={handleSignUp}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
