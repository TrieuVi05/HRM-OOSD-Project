import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";

export default function PublicLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="app-root">
      <Header />
      <main className={isLoginPage ? "app-content auth-page" : "app-content"}>
        <Outlet />
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
}
