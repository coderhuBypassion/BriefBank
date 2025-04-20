import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DeckFilters, industries, stages, deckTypes } from "@/lib/types";

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
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Select
              value={filters.industry || "all"}
              onValueChange={handleIndustryChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {deckTypes.map((type) => (
                  <SelectItem key={type} value={type}>
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort: Newest First" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Sort: Newest First</SelectItem>
                <SelectItem value="oldest">Sort: Oldest First</SelectItem>
                <SelectItem value="a-z">Sort: A-Z</SelectItem>
                <SelectItem value="z-a">Sort: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
