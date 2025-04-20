import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UsageStatsType } from "@/lib/types";
import { ChevronRight, TrendingUp } from "lucide-react";

interface UsageStatsProps {
  stats: UsageStatsType;
  onUpgradeClick: () => void;
}

export default function UsageStats({ stats, onUpgradeClick }: UsageStatsProps) {
  const usagePercentage = (stats.usedSummaries / stats.summaryLimit) * 100;
  
  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900">Your BriefBank Usage</h2>
      </div>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <div className="text-gray-500 text-sm">AI Summaries Used</div>
              <div className={`${stats.isPro ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'} px-2 py-0.5 rounded text-xs font-medium`}>
                {stats.isPro ? 'Pro' : 'Free'}
              </div>
            </div>
            <div className="flex items-end">
              <div className="text-2xl font-bold">
                {stats.isPro ? 'Unlimited' : `${stats.usedSummaries}/${stats.summaryLimit}`}
              </div>
              {!stats.isPro && (
                <div className="text-gray-500 text-sm ml-1">free summaries</div>
              )}
            </div>
            
            {!stats.isPro && (
              <>
                <Progress 
                  value={usagePercentage} 
                  className="w-full bg-gray-200 h-2.5 mt-2" 
                />
                <div className="mt-4">
                  <Button 
                    variant="link" 
                    className="text-primary hover:text-indigo-700 text-sm font-medium p-0 h-auto flex items-center"
                    onClick={onUpgradeClick}
                  >
                    Upgrade to Pro
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-gray-500 text-sm mb-1">Viewed Decks</div>
            <div className="text-2xl font-bold">{stats.viewedDecks}</div>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span>{stats.weeklyViews} this week</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-gray-500 text-sm mb-1">Saved Decks</div>
            <div className="text-2xl font-bold">{stats.savedDecks}</div>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span>{stats.weeklySaves} this week</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
