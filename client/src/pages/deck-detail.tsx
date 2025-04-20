import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PDFViewer from "@/components/pdf-viewer";
import AISummary from "@/components/ai-summary";
import PaymentModal from "@/components/payment-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/clerk";
import { apiRequest } from "@/lib/queryClient";
import { Deck, AISummary as AISummaryType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bookmark, BookmarkCheck, Share2 } from "lucide-react";

interface DeckDetailProps {
  id: string;
}

export default function DeckDetail({ id }: DeckDetailProps) {
  const deckId = parseInt(id);
  const [location, navigate] = useLocation();
  const { user, isSignedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSaved, setIsSaved] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Fetch deck data
  const { data: deck, isLoading: isLoadingDeck } = useQuery<Deck>({
    queryKey: [`/api/deck/${deckId}`],
    enabled: !isNaN(deckId),
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load deck details. Please try again.",
        variant: "destructive",
      });
      navigate("/dashboard");
    },
  });

  // Check if deck is saved
  const { data: savedDecks } = useQuery({
    queryKey: ['/api/saved-decks'],
    enabled: isSignedIn,
    onSuccess: (data) => {
      if (data) {
        setIsSaved(data.some((savedDeck: Deck) => savedDeck.id === deckId));
      }
    },
  });

  // Mutation for generating AI summary
  const generateSummary = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/summarize/${deckId}`);
      if (!res.ok) {
        // Check if the error is due to free limit reached
        if (res.status === 402) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Please upgrade to Pro");
        }
        throw new Error("Failed to generate summary");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/deck/${deckId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      toast({
        title: "Summary generated",
        description: "AI summary has been generated successfully.",
      });
    },
    onError: (error) => {
      if ((error as Error).message.includes("upgrade to Pro")) {
        setIsPaymentModalOpen(true);
      } else {
        toast({
          title: "Error",
          description: (error as Error).message || "Failed to generate summary. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  // Mutation for saving/unsaving deck
  const toggleSave = useMutation({
    mutationFn: async () => {
      if (isSaved) {
        // Unsave deck
        return apiRequest('DELETE', `/api/deck/${deckId}/save`);
      } else {
        // Save deck
        return apiRequest('POST', `/api/deck/${deckId}/save`);
      }
    },
    onSuccess: () => {
      setIsSaved(!isSaved);
      queryClient.invalidateQueries({ queryKey: ['/api/saved-decks'] });
      toast({
        title: isSaved ? "Deck unsaved" : "Deck saved",
        description: isSaved 
          ? "The deck has been removed from your saved items."
          : "The deck has been added to your saved items.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update saved status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const handleSaveToggle = () => {
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save decks",
      });
      return;
    }
    
    toggleSave.mutate();
  };

  const handleShareClick = () => {
    // Copy current URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Deck link has been copied to clipboard.",
    });
  };

  const handleGenerateSummary = () => {
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate summaries",
      });
      return;
    }
    
    generateSummary.mutate();
  };

  const handlePaymentSuccess = () => {
    // Invalidate user data and generate summary after successful payment
    queryClient.invalidateQueries({ queryKey: ['/api/me'] });
    setTimeout(() => {
      generateSummary.mutate();
    }, 1000);
  };

  if (isLoadingDeck) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Deck not found</h2>
            <p className="text-gray-500 mt-2">The requested pitch deck could not be found.</p>
            <Button className="mt-4" onClick={handleBackClick}>
              Back to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={handleBackClick} className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-500" />
              </Button>
              <div className="flex-shrink-0 flex items-center">
                <span className="text-primary font-bold text-xl">BriefBank</span>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSaveToggle}
                disabled={toggleSave.isPending}
                className="ml-4 p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <span className="sr-only">Save</span>
                {isSaved ? (
                  <BookmarkCheck className="h-6 w-6 text-primary" />
                ) : (
                  <Bookmark className="h-6 w-6" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShareClick}
                className="ml-4 p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <span className="sr-only">Share</span>
                <Share2 className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Deck Header */}
          <div className="px-4 sm:px-0 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className={`text-indigo-600 bg-indigo-50`}>
                    {deck.industry}
                  </Badge>
                  <Badge variant="outline" className={`text-amber-600 bg-amber-50`}>
                    {deck.stage}
                  </Badge>
                  {deck.year && (
                    <Badge variant="outline" className="text-gray-600 bg-gray-100">
                      {deck.year}
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{deck.title}</h1>
                <p className="mt-2 text-gray-600 max-w-3xl">
                  {deck.highlights?.join(". ") || `${deck.companyName} pitch deck.`}
                </p>
              </div>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="px-4 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* PDF Viewer */}
              <div className="lg:col-span-8">
                <PDFViewer 
                  fileUrl={deck.fileUrl} 
                  title={deck.title} 
                />
              </div>
              
              {/* AI Summary */}
              <div className="lg:col-span-4">
                {deck.aiSummary ? (
                  <AISummary summary={deck.aiSummary} />
                ) : generateSummary.isPending ? (
                  <AISummary 
                    summary={{
                      summary: [],
                      strengths: [],
                      weaknesses: [],
                      fundingStage: ""
                    }} 
                    isLoading={true} 
                  />
                ) : (
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="bg-primary px-4 py-3">
                      <div className="text-white font-medium">AI Summary</div>
                    </div>
                    <div className="p-6 text-center">
                      <div className="bg-gray-50 p-8 rounded-lg mb-4">
                        <h3 className="text-lg font-semibold mb-2">No AI summary yet</h3>
                        <p className="text-gray-600 mb-4">
                          Generate an AI-powered summary to get insights into this pitch deck.
                          {!user?.isPro && user?.usedSummaries >= 3 && (
                            <span className="block mt-2 text-amber-600">
                              You've used all your free summaries. Upgrade to Pro for unlimited access.
                            </span>
                          )}
                        </p>
                        <Button 
                          onClick={handleGenerateSummary}
                          disabled={generateSummary.isPending}
                          className="w-full"
                        >
                          {generateSummary.isPending ? "Generating..." : "Generate Summary"}
                        </Button>
                      </div>
                      {!user?.isPro && (
                        <div className="text-sm text-gray-500">
                          {user?.usedSummaries >= 3 ? (
                            <Button 
                              variant="link" 
                              className="p-0 h-auto font-normal text-primary"
                              onClick={() => setIsPaymentModalOpen(true)}
                            >
                              Upgrade to Pro
                            </Button>
                          ) : (
                            <span>
                              {3 - (user?.usedSummaries || 0)} free summaries remaining
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
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
