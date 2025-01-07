import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  onSearch: (username: string, numberOfVideos: number, selectedDate?: Date) => void;
  onBulkSearch: () => void;
  isLoading: boolean;
}

export function SearchInput({ onSearch, onBulkSearch, isLoading }: SearchInputProps) {
  const [username, setUsername] = useState("");
  const [numberOfVideos, setNumberOfVideos] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username) {
      onSearch(username, numberOfVideos, undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Enter Instagram username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button type="submit" disabled={isLoading}>
        Search
      </Button>
      <Button type="button" variant="outline" onClick={onBulkSearch}>
        Bulk Search
      </Button>
    </form>
  );
}