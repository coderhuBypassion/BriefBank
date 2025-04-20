import { AISummary as AISummaryType } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface AISummaryProps {
  summary: AISummaryType;
  isLoading?: boolean;
}

export default function AISummary({ summary, isLoading = false }: AISummaryProps) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow rounded-lg overflow-hidden">
        <CardHeader className="bg-primary px-4 py-3">
          <div className="text-white font-medium flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            AI Summary
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2 mt-6"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2 mt-6"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white shadow rounded-lg overflow-hidden">
      <CardHeader className="bg-primary px-4 py-3">
        <div className="text-white font-medium flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          AI Summary
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Executive Summary</h3>
          <ul className="space-y-2 text-gray-700">
            {summary.summary.map((point, index) => (
              <li key={index} className="flex">
                <span className="text-primary mr-2">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Strengths</h3>
          <ul className="space-y-2 text-gray-700">
            {summary.strengths.map((strength, index) => (
              <li key={index} className="flex">
                <span className="text-green-500 mr-2">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Weaknesses</h3>
          <ul className="space-y-2 text-gray-700">
            {summary.weaknesses.map((weakness, index) => (
              <li key={index} className="flex">
                <span className="text-red-500 mr-2">✗</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Recommended Funding Stage</h3>
          <div className="text-gray-700">
            <p>Based on user traction and business model, this company is well-positioned for <span className="font-semibold text-primary">{summary.fundingStage}</span> funding.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
