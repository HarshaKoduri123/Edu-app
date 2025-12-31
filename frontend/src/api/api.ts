// ===========================================================
// BASE
// ===========================================================
const API_BASE =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_BASE_URL || ""
    : "http://127.0.0.1:8000";

// ===========================================================
// HELPERS
// ===========================================================
async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.detail ||
        errorData.message ||
        res.statusText ||
        "API Error"
    );
  }
  return res.json();
}

async function authFetch(
  url: string,
  token: string | null,
  options: RequestInit = {}
) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  return handleResponse(res);
}

// ===========================================================
// AUTH – REGISTER
// ===========================================================

export async function registerStudent(data: {
  email: string;
  password: string;
  role: "student";
  full_name: string;
  age: number;
  student_class: "11" | "12";
  school: string;
  exam_target: "jee" | "neet" | "eamcet";
}) {
  const res = await fetch(`${API_BASE}/api/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function registerTeacher(data: {
  email: string;
  password: string;
  role: "teacher";
  full_name: string;
  organization: string;
  qualification: string;
  experience_years: number;
  subjects: string;
}) {
  const res = await fetch(`${API_BASE}/api/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

// ===========================================================
// AUTH – LOGIN / LOGOUT
// ===========================================================

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(res);

  // Save tokens
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);

  return data;
}

export function logoutUser() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
}

// ===========================================================
// COURSES (Teacher only)
// ===========================================================

export async function getCourses(token: string) {
  return authFetch("/api/courses/", token);
}

export async function createCourse(
  token: string,
  data: {
    title: string;
    description?: string;
    exam_target: "jee" | "neet" | "eamcet";
    student_class: "11" | "12";
    is_published?: boolean;
  }
) {
  return authFetch("/api/courses/", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCourse(
  token: string,
  courseId: number,
  data: any
) {
  return authFetch(`/api/courses/${courseId}/`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCourse(token: string, courseId: number) {
  return authFetch(`/api/courses/${courseId}/`, token, {
    method: "DELETE",
  });
}

// ===========================================================
// SECTIONS
// ===========================================================

export async function getSections(token: string) {
  return authFetch("/api/sections/", token);
}

export async function createSection(
  token: string,
  data: {
    course: number;
    title: string;
    order: number;
  }
) {
  return authFetch("/api/sections/", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSection(
  token: string,
  sectionId: number,
  data: any
) {
  return authFetch(`/api/sections/${sectionId}/`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteSection(token: string, sectionId: number) {
  return authFetch(`/api/sections/${sectionId}/`, token, {
    method: "DELETE",
  });
}

// ===========================================================
// SUB-SECTIONS (Lectures)
// ===========================================================

export async function getSubSections(token: string) {
  return authFetch("/api/subsections/", token);
}

export async function createSubSection(
  token: string,
  data: {
    section: number;
    title: string;
    order: number;
    content_type: "video" | "pdf";
    video_url?: string;
    pdf_file?: File;
  }
) {
  const formData = new FormData();
  formData.append("section", String(data.section));
  formData.append("title", data.title);
  formData.append("order", String(data.order));
  formData.append("content_type", data.content_type);

  if (data.content_type === "video" && data.video_url) {
    formData.append("video_url", data.video_url);
  }

  if (data.content_type === "pdf" && data.pdf_file) {
    formData.append("pdf_file", data.pdf_file);
  }

  const res = await fetch(`${API_BASE}/api/subsections/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse(res);
}


export async function updateSubSection(
  token: string,
  subSectionId: number,
  data: any
) {
  return authFetch(`/api/subsections/${subSectionId}/`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteSubSection(
  token: string,
  subSectionId: number
) {
  return authFetch(`/api/subsections/${subSectionId}/`, token, {
    method: "DELETE",
  });
}
