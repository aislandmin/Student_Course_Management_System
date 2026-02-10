import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import StudentCourses from "./pages/StudentCourses";
import AdminStudents from "./pages/AdminStudents";
import AdminCourses from "./pages/AdminCourses";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/student/courses"
        element={
          <ProtectedRoute>
            <StudentCourses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/students"
        element={
          <ProtectedRoute>
            <AdminStudents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute>
            <AdminCourses />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
