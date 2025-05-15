import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Award,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CompetitionCardProps {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  deadline: string;
  prizeValue: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tldr: string;
  requirements: string[];
  entryUrl: string;
}

const CompetitionCard = ({
  id = "1",
  title = "Photography Contest",
  imageUrl = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
  category = "Creative",
  deadline = "2023-12-31",
  prizeValue = "$1,000",
  difficulty = "Medium",
  tldr = "Submit your best nature photography for a chance to win cash prizes.",
  requirements = [
    "Must be 18+ years old",
    "Photos must be original work",
    "Maximum 3 entries per person",
    "Submission deadline is December 31st",
  ],
  entryUrl = "#",
}: Partial<CompetitionCardProps>) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const difficultyColor = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full h-full bg-white rounded-xl overflow-hidden shadow-[5px_5px_15px_rgba(0,0,0,0.1),-5px_-5px_15px_rgba(255,255,255,0.8)] border-none transition-all duration-300 hover:shadow-[8px_8px_20px_rgba(0,0,0,0.12),-8px_-8px_20px_rgba(255,255,255,0.9)]">
      <div className="relative">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <Badge
          className={`absolute top-3 right-3 ${difficultyColor[difficulty]}`}
          variant="outline"
        >
          {difficulty}
        </Badge>
        <Badge
          className="absolute top-3 left-3 bg-blue-100 text-blue-800"
          variant="outline"
        >
          {category}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold line-clamp-2">{title}</h3>
      </CardHeader>

      <CardContent className="space-y-2 pb-2">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Deadline: {formatDate(deadline)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Award className="h-4 w-4 mr-1" />
          <span>Prize: {prizeValue}</span>
        </div>
        <p className="text-sm text-gray-700 line-clamp-2">{tldr}</p>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 pt-0">
        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleExpand}
            className="flex items-center text-sm"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" /> Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" /> Show Details
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSave}
            className="text-gray-600"
          >
            {isSaved ? (
              <BookmarkCheck className="h-5 w-5 text-blue-600" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden w-full"
        >
          <div className="pt-2 pb-2 border-t border-gray-200">
            <h4 className="font-medium text-sm mb-2">Requirements:</h4>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
              {requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
            <div className="mt-4">
              <Button
                className="w-full flex items-center justify-center gap-2"
                variant="default"
                size="sm"
                asChild
              >
                <a href={entryUrl} target="_blank" rel="noopener noreferrer">
                  Enter Competition <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </CardFooter>
    </Card>
  );
};

export default CompetitionCard;
