import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../services/api.js";

export default function RecruitmentDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        if (!ignore) setError(err.message || "Không thể tải chi tiết tuyển dụng");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) return <div style={{ padding: 32 }}>Đang tải chi tiết tuyển dụng...</div>;
  if (error) return <div style={{ padding: 32, color: "#dc2626" }}>{error}</div>;
  if (!job) return <div style={{ padding: 32 }}>Không tìm thấy tin tuyển dụng.</div>;

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>{job.title || "Vị trí tuyển dụng"}</h1>
      <p style={{ color: "#6b7280" }}>Số lượng: {job.openings || 0}</p>
      <p style={{ color: "#6b7280" }}>Trạng thái: {job.status || "Đang tuyển"}</p>
      <div style={{ marginTop: 16, lineHeight: 1.6 }}>{job.description || "Chưa có mô tả chi tiết."}</div>

      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <Link
          to={`/careers/${job.id}/apply`}
          style={{ padding: "10px 16px", borderRadius: 8, background: "#10b981", color: "#fff", textDecoration: "none" }}
        >
          Nộp hồ sơ
        </Link>
        <Link to="/careers" style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #e5e7eb", textDecoration: "none" }}>
          Quay lại
        </Link>
      </div>
    </div>
  );
}
