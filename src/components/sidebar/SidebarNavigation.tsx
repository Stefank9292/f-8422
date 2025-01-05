import { PanelLeftClose } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarNavigation() {
  const { toggleSidebar, state } = useSidebar();

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
        <span className={`text-sm font-medium ${state === 'collapsed' ? 'hidden' : ''}`}>Navigation</span>
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          aria-label={state === 'collapsed' ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <PanelLeftClose 
            className={`h-4 w-4 transition-transform duration-200 ${state === 'collapsed' ? 'rotate-180' : ''}`} 
          />
          <span className="sr-only">Toggle Sidebar</span>
        </button>
      </div>
      {state === 'collapsed' && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-40 p-2 rounded-md bg-background shadow-md hover:bg-accent transition-all duration-200"
          aria-label="Open Sidebar"
        >
          <PanelLeftClose className="h-4 w-4 rotate-180" />
          <span className="sr-only">Open Sidebar</span>
        </button>
      )}
    </>
  );
}