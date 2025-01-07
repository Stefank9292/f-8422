interface SidebarToolsProps {
  currentPath: string;
  subscriptionStatus?: any;
}

export function SidebarTools({ currentPath, subscriptionStatus }: SidebarToolsProps) {
  return (
    <div className="px-2 py-2">
      <span className="text-[11px] text-sidebar-foreground/70 px-2">Tools</span>
    </div>
  );
}