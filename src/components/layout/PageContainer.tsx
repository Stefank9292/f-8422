import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn(
      "container min-h-screen py-8 md:py-12 space-y-8",
      className
    )}>
      {children}
    </div>
  );
};