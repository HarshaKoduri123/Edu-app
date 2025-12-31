import { useState } from "react";
import { createCourse } from "../../api/api";

const CreateCourse = ({ onCreated }: { onCreated: () => void }) => {
  const token = localStorage.getItem("access");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [examTarget, setExamTarget] = useState("jee");
  const [studentClass, setStudentClass] = useState("11");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createCourse(token!, {
        title,
        description,
        exam_target: examTarget as any,
        student_class: studentClass as any,
        is_published: false,
      });

      setTitle("");
      setDescription("");
      onCreated(); // refresh list
    } catch (err: any) {
      setError(err.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Create New Course</h2>

      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border px-3 py-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full border px-3 py-2 rounded"
          value={examTarget}
          onChange={(e) => setExamTarget(e.target.value)}
        >
          <option value="jee">JEE</option>
          <option value="neet">NEET</option>
          <option value="eamcet">EAMCET</option>
        </select>

        <select
          className="w-full border px-3 py-2 rounded"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
        >
          <option value="11">Class 11</option>
          <option value="12">Class 12</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
