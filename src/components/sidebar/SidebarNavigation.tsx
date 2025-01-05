import { useSidebar } from "@/components/ui/sidebar";

export function SidebarNavigation() {
  const { state } = useSidebar();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
      <span className={`text-sm font-medium transition-opacity duration-200 ${state === 'collapsed' ? 'opacity-0' : 'opacity-100'}`}>
        Navigation
      </span>
    </div>
  );
}