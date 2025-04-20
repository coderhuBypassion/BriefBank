import { AISummary as AISummaryType } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Zap, CheckCircle, XCircle, DollarSign } from "lucide-react";

interface AISummaryProps {
  summary: AISummaryType;
  isLoading?: boolean;
}

export default function AISummary({ summary, isLoading = false }: AISummaryProps) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
        <CardHeader className="bg-gradient-to-r from-primary to-indigo-600 p-5">
          <div className="text-white font-bold flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            AI-Powered Summary
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-5">
            <div className="flex items-center mb-3">
              <div className="h-8 w-8 bg-gray-200 rounded-full mr-3"></div>
              <div className="h-5 bg-gray-200 rounded-full w-1/3"></div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded-full"></div>
              <div className="h-3 bg-gray-200 rounded-full"></div>
              <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
            </div>
            
            <div className="flex items-center mb-3 mt-6">
              <div className="h-8 w-8 bg-gray-200 rounded-full mr-3"></div>
              <div className="h-5 bg-gray-200 rounded-full w-1/3"></div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded-full"></div>
              <div className="h-3 bg-gray-200 rounded-full"></div>
              <div className="h-3 bg-gray-200 rounded-full w-4/6"></div>
            </div>
            
            <div className="flex items-center mb-3 mt-6">
              <div className="h-8 w-8 bg-gray-200 rounded-full mr-3"></div>
              <div className="h-5 bg-gray-200 rounded-full w-1/3"></div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded-full"></div>
              <div className="h-3 bg-gray-200 rounded-full"></div>
              <div className="h-3 bg-gray-200 rounded-full w-3/6"></div>
            </div>
            
            <div className="flex items-center mb-3 mt-6">
              <div className="h-8 w-8 bg-gray-200 rounded-full mr-3"></div>
              <div className="h-5 bg-gray-200 rounded-full w-1/3"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded-full w-2/3 mt-2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
      <CardHeader className="bg-gradient-to-r from-primary to-indigo-600 p-5">
        <div className="text-white font-bold flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            AI-Powered Summary
          </div>
          <div className="text-xs font-normal flex items-center bg-white/20 text-white px-2 py-1 rounded-full">
            Analyzed by GPT-4o
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Executive Summary */}
          <div>
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-50 rounded-full mr-3">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Executive Summary</h3>
            </div>
            <ul className="space-y-3 text-gray-700 pl-4">
              {summary.summary.map((point, index) => (
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
              {summary.strengths.map((strength, index) => (
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
              {summary.weaknesses.map((weakness, index) => (
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
                Based on traction, business model, and market potential, this company is well-positioned for <span className="font-bold text-primary">{summary.fundingStage}</span> funding.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
