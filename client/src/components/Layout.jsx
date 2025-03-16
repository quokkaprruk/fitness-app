import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="page-content">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
