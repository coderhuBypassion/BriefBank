import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DeckFilters, industries, stages, deckTypes } from "@/lib/types";
import { BadgePercent, Building2, Layers3, SortAsc } from "lucide-react";

interface FilterBarProps {
  filters: DeckFilters;
  onFilterChange: (newFilters: DeckFilters) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const handleIndustryChange = (value: string) => {
    onFilterChange({ ...filters, industry: value === "all" ? undefined : value });
  };

  const handleStageChange = (value: string) => {
    onFilterChange({ ...filters, stage: value === "all" ? undefined : value });
  };

  const handleTypeChange = (value: string) => {
    onFilterChange({ ...filters, type: value === "all" ? undefined : value });
  };

  const handleSortChange = (value: string) => {
    onFilterChange({ 
      ...filters, 
      sort: value as "newest" | "oldest" | "a-z" | "z-a" 
    });
  };

  return (
    <Card className="mb-6 rounded-xl shadow-sm border border-gray-100">
      <CardContent className="p-5">
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Select
              value={filters.industry || "all"}
              onValueChange={handleIndustryChange}
            >
              <SelectTrigger className="w-[190px] rounded-lg border-gray-200 bg-white focus:ring-primary focus:ring-offset-0 focus:ring-opacity-50 shadow-sm">
                <div className="flex items-center">
                  <Building2 className="mr-2 h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="All Industries" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-md border-gray-200 bg-white">
                <SelectItem value="all" className="focus:bg-gray-50">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry} className="focus:bg-gray-50">
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative">
            <Select
              value={filters.stage || "all"}
              onValueChange={handleStageChange}
            >
              <SelectTrigger className="w-[190px] rounded-lg border-gray-200 bg-white focus:ring-primary focus:ring-offset-0 focus:ring-opacity-50 shadow-sm">
                <div className="flex items-center">
                  <BadgePercent className="mr-2 h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="All Stages" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-md border-gray-200 bg-white">
                <SelectItem value="all" className="focus:bg-gray-50">All Stages</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage} className="focus:bg-gray-50">
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative">
            <Select
              value={filters.type || "all"}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger className="w-[190px] rounded-lg border-gray-200 bg-white focus:ring-primary focus:ring-offset-0 focus:ring-opacity-50 shadow-sm">
                <div className="flex items-center">
                  <Layers3 className="mr-2 h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="All Types" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-md border-gray-200 bg-white">
                <SelectItem value="all" className="focus:bg-gray-50">All Types</SelectItem>
                {deckTypes.map((type) => (
                  <SelectItem key={type} value={type} className="focus:bg-gray-50">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative ml-auto">
            <Select
              value={filters.sort || "newest"}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[190px] rounded-lg border-gray-200 bg-white focus:ring-primary focus:ring-offset-0 focus:ring-opacity-50 shadow-sm">
                <div className="flex items-center">
                  <SortAsc className="mr-2 h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="Sort: Newest First" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-md border-gray-200 bg-white">
                <SelectItem value="newest" className="focus:bg-gray-50">
                  Newest First
                </SelectItem>
                <SelectItem value="oldest" className="focus:bg-gray-50">
                  Oldest First
                </SelectItem>
                <SelectItem value="a-z" className="focus:bg-gray-50">
                  A-Z
                </SelectItem>
                <SelectItem value="z-a" className="focus:bg-gray-50">
                  Z-A
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
