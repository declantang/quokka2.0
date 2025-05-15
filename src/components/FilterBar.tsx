import React, { useState } from "react";
import { Check, ChevronDown, Filter, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface FilterBarProps {
  onFilterChange?: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  category: string;
  prizeValue: string;
  endDate: string;
  difficulty: string;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange = () => {} }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    category: "",
    prizeValue: "",
    endDate: "",
    difficulty: "",
  });

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetValues = {
      category: "",
      prizeValue: "",
      endDate: "",
      difficulty: "",
    };
    setFilters(resetValues);
    onFilterChange(resetValues);
  };

  const categories = [
    { value: "sweepstakes", label: "Sweepstakes" },
    { value: "contests", label: "Contests" },
    { value: "giveaways", label: "Giveaways" },
    { value: "promotions", label: "Promotions" },
  ];

  const prizeValues = [
    { value: "under100", label: "Under $100" },
    { value: "100to500", label: "$100 - $500" },
    { value: "500to1000", label: "$500 - $1,000" },
    { value: "1000to5000", label: "$1,000 - $5,000" },
    { value: "over5000", label: "Over $5,000" },
  ];

  const endDates = [
    { value: "today", label: "Ending Today" },
    { value: "thisWeek", label: "This Week" },
    { value: "thisMonth", label: "This Month" },
    { value: "nextMonth", label: "Next Month" },
  ];

  const difficulties = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Desktop/Tablet Filter Bar
  const DesktopFilterBar = () => (
    <div className="hidden sm:flex items-center justify-between w-full p-4 bg-background rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="w-[180px] bg-background shadow-inner">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.prizeValue}
          onValueChange={(value) => handleFilterChange("prizeValue", value)}
        >
          <SelectTrigger className="w-[180px] bg-background shadow-inner">
            <SelectValue placeholder="Prize Value" />
          </SelectTrigger>
          <SelectContent>
            {prizeValues.map((prize) => (
              <SelectItem key={prize.value} value={prize.value}>
                {prize.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.endDate}
          onValueChange={(value) => handleFilterChange("endDate", value)}
        >
          <SelectTrigger className="w-[180px] bg-background shadow-inner">
            <SelectValue placeholder="End Date" />
          </SelectTrigger>
          <SelectContent>
            {endDates.map((date) => (
              <SelectItem key={date.value} value={date.value}>
                {date.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.difficulty}
          onValueChange={(value) => handleFilterChange("difficulty", value)}
        >
          <SelectTrigger className="w-[180px] bg-background shadow-inner">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((difficulty) => (
              <SelectItem key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          onClick={resetFilters}
          className="flex items-center gap-1"
        >
          <X size={16} />
          Clear Filters
        </Button>
      )}
    </div>
  );

  // Mobile Filter Button and Sheet
  const MobileFilterBar = () => (
    <div className="sm:hidden w-full p-4 bg-background rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filter Competitions</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Category</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.value}
                      variant={
                        filters.category === category.value
                          ? "default"
                          : "outline"
                      }
                      className="justify-start"
                      onClick={() =>
                        handleFilterChange("category", category.value)
                      }
                    >
                      {filters.category === category.value && (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      {category.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Prize Value</h3>
                <div className="grid grid-cols-2 gap-2">
                  {prizeValues.map((prize) => (
                    <Button
                      key={prize.value}
                      variant={
                        filters.prizeValue === prize.value
                          ? "default"
                          : "outline"
                      }
                      className="justify-start"
                      onClick={() =>
                        handleFilterChange("prizeValue", prize.value)
                      }
                    >
                      {filters.prizeValue === prize.value && (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      {prize.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">End Date</h3>
                <div className="grid grid-cols-2 gap-2">
                  {endDates.map((date) => (
                    <Button
                      key={date.value}
                      variant={
                        filters.endDate === date.value ? "default" : "outline"
                      }
                      className="justify-start"
                      onClick={() => handleFilterChange("endDate", date.value)}
                    >
                      {filters.endDate === date.value && (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      {date.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Difficulty</h3>
                <div className="grid grid-cols-3 gap-2">
                  {difficulties.map((difficulty) => (
                    <Button
                      key={difficulty.value}
                      variant={
                        filters.difficulty === difficulty.value
                          ? "default"
                          : "outline"
                      }
                      className="justify-start"
                      onClick={() =>
                        handleFilterChange("difficulty", difficulty.value)
                      }
                    >
                      {filters.difficulty === difficulty.value && (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      {difficulty.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    resetFilters();
                    setIsFilterSheetOpen(false);
                  }}
                >
                  Clear All Filters
                </Button>
                <Button
                  className="w-full mt-2"
                  onClick={() => setIsFilterSheetOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active filter pills for mobile */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.category && (
            <div className="bg-muted rounded-full px-3 py-1 text-xs flex items-center gap-1">
              {categories.find((c) => c.value === filters.category)?.label}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => handleFilterChange("category", "")}
              />
            </div>
          )}
          {filters.prizeValue && (
            <div className="bg-muted rounded-full px-3 py-1 text-xs flex items-center gap-1">
              {prizeValues.find((p) => p.value === filters.prizeValue)?.label}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => handleFilterChange("prizeValue", "")}
              />
            </div>
          )}
          {filters.endDate && (
            <div className="bg-muted rounded-full px-3 py-1 text-xs flex items-center gap-1">
              {endDates.find((d) => d.value === filters.endDate)?.label}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => handleFilterChange("endDate", "")}
              />
            </div>
          )}
          {filters.difficulty && (
            <div className="bg-muted rounded-full px-3 py-1 text-xs flex items-center gap-1">
              {difficulties.find((d) => d.value === filters.difficulty)?.label}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => handleFilterChange("difficulty", "")}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full bg-background">
      <DesktopFilterBar />
      <MobileFilterBar />
    </div>
  );
};

export default FilterBar;
