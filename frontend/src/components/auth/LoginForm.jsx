import { useState } from "react";

export default function LoginForm({
  username,
  password,
  onChangeUsername,
  onChangePassword,
  onSubmit,
  loading,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-badge">HRM</div>

        <h1 className="auth-title">Đăng nhập</h1>
        <p className="auth-subtitle">
          Chào mừng bạn quay lại. Vui lòng đăng nhập để vào hệ thống.
        </p>

        <form onSubmit={onSubmit} className="auth-form">
          <label className="auth-label">
            Tên đăng nhập
            <input
              className="auth-input"
              value={username}
              onChange={(e) => onChangeUsername(e.target.value)}
              placeholder="vd: admin01"
              autoComplete="username"
              required
            />
          </label>

          <label className="auth-label">
            Mật khẩu
            <div className="auth-password-row">
              <input
                className="auth-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => onChangePassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="auth-ghost"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </label>

          {error ? <div className="auth-error">{error}</div> : null}

          <button className="auth-submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="auth-foot">
            <span className="auth-foot-text">Quên mật khẩu?</span>
            <span className="auth-foot-muted">Liên hệ HR để được cấp lại.</span>
          </div>
        </form>
      </div>
    </div>
  );
}
