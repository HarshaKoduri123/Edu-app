import { useEffect, useState } from "react";
import { getCourses } from "../../api/api";
import CreateCourse from "./CreateCourse";
import CreateSection from "./CreateSection";
import CreateSubSection from "./CreateSubSection";

// 🔹 Convert YouTube URL → Embed URL
const toEmbedUrl = (url: string) => {
  if (!url) return "";

  if (url.includes("youtu.be")) {
    const id = url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("watch?v=")) {
    const id = url.split("watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url;
};

const Home = () => {
  const token = localStorage.getItem("access");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getCourses(token!);
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

      {/* ✅ CREATE COURSE */}
      <CreateCourse onCreated={fetchCourses} />

      {/* ✅ COURSE LIST */}
      <div className="mt-8 space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-500">No courses yet</p>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-4 border rounded space-y-4"
            >
              {/* COURSE INFO */}
              <div>
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-sm text-gray-600">
                  {course.exam_target.toUpperCase()} | Class{" "}
                  {course.student_class}
                </p>
              </div>

              {/* ✅ CREATE SECTION */}
              <CreateSection
                courseId={course.id}
                onCreated={fetchCourses}
              />

              {/* ✅ SECTIONS */}
              {course.sections?.map((section: any) => (
                <div
                  key={section.id}
                  className="ml-4 border-l pl-4 space-y-3"
                >
                  <h4 className="font-medium">{section.title}</h4>

                  {/* ✅ CREATE SUB-SECTION */}
                  <CreateSubSection
                    sectionId={section.id}
                    onCreated={fetchCourses}
                  />

                  {/* ✅ SUB-SECTIONS + PREVIEW */}
                  {section.subsections?.map((sub: any) => (
                    <div
                      key={sub.id}
                      className="ml-4 p-3 border rounded bg-gray-50"
                    >
                      <p className="font-medium text-sm mb-2">
                        ▶ {sub.title} ({sub.content_type})
                      </p>

                      {/* 🎥 VIDEO PREVIEW (SECURE OVERLAY) */}
                      {sub.content_type === "video" && (
                        <div
                          className="relative w-full h-64"
                          onContextMenu={(e) => e.preventDefault()}
                        >
                          <iframe
                            src={toEmbedUrl(sub.video_url)}
                            className="w-full h-full rounded pointer-events-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />

                          {/* Transparent overlay */}
                          <div className="absolute inset-0" />
                        </div>
                      )}

                      {/* 📄 PDF PREVIEW */}
                      {sub.content_type === "pdf" && (
                        <iframe
                          src={sub.pdf_file}
                          className="w-full h-96 border rounded"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
