import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Deck } from "@/lib/types";
import { 
  ChevronRight, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  LightbulbIcon,
  CheckCircle, 
  XCircle, 
  Zap,
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign
} from "lucide-react";

interface SampleSummaryCardProps {
  deck: Deck;
  onOpenAuthModal?: () => void;
}

export default function SampleSummaryCard({ deck, onOpenAuthModal }: SampleSummaryCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  const readTime = Math.floor(Math.random() * 10) + 10; // Simulated read time between 10-20 min

  return (
    <>
      <Card 
        className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 card-hover cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
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
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">{deck.title}</h3>
          <p className="text-gray-600 mb-5 text-sm line-clamp-2">
            {deck.companyName} - {deck.highlights?.[0] || "View details for more information"}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-primary">
              <Sparkles className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">View AI Summary</span>
            </div>
            <div className="flex items-center text-xs text-gray-500 font-medium">
              <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
              {readTime} min read
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Summary Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl border-0 p-0 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-indigo-600 p-5">
            <div className="flex justify-between items-center text-white">
              <div className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                <DialogTitle className="text-white font-bold text-xl">
                  AI-Powered Summary
                </DialogTitle>
              </div>
              <div className="flex items-center text-xs bg-white/20 px-2 py-1 rounded-full">
                <span className="font-medium">{deck.companyName} • {deck.stage}</span>
              </div>
            </div>
          </div>

          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Deck Title */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{deck.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getIndustryColor()}>
                    {deck.industry}
                  </Badge>
                  <Badge variant="outline" className={getStageColor()}>
                    {deck.stage}
                  </Badge>
                  {deck.year && (
                    <Badge variant="outline" className="text-gray-700 bg-gray-50 border-gray-100">
                      {deck.year}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-50 rounded-full mr-3">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Executive Summary</h3>
                </div>
                <ul className="space-y-3 text-gray-700 pl-4">
                  {deck.aiSummary?.summary.map((point, index) => (
                    <li key={index} className="relative pl-6">
                      <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Strengths */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-50 rounded-full mr-3">
                    <ArrowUpCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Strengths</h3>
                </div>
                <ul className="space-y-3 text-gray-700 pl-4">
                  {deck.aiSummary?.strengths.map((strength, index) => (
                    <li key={index} className="relative pl-6">
                      <CheckCircle className="absolute left-0 top-1 h-4 w-4 text-green-500" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Weaknesses */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-red-50 rounded-full mr-3">
                    <ArrowDownCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Weaknesses</h3>
                </div>
                <ul className="space-y-3 text-gray-700 pl-4">
                  {deck.aiSummary?.weaknesses.map((weakness, index) => (
                    <li key={index} className="relative pl-6">
                      <XCircle className="absolute left-0 top-1 h-4 w-4 text-red-500" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Funding Stage */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-amber-50 rounded-full mr-3">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Funding Recommendation</h3>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200/80">
                  <p className="text-gray-700 font-medium">
                    Based on traction, business model, and market potential, this company is well-positioned for <span className="font-bold text-primary">{deck.aiSummary?.fundingStage}</span> funding.
                  </p>
                </div>
              </div>

              {/* Call to action */}
              <div className="pt-4">
                <Button 
                  className="w-full py-6 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 text-white shadow-md"
                  onClick={() => {
                    setIsModalOpen(false);
                    if (onOpenAuthModal) onOpenAuthModal();
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Sign Up Free to Access More Summaries
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}