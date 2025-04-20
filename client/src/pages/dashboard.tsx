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
import { ChevronLeft, ChevronRight, BookmarkIcon, ClockIcon, SparklesIcon, ZapIcon } from "lucide-react";

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
      <div className="flex items-center justify-between mt-8 mb-4">
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, decks?.length || 0)}
              </span>{" "}
              of <span className="font-medium">{decks?.length || 0}</span> results
            </p>
          </div>
          <div>
            <nav className="flex items-center space-x-1" aria-label="Pagination">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-9 w-9 p-0 rounded-lg"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Page numbers - mobile optimized */}
              {totalPages <= 5 ? (
                // Show all pages if 5 or fewer
                [...Array(totalPages).keys()].map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page + 1)}
                    className={`h-9 w-9 p-0 rounded-lg ${
                      currentPage === page + 1
                        ? "bg-primary border-primary text-white"
                        : "text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {page + 1}
                  </Button>
                ))
              ) : (
                // Show limited pages with ellipsis for 6+ pages
                <>
                  {/* First page */}
                  <Button
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    className={`h-9 w-9 p-0 rounded-lg ${
                      currentPage === 1
                        ? "bg-primary border-primary text-white"
                        : "text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    1
                  </Button>
                  
                  {/* Ellipsis or second page */}
                  {currentPage > 3 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                  
                  {/* Current page range */}
                  {[...Array(totalPages).keys()]
                    .filter(page => {
                      const pageNum = page + 1;
                      if (pageNum === 1 || pageNum === totalPages) return false;
                      return Math.abs(currentPage - pageNum) < 2;
                    })
                    .map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page + 1)}
                        className={`h-9 w-9 p-0 rounded-lg ${
                          currentPage === page + 1
                            ? "bg-primary border-primary text-white"
                            : "text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {page + 1}
                      </Button>
                    ))
                  }
                  
                  {/* Ellipsis or second-to-last page */}
                  {currentPage < totalPages - 2 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                  
                  {/* Last page */}
                  <Button
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    className={`h-9 w-9 p-0 rounded-lg ${
                      currentPage === totalPages
                        ? "bg-primary border-primary text-white"
                        : "text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-9 w-9 p-0 rounded-lg"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Usage stats */}
          <div className="mb-10">
            <UsageStats stats={usageStats} onUpgradeClick={handleUpgradeClick} />
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-50 text-primary">
                  <ZapIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">AI Summaries Used</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {user?.isPro ? 'Unlimited' : `${usageStats.usedSummaries}/${usageStats.summaryLimit}`}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                  <ClockIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Viewed Decks</div>
                  <div className="text-2xl font-bold text-gray-900">{usageStats.viewedDecks}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                  <BookmarkIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Saved Decks</div>
                  <div className="text-2xl font-bold text-gray-900">{usageStats.savedDecks}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pitch Deck Library */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pitch Deck Library</h1>
                <p className="mt-1 text-gray-600">Browse through our collection of curated pitch decks from successful startups.</p>
              </div>
              
              {!user?.isPro && (
                <Button 
                  onClick={handleUpgradeClick}
                  className="bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </Button>
              )}
            </div>
            
            {/* Filters */}
            <FilterBar filters={filters} onFilterChange={handleFilterChange} />
            
            {/* Deck Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
              {isLoadingDecks ? (
                // Loading state
                Array(6).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                    <div className="h-1.5 bg-gray-200 rounded-full w-full mb-4"></div>
                    <div className="flex justify-between mb-4">
                      <div className="h-5 bg-gray-200 rounded-full w-1/3"></div>
                      <div className="h-5 bg-gray-200 rounded-full w-1/4"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-3"></div>
                    <div className="space-y-2 mb-5">
                      <div className="h-4 bg-gray-200 rounded-full"></div>
                      <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-8 bg-gray-200 rounded-full w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded-full w-1/6"></div>
                    </div>
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
                <div className="col-span-3 bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100">
                  <div className="inline-flex items-center justify-center p-3 rounded-xl bg-gray-100 mb-4">
                    <svg className="h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 16h.01M5.2 19.8l1.8-1.8m12 0l1.8 1.8m-15.6-15.6l1.8 1.8m12 0l1.8-1.8M12 2v2m0 16v2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No decks found</h3>
                  <p className="text-gray-500">Try adjusting your filters or check back later for new content.</p>
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
