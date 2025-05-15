import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Archive,
  Trash2,
  Calendar,
  Award,
  ExternalLink,
} from "lucide-react";

interface Competition {
  id: string;
  title: string;
  type: "directory" | "custom";
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  imageUrl: string;
  deadline: string;
  startDate: string;
  prizeValue: string;
  tldr: string;
  requirements: string[];
  rules: string;
  entryUrl: string;
  isArchived: boolean;
  created_at: string;
  updated_at: string;
}

const CompetitionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCompetition(id);
    }
  }, [id]);

  const fetchCompetition = async (competitionId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .eq("id", competitionId)
        .single();

      if (error) throw error;
      setCompetition(data);
    } catch (error) {
      console.error("Error fetching competition:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveToggle = async () => {
    if (!competition) return;

    setArchiving(true);
    try {
      const { error } = await supabase
        .from("competitions")
        .update({ isArchived: !competition.isArchived })
        .eq("id", competition.id);

      if (error) throw error;

      // Update local state
      setCompetition((prev) =>
        prev ? { ...prev, isArchived: !prev.isArchived } : null,
      );
    } catch (error) {
      console.error("Error toggling archive status:", error);
    } finally {
      setArchiving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !competition ||
      !confirm(
        "Are you sure you want to delete this competition? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("competitions")
        .delete()
        .eq("id", competition.id);

      if (error) throw error;
      navigate("/admin/competitions");
    } catch (error) {
      console.error("Error deleting competition:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Competition not found</h2>
        <Button asChild>
          <Link to="/admin/competitions">Back to Competitions</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/competitions")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h2 className="text-3xl font-bold">{competition.title}</h2>
          {competition.isArchived && (
            <Badge variant="outline" className="bg-gray-100 text-gray-800">
              Archived
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleArchiveToggle}
            disabled={archiving}
          >
            <Archive className="mr-2 h-4 w-4" />
            {competition.isArchived ? "Unarchive" : "Archive"}
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/admin/competitions/${competition.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Competition Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant="outline"
                  className={getTypeColor(competition.type)}
                >
                  {competition.type === "directory"
                    ? "Directory Listing"
                    : "Custom Game"}
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {competition.category}
                </Badge>
                <Badge
                  variant="outline"
                  className={getDifficultyColor(competition.difficulty)}
                >
                  {competition.difficulty}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-700">{competition.tldr}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Rules</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {competition.rules}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {competition.requirements.map((req, index) => (
                    <li key={index} className="text-gray-700">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {competition.entryUrl && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Entry URL</h3>
                    <a
                      href={competition.entryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      {competition.entryUrl}
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {competition.imageUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Competition Image</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={competition.imageUrl}
                  alt={competition.title}
                  className="w-full h-auto rounded-md"
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Competition Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">
                    {formatDate(competition.startDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-medium">
                    {formatDate(competition.deadline)}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Prize Value</p>
                  <p className="font-medium">{competition.prizeValue}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">
                  {formatDate(competition.created_at)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {formatDate(competition.updated_at)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetail;
