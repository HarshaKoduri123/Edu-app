import { useState } from "react";
import { createSubSection } from "../../api/api";

const CreateSubSection = ({
  sectionId,
  onCreated,
}: {
  sectionId: number;
  onCreated: () => void;
}) => {
  const token = localStorage.getItem("access");

  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [type, setType] = useState<"video" | "pdf">("video");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createSubSection(token!, {
      section: sectionId,
      title,
      order,
      content_type: type,
      video_url: type === "video" ? videoUrl : undefined,
      pdf_file: type === "pdf" ? pdf! : undefined,
    });

    setTitle("");
    setVideoUrl("");
    setPdf(null);
    onCreated(); // realtime update
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-2">
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Lecture title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select
        className="border px-3 py-2 rounded w-full"
        value={type}
        onChange={(e) => setType(e.target.value as any)}
      >
        <option value="video">Video</option>
        <option value="pdf">PDF</option>
      </select>

      {type === "video" && (
        <input
          className="border px-3 py-2 rounded w-full"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      )}

      {type === "pdf" && (
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdf(e.target.files?.[0] || null)}
        />
      )}

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Lecture
      </button>
    </form>
  );
};

export default CreateSubSection;
