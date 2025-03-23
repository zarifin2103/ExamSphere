import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load pages
const AdminDashboard = lazy(() => import("./pages/admin/dashboard"));
const ExamsPage = lazy(() => import("./pages/admin/exams"));
const QuestionBanksPage = lazy(() => import("./pages/admin/question-banks"));
const QuestionBankDetailPage = lazy(
  () => import("./pages/admin/question-banks/[id]"),
);
const ExamConfigPage = lazy(() => import("./pages/admin/exam-config"));
const SupervisorDashboard = lazy(() => import("./pages/supervisor/dashboard"));
const ParticipantDashboard = lazy(
  () => import("./pages/participant/dashboard"),
);
const ParticipantExams = lazy(() => import("./pages/participant/exams"));
const ParticipantResults = lazy(() => import("./pages/participant/results"));
const SignupPage = lazy(() => import("./pages/signup"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exams"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ExamsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/question-banks"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <QuestionBanksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/question-banks/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <QuestionBankDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exam-config"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ExamConfigPage />
              </ProtectedRoute>
            }
          />

          {/* Supervisor Routes */}
          <Route
            path="/supervisor/dashboard"
            element={
              <ProtectedRoute allowedRoles={["supervisor"]}>
                <SupervisorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Participant Routes */}
          <Route
            path="/participant/dashboard"
            element={
              <ProtectedRoute allowedRoles={["participant", "user"]}>
                <ParticipantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/participant/exams"
            element={
              <ProtectedRoute allowedRoles={["participant", "user"]}>
                <ParticipantExams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/participant/results"
            element={
              <ProtectedRoute allowedRoles={["participant", "user"]}>
                <ParticipantResults />
              </ProtectedRoute>
            }
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
