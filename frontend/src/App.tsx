import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import TeacherHome from "./components/teacher/Home";
import StudentHome from "./components/student/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Teacher */}
        <Route path="/teacher/home" element={<TeacherHome />} />

        {/* Student */}
        <Route path="/student/home" element={<StudentHome />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
