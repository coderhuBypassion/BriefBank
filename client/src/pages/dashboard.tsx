import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DeckCard from "@/components/deck-card";
import FilterBar from "@/components/filter-bar";
import UsageStats from "@/components/usage-stats";
import PaymentModal from "@/components/payment-modal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/clerk";
import { DeckFilters, Deck, UsageStatsType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<DeckFilters>({
    sort: "newest",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const itemsPerPage = 6;

  // Construct query parameters
  const queryParams = new URLSearchParams();
  if (filters.industry) queryParams.append("industry", filters.industry);
  if (filters.stage) queryParams.append("stage", filters.stage);
  if (filters.type) queryParams.append("type", filters.type);
  if (filters.sort) queryParams.append("sort", filters.sort);
  queryParams.append("limit", itemsPerPage.toString());
  queryParams.append("offset", ((currentPage - 1) * itemsPerPage).toString());

  // Fetch decks
  const { data: decks, isLoading: isLoadingDecks } = useQuery<Deck[]>({
    queryKey: [`/api/decks?${queryParams.toString()}`],
    keepPreviousData: true,
  });

  // Fetch user stats
  const { data: viewStats } = useQuery({
    queryKey: ['/api/recent-views'],
    enabled: !!user,
  });

  const { data: savedDecksData } = useQuery({
    queryKey: ['/api/saved-decks'],
    enabled: !!user,
  });

  // Compile usage stats
  const usageStats: UsageStatsType = {
    usedSummaries: user?.usedSummaries || 0,
    summaryLimit: 3, // Free summary limit
    isPro: user?.isPro || false,
    viewedDecks: viewStats?.count || 0,
    savedDecks: savedDecksData?.length || 0,
    weeklyViews: 4, // Placeholder
    weeklySaves: 2, // Placeholder
  };

  const handleFilterChange = (newFilters: DeckFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSaveToggle = async (deckId: number, saved: boolean) => {
    // Invalidate saved decks query to refresh the data
    queryClient.invalidateQueries({ queryKey: ['/api/saved-decks'] });
  };

  const handleUpgradeClick = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Invalidate user data to refresh pro status
    queryClient.invalidateQueries({ queryKey: ['/api/me'] });
    toast({
      title: "Upgrade successful!",
      description: "You now have unlimited access to all pitch deck summaries.",
    });
  };

  // Handle pagination
  const totalPages = Math.ceil((decks?.length || 0) / itemsPerPage);
  
  const renderPagination = () => {
    return (
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-0">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, decks?.length || 0)}
              </span>{" "}
              of <span className="font-medium">{decks?.length || 0}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              {/* Page numbers */}
              {[...Array(totalPages).keys()].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page + 1
                      ? "z-10 bg-primary border-primary text-white"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Usage stats */}
          <div className="px-4 sm:px-0 mb-6">
            <UsageStats stats={usageStats} onUpgradeClick={handleUpgradeClick} />
          </div>
          
          {/* Pitch Deck Library */}
          <div className="px-4 sm:px-0">
            <div className="sm:flex sm:items-center mb-5">
              <div className="sm:flex-auto">
                <h1 className="text-xl font-semibold text-gray-900">Pitch Deck Library</h1>
                <p className="mt-2 text-sm text-gray-700">Browse through our collection of curated pitch decks from successful startups.</p>
              </div>
            </div>
            
            {/* Filters */}
            <FilterBar filters={filters} onFilterChange={handleFilterChange} />
            
            {/* Deck Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {isLoadingDecks ? (
                // Loading state
                Array(6).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
                  </div>
                ))
              ) : decks?.length ? (
                decks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    deck={deck}
                    isPremium={!user?.isPro && user?.usedSummaries >= 3 && !deck.aiSummary}
                    onViewPremium={handleUpgradeClick}
                    onSaveToggle={handleSaveToggle}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-500">No decks found matching your criteria. Try adjusting your filters.</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {decks?.length > 0 && renderPagination()}
          </div>
        </div>
      </main>

      <Footer />
      
      <PaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        onSuccess={handlePaymentSuccess}
        email={user?.email}
      />
    </div>
  );
}
