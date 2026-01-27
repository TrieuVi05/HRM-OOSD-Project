import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api.js";

export default function RecruitmentLandingPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");

    api
      .getPublicRecruitments()
      .then((data) => {
        if (!ignore) setItems(data || []);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Không thể tải danh sách tuyển dụng");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <div style={{ padding: 32 }}>Đang tải danh sách tuyển dụng...</div>;
  if (error) return <div style={{ padding: 32, color: "#dc2626" }}>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Cơ hội nghề nghiệp</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Chọn vị trí phù hợp và nộp hồ sơ trực tiếp.
      </p>

      {items.length === 0 ? (
        <p>Hiện chưa có tin tuyển dụng.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {items.map((job) => (
            <div key={job.id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fff" }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{job.title || "Vị trí tuyển dụng"}</h3>
              <p style={{ margin: "8px 0", color: "#6b7280" }}>Số lượng: {job.openings || 0}</p>
              <p style={{ margin: "8px 0", color: "#6b7280" }}>Trạng thái: {job.status || "Đang tuyển"}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <Link
                  to={`/careers/${job.id}`}
                  style={{ padding: "8px 12px", borderRadius: 8, background: "#1d4ed8", color: "#fff", textDecoration: "none" }}
                >
                  Xem chi tiết
                </Link>
                <Link
                  to={`/careers/${job.id}/apply`}
                  style={{ padding: "8px 12px", borderRadius: 8, background: "#10b981", color: "#fff", textDecoration: "none" }}
                >
                  Nộp hồ sơ
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
