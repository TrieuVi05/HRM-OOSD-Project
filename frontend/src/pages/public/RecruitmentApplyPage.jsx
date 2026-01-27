import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api.js";

export default function RecruitmentApplyPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");

    api
      .getRecruitmentById(id)
      .then((data) => {
        if (!ignore) setJob(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Không thể tải tin tuyển dụng");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const readFileAsDataUrl = (fileItem) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Không thể đọc file"));
      reader.readAsDataURL(fileItem);
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const resumeUrl = file ? await readFileAsDataUrl(file) : "";
      await api.createCandidate({
        recruitmentId: Number(id),
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        resumeUrl,
        status: "APPLIED",
        appliedAt: new Date().toISOString()
      });
      setSuccess("Nộp hồ sơ thành công! Chúng tôi sẽ liên hệ sớm.");
      setForm({ fullName: "", email: "", phone: "" });
      setFile(null);
    } catch (err) {
      setError(err.message || "Không thể nộp hồ sơ");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: 32 }}>Đang tải biểu mẫu ứng tuyển...</div>;
  if (error) return <div style={{ padding: 32, color: "#dc2626" }}>{error}</div>;

  return (
    <div style={{ padding: 32, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>Nộp hồ sơ</h1>
      <p style={{ color: "#6b7280" }}>{job?.title || "Vị trí tuyển dụng"}</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label style={{ display: "grid", gap: 6 }}>
          Họ và tên
          <input value={form.fullName} onChange={handleChange("fullName")} required />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          Email
          <input type="email" value={form.email} onChange={handleChange("email")} required />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          Số điện thoại
          <input value={form.phone} onChange={handleChange("phone")} required />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          CV (PDF/DOC)
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>

        {success && <div style={{ color: "#16a34a" }}>{success}</div>}
        {error && <div style={{ color: "#dc2626" }}>{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          style={{ padding: "10px 14px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer" }}
        >
          {submitting ? "Đang gửi..." : "Gửi hồ sơ"}
        </button>
      </form>

      <p style={{ marginTop: 16, color: "#6b7280", fontSize: 12 }}>
        Lưu ý: CV sẽ được lưu dưới dạng nội dung base64 trong hệ thống để demo.
      </p>
    </div>
  );
}
