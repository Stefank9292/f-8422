const HelpCenter = () => {
  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-3xl mx-auto space-y-8 pt-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight">Help Center</h1>
          <p className="text-[13px] text-muted-foreground">
            Get help with VyralSearch and learn how to make the most of our features
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded-lg space-y-2">
            <h2 className="text-base font-medium">Getting Started</h2>
            <p className="text-[11px] text-muted-foreground">
              Learn the basics of using VyralSearch and start finding viral content
            </p>
          </div>

          <div className="p-4 border rounded-lg space-y-2">
            <h2 className="text-base font-medium">Search Tips</h2>
            <p className="text-[11px] text-muted-foreground">
              Advanced search techniques to find exactly what you're looking for
            </p>
          </div>

          <div className="p-4 border rounded-lg space-y-2">
            <h2 className="text-base font-medium">Account Management</h2>
            <p className="text-[11px] text-muted-foreground">
              Learn how to manage your account settings and subscription
            </p>
          </div>

          <div className="p-4 border rounded-lg space-y-2">
            <h2 className="text-base font-medium">Troubleshooting</h2>
            <p className="text-[11px] text-muted-foreground">
              Solutions to common issues and technical problems
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;