import React, { useState } from "react";
import { motion } from "framer-motion";
import CompetitionGrid from "./CompetitionGrid";
import FilterBar from "./FilterBar";

interface FilterOptions {
  category: string;
  prizeValue: string;
  endDate: string;
  difficulty: string;
}

const Home = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    prizeValue: "all",
    endDate: "all",
    difficulty: "all",
  });

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: "all",
      prizeValue: "all",
      endDate: "all",
      difficulty: "all",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-7xl"
      >
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Competition Directory
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl">
            Discover and participate in the best trade promotions, contests, and
            sweepstakes currently active.
          </p>
        </header>

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        <main className="mt-8">
          <CompetitionGrid filters={filters} />
        </main>

        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500">
          <p>
            © {new Date().getFullYear()} Competition Directory. All rights
            reserved.
          </p>
        </footer>
      </motion.div>
    </div>
  );
};

export default Home;
