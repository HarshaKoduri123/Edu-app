import { useState } from "react";
import { Link } from "react-router-dom";
import { registerStudent, registerTeacher } from "../../api/api";

type Role = "student" | "teacher";

const Register = () => {
  const [role, setRole] = useState<Role>("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<any>({
    email: "",
    password: "",
    full_name: "",
    age: "",
    student_class: "11",
    school: "",
    exam_target: "jee",
    organization: "",
    qualification: "",
    experience_years: "",
    subjects: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (role === "student") {
        await registerStudent({
          email: form.email,
          password: form.password,
          role: "student",
          full_name: form.full_name,
          age: Number(form.age),
          student_class: form.student_class,
          school: form.school,
          exam_target: form.exam_target,
        });
      } else {
        await registerTeacher({
          email: form.email,
          password: form.password,
          role: "teacher",
          full_name: form.full_name,
          organization: form.organization,
          qualification: form.qualification,
          experience_years: Number(form.experience_years),
          subjects: form.subjects,
        });
      }

      alert("Registration successful");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white border rounded-lg p-8">
        {/* Header */}
        <h1 className="text-2xl font-semibold mb-2">
          Create your account
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Join thousands of learners preparing for competitive exams
        </p>

        {/* Role Toggle */}
        <div className="flex mb-6 border rounded overflow-hidden">
          {["student", "teacher"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r as Role)}
              className={`flex-1 py-2 text-sm font-medium ${
                role === r
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {r === "student" ? "Student" : "Teacher"}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="full_name"
            placeholder="Full Name"
            className="w-full border rounded-md px-3 py-2"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border rounded-md px-3 py-2"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border rounded-md px-3 py-2"
            onChange={handleChange}
            required
          />

          {/* Student Fields */}
          {role === "student" && (
            <>
              <input
                name="age"
                type="number"
                placeholder="Age"
                className="w-full border rounded-md px-3 py-2"
                onChange={handleChange}
              />

              <select
                name="student_class"
                className="w-full border rounded-md px-3 py-2"
                onChange={handleChange}
              >
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>

              <input
                name="school"
                placeholder="School"
                className="w-full border rounded-md px-3 py-2"
                onChange={handleChange}
              />

              <select
                name="exam_target"
                className="w-full border rounded-md px-3 py-2"
                onChange={handleChange}
              >
                <option value="jee">JEE</option>
                <option value="neet">NEET</option>
                <option value="eamcet">EAMCET</option>
              </select>
            </>
          )}

          {/* Teacher Fields */}
          {role === "teacher" && (
            <>
              <input
                name="organization"
                placeholder="Organization"
                className="w-full border rounded-md px-3 py-2"
                onChange={handleChange}
              />

              <input
                name="qualification"
                placeholder="Qualification"
                className="w-full border rounded-md px-3 py-2"
                onChange={handleChange}
              />

              <input
                name="experience_years"
                type="number"
                placeholder="Years of Experience"
                className="w-full border rounded-md px-3 py-2"
                onChange={handleChange}
              />

              <input
                name="subjects"
                placeholder="Subjects (e.g. Physics)"
                className="w-full border rounded-md px-3 py-2"
                onChange={handleChange}
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
