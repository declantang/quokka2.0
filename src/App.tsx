import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

// Admin components with lazy loading
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const CompetitionList = lazy(
  () => import("./components/admin/CompetitionList"),
);
const CompetitionForm = lazy(
  () => import("./components/admin/CompetitionForm"),
);
const CompetitionDetail = lazy(
  () => import("./components/admin/CompetitionDetail"),
);

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="competitions" element={<CompetitionList />} />
            <Route
              path="competitions/new"
              element={<CompetitionForm mode="create" />}
            />
            <Route path="competitions/:id" element={<CompetitionDetail />} />
            <Route
              path="competitions/:id/edit"
              element={<CompetitionForm mode="edit" />}
            />
            <Route path="settings" element={<div>Settings Page</div>} />
          </Route>

          {/* For Tempo storyboards */}
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
