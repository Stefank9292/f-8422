import { PanelLeftClose } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarNavigation() {
  const { toggleSidebar, state } = useSidebar();

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-t border-sidebar-border mt-auto">
        <span className={`text-sm font-medium ${state === 'collapsed' ? 'hidden' : ''}`}>Navigation</span>
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <PanelLeftClose className={`h-4 w-4 transition-transform ${state === 'collapsed' ? 'rotate-180' : ''}`} />
          <span className="sr-only">Toggle Sidebar</span>
        </button>
      </div>
      <button
        onClick={toggleSidebar}
        className={`fixed left-4 bottom-[4.5rem] z-50 p-2 rounded-md bg-background shadow-md hover:bg-accent transition-opacity ${
          state === 'collapsed' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <PanelLeftClose className="h-4 w-4 rotate-180" />
        <span className="sr-only">Open Sidebar</span>
      </button>
    </>
  );
}