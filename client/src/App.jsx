import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Landing from "./pages/Landing";
import StudentDashboard from "./pages/StudentDashboard";
import CounsellorDashboard from "./pages/CounsellorDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import ExploreColleges from "./pages/ExploreColleges";

function App() {
  const [user, setUser] = useState(null); // shared user state

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing setUser={setUser} />} />
        <Route path="/student-dashboard" element={<StudentDashboard user={user} />} />
        <Route path="/explore-colleges" element={<ExploreColleges />} />
        <Route path="/counsellor-dashboard" element={<CounsellorDashboard user={user} />} />
        <Route path="/parent-dashboard" element={<ParentDashboard user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
