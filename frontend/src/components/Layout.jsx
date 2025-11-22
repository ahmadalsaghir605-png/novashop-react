import { Outlet } from 'react-router-dom';
import '../App.css';
import NavBar from './NavBar.jsx';
import Sidebar from './Sidebar.jsx';

const Layout = () => (
  <>
    <Sidebar />
    <NavBar />
    <main className="page-container">
      <Outlet />
    </main>
  </>
);

export default Layout;
