import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Deck } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/clerk";
import { ChevronRight, Clock, Bookmark, BookmarkCheck, LockIcon, Sparkles } from "lucide-react";

interface DeckCardProps {
  deck: Deck;
  showSaveButton?: boolean;
  isSaved?: boolean;
  onSaveToggle?: (deckId: number, saved: boolean) => void;
  isPremium?: boolean;
  onViewPremium?: (deckId: number) => void;
}

export default function DeckCard({
  deck,
  showSaveButton = true,
  isSaved = false,
  onSaveToggle,
  isPremium = false,
  onViewPremium
}: DeckCardProps) {
  const { isSignedIn } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  // Determine gradient color based on industry
  const getGradient = () => {
    switch (deck.industry) {
      case "SaaS":
        return "from-indigo-500 to-indigo-600";
      case "FinTech":
        return "from-emerald-500 to-emerald-600";
      case "E-commerce":
        return "from-blue-500 to-blue-600";
      case "Health Tech":
        return "from-teal-500 to-teal-600";
      case "EdTech":
        return "from-sky-500 to-sky-600";
      case "Marketplace":
        return "from-amber-500 to-amber-600";
      default:
        return "from-primary to-primary/90";
    }
  };

  // Get badge color based on industry
  const getIndustryColor = () => {
    switch (deck.industry) {
      case "SaaS":
        return "text-indigo-700 bg-indigo-50 border-indigo-100";
      case "FinTech":
        return "text-emerald-700 bg-emerald-50 border-emerald-100";
      case "E-commerce":
        return "text-blue-700 bg-blue-50 border-blue-100";
      case "Health Tech":
        return "text-teal-700 bg-teal-50 border-teal-100";
      case "EdTech":
        return "text-sky-700 bg-sky-50 border-sky-100";
      case "Marketplace":
        return "text-amber-700 bg-amber-50 border-amber-100";
      default:
        return "text-gray-700 bg-gray-50 border-gray-100";
    }
  };

  // Get badge color based on stage
  const getStageColor = () => {
    switch (deck.stage) {
      case "Pre-Seed":
        return "text-gray-700 bg-gray-50 border-gray-100";
      case "Seed":
        return "text-blue-700 bg-blue-50 border-blue-100";
      case "Series A":
        return "text-amber-700 bg-amber-50 border-amber-100";
      case "Series B":
        return "text-purple-700 bg-purple-50 border-purple-100";
      case "Series C+":
        return "text-indigo-700 bg-indigo-50 border-indigo-100";
      default:
        return "text-gray-700 bg-gray-50 border-gray-100";
    }
  };

  // Handle saving/unsaving a deck
  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save decks",
      });
      return;
    }
    
    if (saving) return;
    
    try {
      setSaving(true);
      
      if (saved) {
        // Unsave deck
        await apiRequest("DELETE", `/api/deck/${deck.id}/save`);
        setSaved(false);
        toast({
          title: "Deck removed from saved items",
          description: `"${deck.title}" has been removed from your saved decks.`,
        });
      } else {
        // Save deck
        await apiRequest("POST", `/api/deck/${deck.id}/save`);
        setSaved(true);
        toast({
          title: "Deck saved",
          description: `"${deck.title}" has been added to your saved decks.`,
        });
      }
      
      if (onSaveToggle) {
        onSaveToggle(deck.id, !saved);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update saved decks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle premium content click
  const handlePremiumClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onViewPremium) {
      onViewPremium(deck.id);
    }
  };

  const readTime = Math.floor(Math.random() * 10) + 10; // Simulated read time between 10-20 min

  return (
    <Card className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 card-hover">
      <div className={`h-1.5 bg-gradient-to-r ${getGradient()}`}></div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs font-medium ${getIndustryColor()} px-2.5 py-0.5 rounded-full border`}>
              {deck.industry}
            </span>
            <span className={`text-xs font-medium ${getStageColor()} px-2.5 py-0.5 rounded-full border`}>
              {deck.stage}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {deck.year && (
              <span className="text-xs text-gray-500 font-medium">{deck.year}</span>
            )}
            
            {showSaveButton && (
              <button 
                className={`text-gray-400 hover:text-primary transition-colors duration-200 p-1 rounded-full hover:bg-gray-50`}
                onClick={handleSaveToggle}
                disabled={saving}
              >
                {saved ? (
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2">{deck.title}</h3>
        <p className="text-gray-600 mb-5 text-sm line-clamp-2">
          {deck.companyName} - {deck.highlights?.[0] || "View details for more information"}
        </p>
        
        {isPremium ? (
          <div className="flex flex-col space-y-2">
            <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/70 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <LockIcon className="h-4 w-4 text-amber-600 mr-2" />
                <p className="text-sm font-medium text-amber-800">Premium Content</p>
              </div>
              <p className="text-sm text-amber-700 mb-3">Upgrade to Pro to unlock this premium deck summary.</p>
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium"
                onClick={handlePremiumClick}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <Link href={`/deck/${deck.id}`}>
              <Button 
                variant="ghost" 
                className="px-4 py-2 h-9 text-primary hover:text-primary/90 hover:bg-gray-50 font-medium text-sm rounded-lg flex items-center transition-all duration-200"
              >
                View Details
                <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <div className="flex items-center text-xs text-gray-500 font-medium">
              <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
              {readTime} min read
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
