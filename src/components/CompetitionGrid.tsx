import React, { useState } from "react";
import { motion } from "framer-motion";
import CompetitionCard from "./CompetitionCard";
import FilterBar from "./FilterBar";

interface Competition {
  id: string;
  title: string;
  imageUrl: string;
  deadline: string;
  prizeValue: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  requirements: string;
  rules: string;
}

interface CompetitionGridProps {
  competitions?: Competition[];
}

const CompetitionGrid = ({ competitions = [] }: CompetitionGridProps) => {
  const [filters, setFilters] = useState({
    category: "",
    prizeRange: "",
    endDate: "",
    difficulty: "",
  });

  // Default competitions if none are provided
  const defaultCompetitions: Competition[] = [
    {
      id: "1",
      title: "Photography Contest",
      imageUrl:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
      deadline: "2023-12-31",
      prizeValue: "$5,000",
      category: "Creative",
      difficulty: "Medium",
      requirements:
        'Submit a high-resolution photograph that captures the theme "Nature Awakens".',
      rules:
        "All entries must be original work. No watermarks or signatures on images. Maximum 3 entries per person.",
    },
    {
      id: "2",
      title: "Gaming Tournament",
      imageUrl:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
      deadline: "2023-11-15",
      prizeValue: "$10,000",
      category: "Gaming",
      difficulty: "Hard",
      requirements:
        "Register a team of 4 players. All participants must be 18+ and have their own equipment.",
      rules:
        "Double elimination format. Matches will be streamed live. Code of conduct must be followed.",
    },
    {
      id: "3",
      title: "Recipe Challenge",
      imageUrl:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
      deadline: "2023-10-30",
      prizeValue: "$2,500",
      category: "Food",
      difficulty: "Easy",
      requirements:
        "Create an original recipe using the secret ingredient revealed on October 1st.",
      rules:
        "Recipe must be vegetarian-friendly. Include a photo of the finished dish. Judging based on creativity, presentation, and simplicity.",
    },
    {
      id: "4",
      title: "Mobile App Design",
      imageUrl:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
      deadline: "2023-12-15",
      prizeValue: "$7,500",
      category: "Technology",
      difficulty: "Medium",
      requirements:
        "Design a mobile app interface for a health tracking application.",
      rules:
        "Submit all designs in Figma format. Include at least 5 key screens. Design must be accessible and follow modern UI principles.",
    },
    {
      id: "5",
      title: "Short Story Contest",
      imageUrl:
        "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80",
      deadline: "2023-11-20",
      prizeValue: "$3,000",
      category: "Writing",
      difficulty: "Medium",
      requirements:
        'Write a short story of maximum 5,000 words on the theme "The Unexpected Journey".',
      rules:
        "Stories must be in English. No previously published work. One entry per person. All genres accepted.",
    },
    {
      id: "6",
      title: "Fitness Challenge",
      imageUrl:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
      deadline: "2023-10-31",
      prizeValue: "$1,500",
      category: "Health",
      difficulty: "Easy",
      requirements:
        "Complete a 30-day fitness program and document your progress.",
      rules:
        "Daily check-ins required. Before and after photos encouraged but not mandatory. Must follow the provided workout schedule.",
    },
    {
      id: "7",
      title: "Logo Design Competition",
      imageUrl:
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
      deadline: "2023-12-01",
      prizeValue: "$4,000",
      category: "Design",
      difficulty: "Medium",
      requirements: "Create a modern logo for a sustainable fashion brand.",
      rules:
        "Submit in vector format. Include color and black/white versions. Logo must work at various sizes.",
    },
    {
      id: "8",
      title: "Music Production Contest",
      imageUrl:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
      deadline: "2023-11-30",
      prizeValue: "$6,000",
      category: "Music",
      difficulty: "Hard",
      requirements:
        "Produce an original track between 3-5 minutes using the provided sample pack.",
      rules:
        "All sounds must be from the official sample pack or originally created. No third-party loops or samples allowed.",
    },
  ];

  const competitionsToDisplay =
    competitions.length > 0 ? competitions : defaultCompetitions;

  // Apply filters
  const filteredCompetitions = competitionsToDisplay.filter((comp) => {
    if (filters.category && comp.category !== filters.category) return false;
    if (filters.difficulty && comp.difficulty !== filters.difficulty)
      return false;
    // Additional filter logic would go here for prize range and end date
    return true;
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      prizeRange: "",
      endDate: "",
      difficulty: "",
    });
  };

  // Animation variants for grid items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          Competition Directory
        </h1>

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFilters}
        />

        {filteredCompetitions.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-600">
              No competitions match your filters
            </h3>
            <button
              onClick={resetFilters}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredCompetitions.map((competition) => (
              <motion.div key={competition.id} variants={itemVariants}>
                <CompetitionCard competition={competition} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CompetitionGrid;
