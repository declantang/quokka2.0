import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CompetitionCard from "./CompetitionCard";
import FilterBar from "./FilterBar";
import { supabase } from "@/lib/supabase";

interface Competition {
  id: string;
  title: string;
  imageUrl: string;
  deadline: string;
  prizeValue: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tldr: string;
  requirements: string[];
  rules: string;
  entryUrl: string;
  type: "directory" | "custom";
  isArchived: boolean;
}

interface CompetitionGridProps {
  competitions?: Competition[];
  filters?: {
    category: string;
    prizeValue: string;
    endDate: string;
    difficulty: string;
  };
}

const CompetitionGrid = ({
  competitions = [],
  filters: propFilters,
}: CompetitionGridProps) => {
  const [localFilters, setLocalFilters] = useState({
    category: "",
    prizeValue: "",
    endDate: "",
    difficulty: "",
  });
  const [dbCompetitions, setDbCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(false);

  // Use filters from props if provided, otherwise use local state
  const filters = propFilters || localFilters;

  useEffect(() => {
    if (competitions.length === 0) {
      fetchCompetitions();
    }
  }, []);

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .eq("isArchived", false)
        .order("deadline", { ascending: true });

      if (error) throw error;
      setDbCompetitions(data || []);
    } catch (error) {
      console.error("Error fetching competitions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Default competitions if none are provided and none in database
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
      tldr: 'Submit a high-resolution photograph that captures the theme "Nature Awakens".',
      requirements: [
        "Must be 18+ years old",
        "Photos must be original work",
        "Maximum 3 entries per person",
      ],
      rules:
        "All entries must be original work. No watermarks or signatures on images. Maximum 3 entries per person.",
      entryUrl: "#",
      type: "directory",
      isArchived: false,
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
      tldr: "Register a team of 4 players for our annual gaming tournament.",
      requirements: [
        "All participants must be 18+",
        "Teams of 4 players required",
        "Own equipment needed",
      ],
      rules:
        "Double elimination format. Matches will be streamed live. Code of conduct must be followed.",
      entryUrl: "#",
      type: "custom",
      isArchived: false,
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
      tldr: "Create an original recipe using the secret ingredient revealed on October 1st.",
      requirements: [
        "Must use the secret ingredient",
        "Recipe must be vegetarian-friendly",
        "Include a photo of the finished dish",
      ],
      rules:
        "Recipe must be vegetarian-friendly. Include a photo of the finished dish. Judging based on creativity, presentation, and simplicity.",
      entryUrl: "#",
      type: "directory",
      isArchived: false,
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
      tldr: "Design a mobile app interface for a health tracking application.",
      requirements: [
        "Submit all designs in Figma format",
        "Include at least 5 key screens",
        "Design must be accessible",
      ],
      rules:
        "Submit all designs in Figma format. Include at least 5 key screens. Design must be accessible and follow modern UI principles.",
      entryUrl: "#",
      type: "directory",
      isArchived: false,
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
      tldr: 'Write a short story of maximum 5,000 words on the theme "The Unexpected Journey".',
      requirements: [
        "Maximum 5,000 words",
        "Must follow the theme",
        "One entry per person",
      ],
      rules:
        "Stories must be in English. No previously published work. One entry per person. All genres accepted.",
      entryUrl: "#",
      type: "directory",
      isArchived: false,
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
      tldr: "Complete a 30-day fitness program and document your progress.",
      requirements: [
        "Daily check-ins required",
        "Follow the provided workout schedule",
        "Document your progress",
      ],
      rules:
        "Daily check-ins required. Before and after photos encouraged but not mandatory. Must follow the provided workout schedule.",
      entryUrl: "#",
      type: "custom",
      isArchived: false,
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
      tldr: "Create a modern logo for a sustainable fashion brand.",
      requirements: [
        "Submit in vector format",
        "Include color and black/white versions",
        "Logo must work at various sizes",
      ],
      rules:
        "Submit in vector format. Include color and black/white versions. Logo must work at various sizes.",
      entryUrl: "#",
      type: "directory",
      isArchived: false,
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
      tldr: "Produce an original track between 3-5 minutes using the provided sample pack.",
      requirements: [
        "Track must be 3-5 minutes long",
        "Use only the provided sample pack",
        "No third-party loops or samples",
      ],
      rules:
        "All sounds must be from the official sample pack or originally created. No third-party loops or samples allowed.",
      entryUrl: "#",
      type: "custom",
      isArchived: false,
    },
  ];

  // Use competitions from props, then database, then defaults
  const competitionsToDisplay =
    competitions.length > 0
      ? competitions
      : dbCompetitions.length > 0
        ? dbCompetitions
        : defaultCompetitions;

  // Apply filters
  const filteredCompetitions = competitionsToDisplay.filter((comp) => {
    if (filters.category && comp.category !== filters.category) return false;
    if (filters.difficulty && comp.difficulty !== filters.difficulty)
      return false;
    // Additional filter logic would go here for prize range and end date
    return true;
  });

  const handleFilterChange = (newFilters: any) => {
    setLocalFilters(newFilters);
  };

  const resetFilters = () => {
    setLocalFilters({
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

        {!propFilters && (
          <FilterBar
            filters={localFilters}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
          />
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading competitions...</p>
          </div>
        ) : filteredCompetitions.length === 0 ? (
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
                <CompetitionCard
                  id={competition.id}
                  title={competition.title}
                  imageUrl={competition.imageUrl}
                  category={competition.category}
                  deadline={competition.deadline}
                  prizeValue={competition.prizeValue}
                  difficulty={competition.difficulty}
                  tldr={competition.tldr}
                  requirements={competition.requirements}
                  entryUrl={competition.entryUrl}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CompetitionGrid;
