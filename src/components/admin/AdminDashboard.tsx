import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Calendar, Award, Archive } from "lucide-react";
import { supabase } from "@/lib/supabase";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCompetitions: 0,
    activeCompetitions: 0,
    archivedCompetitions: 0,
    upcomingCompetitions: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total competitions
        const { count: totalCount } = await supabase
          .from("competitions")
          .select("*", { count: "exact", head: true });

        // Get active competitions (not archived)
        const { count: activeCount } = await supabase
          .from("competitions")
          .select("*", { count: "exact", head: true })
          .eq("isArchived", false);

        // Get archived competitions
        const { count: archivedCount } = await supabase
          .from("competitions")
          .select("*", { count: "exact", head: true })
          .eq("isArchived", true);

        // Get upcoming competitions (start date in the future)
        const { count: upcomingCount } = await supabase
          .from("competitions")
          .select("*", { count: "exact", head: true })
          .eq("isArchived", false)
          .gt("startDate", new Date().toISOString());

        setStats({
          totalCompetitions: totalCount || 0,
          activeCompetitions: activeCount || 0,
          archivedCompetitions: archivedCount || 0,
          upcomingCompetitions: upcomingCount || 0,
        });
      } catch (error) {
        console.error("Error fetching competition stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Competitions
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompetitions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Competitions
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCompetitions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Competitions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.upcomingCompetitions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Archived Competitions
            </CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.archivedCompetitions}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Trophy className="h-10 w-10 text-blue-500 mb-2" />
              <h4 className="font-medium">Add New Competition</h4>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Award className="h-10 w-10 text-green-500 mb-2" />
              <h4 className="font-medium">Manage Active Competitions</h4>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Archive className="h-10 w-10 text-amber-500 mb-2" />
              <h4 className="font-medium">View Archived Competitions</h4>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
