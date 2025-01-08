export const AuthHeader = ({ view }: { view: "sign_in" | "sign_up" }) => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
        Welcome to VyralSearch
      </h1>
      <p className="text-muted-foreground">
        {view === "sign_in" ? "Sign in to your account" : "Create a new account"}
      </p>
    </div>
  );
};