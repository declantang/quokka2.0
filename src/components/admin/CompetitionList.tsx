import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Archive,
  Eye,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";

interface Competition {
  id: string;
  title: string;
  type: "directory" | "custom";
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  deadline: string;
  startDate: string;
  prizeValue: string;
  isArchived: boolean;
}

const CompetitionList = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterArchived, setFilterArchived] = useState<string>("active");
  const [sortField, setSortField] = useState<string>("deadline");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchCompetitions();
  }, [filterType, filterCategory, filterArchived, sortField, sortDirection]);

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      let query = supabase.from("competitions").select("*");

      // Apply filters
      if (filterType) {
        query = query.eq("type", filterType);
      }

      if (filterCategory) {
        query = query.eq("category", filterCategory);
      }

      if (filterArchived === "active") {
        query = query.eq("isArchived", false);
      } else if (filterArchived === "archived") {
        query = query.eq("isArchived", true);
      }

      // Apply sorting
      query = query.order(sortField, { ascending: sortDirection === "asc" });

      const { data, error } = await query;

      if (error) throw error;

      // Apply search filter client-side
      let filteredData = data || [];
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredData = filteredData.filter(
          (comp) =>
            comp.title.toLowerCase().includes(term) ||
            comp.category.toLowerCase().includes(term),
        );
      }

      setCompetitions(filteredData);
    } catch (error) {
      console.error("Error fetching competitions:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "directory":
        return "bg-blue-100 text-blue-800";
      case "custom":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Competitions</h2>
        <Link to="/admin/competitions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Competition
          </Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search competitions..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchCompetitions()}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="directory">Directory</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="Creative">Creative</SelectItem>
                <SelectItem value="Gaming">Gaming</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Writing">Writing</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterArchived} onValueChange={setFilterArchived}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Competition table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Title</th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => toggleSort("type")}
                >
                  <div className="flex items-center">
                    Type
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => toggleSort("category")}
                >
                  <div className="flex items-center">
                    Category
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => toggleSort("difficulty")}
                >
                  <div className="flex items-center">
                    Difficulty
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => toggleSort("deadline")}
                >
                  <div className="flex items-center">
                    Deadline
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => toggleSort("prizeValue")}
                >
                  <div className="flex items-center">
                    Prize
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : competitions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No competitions found
                  </td>
                </tr>
              ) : (
                competitions.map((competition) => (
                  <tr
                    key={competition.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium">{competition.title}</div>
                      {competition.isArchived && (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-800 mt-1"
                        >
                          Archived
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={getTypeColor(competition.type)}
                      >
                        {competition.type === "directory"
                          ? "Directory"
                          : "Custom"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{competition.category}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={getDifficultyColor(competition.difficulty)}
                      >
                        {competition.difficulty}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {formatDate(competition.deadline)}
                    </td>
                    <td className="py-3 px-4">{competition.prizeValue}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/competitions/${competition.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            to={`/admin/competitions/${competition.id}/edit`}
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompetitionList;
