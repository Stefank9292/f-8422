import { PanelLeftClose } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarNavigation() {
  const { toggleSidebar, state } = useSidebar();

  return (
    <>
      <div className="flex items-center justify-center px-4 py-3 border-b border-sidebar-border">
        <span className={`text-sm font-medium transition-opacity duration-200 ${state === 'collapsed' ? 'opacity-0' : 'opacity-100'}`}>
          Navigation
        </span>
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ml-auto"
          aria-label={state === 'collapsed' ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <PanelLeftClose 
            className={`h-4 w-4 transition-transform duration-200 ${state === 'collapsed' ? 'rotate-180' : ''}`} 
          />
          <span className="sr-only">Toggle Sidebar</span>
        </button>
      </div>
      <button
        onClick={toggleSidebar}
        className={`fixed left-4 top-4 z-40 p-2 rounded-md bg-background shadow-md hover:bg-accent transition-all duration-200 ${
          state === 'collapsed' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Open Sidebar"
      >
        <PanelLeftClose className="h-4 w-4 rotate-180" />
        <span className="sr-only">Open Sidebar</span>
      </button>
    </>
  );
}