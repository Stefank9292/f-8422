import { SearchHistoryLocked } from "./SearchHistoryLocked";
import { SearchHistoryContent } from "./SearchHistoryContent";
import { SearchHistoryLoading } from "./SearchHistoryLoading";
import { useSearchHistoryAccess } from "./useSearchHistoryAccess";

export function SearchHistoryList() {
  const { session, hasAccess } = useSearchHistoryAccess();

  if (!hasAccess) {
    return <SearchHistoryLocked />;
  }

  if (!session?.user.id) {
    return <SearchHistoryLoading />;
  }

  return <SearchHistoryContent userId={session.user.id} />;
}