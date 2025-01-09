interface SearchErrorProps {
  error: Error;
}

export const SearchError = ({ error }: SearchErrorProps) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
      <p className="text-lg text-destructive">An error occurred while searching</p>
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  );
};