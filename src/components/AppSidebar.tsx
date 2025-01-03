import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AppSidebar = () => {
  const location = useLocation();
  
  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      return data;
    },
  });

  const isSubscribed = subscriptionStatus?.subscribed;

  const links = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      href: "/profile",
      label: "Profile",
    },
    {
      href: "/settings",
      label: "Settings",
    },
    {
      href: "/subscribe",
      label: isSubscribed ? "Subscribe" : "Upgrade to Premium",
    },
  ];

  return (
    <aside className="h-screen w-[200px] border-r p-4">
      <nav className="space-y-2">
        {links.map((link) => (
          <Button
            key={link.href}
            asChild
            variant={location.pathname === link.href ? "secondary" : "ghost"}
            className={cn("w-full justify-start")}
          >
            <Link to={link.href}>{link.label}</Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
};