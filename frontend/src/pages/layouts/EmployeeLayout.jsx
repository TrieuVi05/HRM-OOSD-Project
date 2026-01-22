import { Outlet } from "react-router-dom";
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";

export default function EmployeeLayout() {
  return (
    <div className="app-root">
      <Header />
      <main className="app-content">
        <div style={{ marginBottom: 16, fontWeight: 600 }}>Employee Area</div>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
