import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UsageStatsType } from "@/lib/types";
import { ChevronRight, TrendingUp, Sparkles, Zap } from "lucide-react";

interface UsageStatsProps {
  stats: UsageStatsType;
  onUpgradeClick: () => void;
}

export default function UsageStats({ stats, onUpgradeClick }: UsageStatsProps) {
  const usagePercentage = (stats.usedSummaries / stats.summaryLimit) * 100;
  
  return (
    <Card className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50 px-6 py-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Your BriefBank Account</h2>
          {stats.isPro ? (
            <div className="flex items-center bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Pro Account
            </div>
          ) : (
            <Button 
              onClick={onUpgradeClick}
              className="bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 text-white rounded-xl px-4 shadow-sm transition-all duration-200"
              size="sm"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Upgrade to Pro
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-6 pt-6 pb-7">
        <div className="flex flex-col space-y-6">
          {/* AI Summary Usage */}
          {!stats.isPro && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100/50">
              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-white shadow-sm border border-blue-100/80 mr-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                    <div>
                      <h3 className="text-gray-900 font-medium">AI Summary Usage</h3>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {stats.usedSummaries === stats.summaryLimit 
                          ? "You've used all your free summaries" 
                          : `${stats.summaryLimit - stats.usedSummaries} free summaries remaining`}
                      </p>
                    </div>
                    <div className="flex items-center text-sm font-medium">
                      <span className="text-gray-800">{stats.usedSummaries}/{stats.summaryLimit}</span>
                    </div>
                  </div>
                  
                  <Progress 
                    value={usagePercentage} 
                    className={`w-full bg-blue-100/80 h-2 rounded-full ${
                      usagePercentage >= 80 
                        ? 'text-orange-500' 
                        : 'text-primary'
                    }`}
                  />
                  
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Upgrade to Pro for <span className="font-semibold">unlimited summaries</span>
                    </p>
                    <Button 
                      onClick={onUpgradeClick}
                      className="bg-white text-primary hover:bg-gray-50 border border-gray-200 shadow-sm font-medium text-sm rounded-lg"
                      size="sm"
                    >
                      Upgrade Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600 font-medium">View Statistics</div>
                <div className="flex items-center text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className="font-medium">{stats.weeklyViews} new</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.viewedDecks}</div>
              <div className="text-sm text-gray-500">Total deck views</div>
            </div>
            
            <div className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600 font-medium">Saved Decks</div>
                <div className="flex items-center text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className="font-medium">{stats.weeklySaves} new</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.savedDecks}</div>
              <div className="text-sm text-gray-500">Total saved decks</div>
            </div>
          </div>
          
          {/* Pro Features */}
          {stats.isPro && (
            <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-100/30">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <h3 className="text-gray-900 font-medium">Pro Features Active</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Unlimited AI Summaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Advanced Filtering</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Priority Support</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
