import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save, ArrowLeft, Trash2, Upload } from "lucide-react";

interface CompetitionFormProps {
  mode: "create" | "edit";
}

interface CompetitionFormData {
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
}

const CompetitionForm: React.FC<CompetitionFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [requirementInput, setRequirementInput] = useState("");
  const [formData, setFormData] = useState<CompetitionFormData>({
    title: "",
    type: "directory",
    category: "",
    difficulty: "Medium",
    imageUrl: "",
    deadline: new Date().toISOString().split("T")[0],
    startDate: new Date().toISOString().split("T")[0],
    prizeValue: "",
    tldr: "",
    requirements: [],
    rules: "",
    entryUrl: "",
  });

  useEffect(() => {
    if (mode === "edit" && id) {
      fetchCompetition(id);
    }
  }, [mode, id]);

  const fetchCompetition = async (competitionId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .eq("id", competitionId)
        .single();

      if (error) throw error;

      if (data) {
        // Format dates for input fields
        const formattedData = {
          ...data,
          deadline: new Date(data.deadline).toISOString().split("T")[0],
          startDate: new Date(data.startDate).toISOString().split("T")[0],
        };
        setFormData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching competition:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()],
      }));
      setRequirementInput("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Format dates for database
      const dbData = {
        ...formData,
        deadline: new Date(formData.deadline).toISOString(),
        startDate: new Date(formData.startDate).toISOString(),
      };

      if (mode === "create") {
        const { error } = await supabase.from("competitions").insert([dbData]);
        if (error) throw error;
      } else if (mode === "edit" && id) {
        const { error } = await supabase
          .from("competitions")
          .update(dbData)
          .eq("id", id);
        if (error) throw error;
      }

      navigate("/admin/competitions");
    } catch (error) {
      console.error("Error saving competition:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `competitions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("competition-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("competition-images")
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, imageUrl: data.publicUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/competitions")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h2 className="text-3xl font-bold">
          {mode === "create" ? "Add New Competition" : "Edit Competition"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Competition title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="directory">Directory Listing</SelectItem>
                    <SelectItem value="custom">Custom Game</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) =>
                    handleSelectChange("difficulty", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline *</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prizeValue">Prize Value *</Label>
                <Input
                  id="prizeValue"
                  name="prizeValue"
                  value={formData.prizeValue}
                  onChange={handleChange}
                  placeholder="e.g. $1,000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryUrl">Entry URL</Label>
                <Input
                  id="entryUrl"
                  name="entryUrl"
                  value={formData.entryUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/enter"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tldr">Short Description *</Label>
                <Textarea
                  id="tldr"
                  name="tldr"
                  value={formData.tldr}
                  onChange={handleChange}
                  placeholder="Brief description of the competition"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="rules">Rules *</Label>
                <Textarea
                  id="rules"
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  placeholder="Competition rules"
                  required
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Requirements</Label>
                <div className="flex gap-2">
                  <Input
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    placeholder="Add a requirement"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addRequirement())
                    }
                  />
                  <Button type="button" onClick={addRequirement}>
                    Add
                  </Button>
                </div>
                <ul className="mt-2 space-y-2">
                  {formData.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span>{req}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="imageUpload">Competition Image</Label>
                <div className="flex flex-col gap-4">
                  {formData.imageUrl && (
                    <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={formData.imageUrl}
                        alt="Competition preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="Image URL"
                      className="flex-1"
                    />
                    <div className="relative">
                      <Input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Button type="button" variant="outline">
                        <Upload className="mr-2 h-4 w-4" /> Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/competitions")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Competition
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompetitionForm;
