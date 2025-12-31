import { useState } from "react";
import { createSection } from "../../api/api";

const CreateSection = ({
  courseId,
  onCreated,
}: {
  courseId: number;
  onCreated: () => void;
}) => {
  const token = localStorage.getItem("access");
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createSection(token!, {
      course: courseId,
      title,
      order,
    });

    setTitle("");
    onCreated(); // realtime refresh
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Section title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button className="bg-green-600 text-white px-4 rounded">
        Add
      </button>
    </form>
  );
};

export default CreateSection;
