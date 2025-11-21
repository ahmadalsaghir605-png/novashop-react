import { Outlet } from 'react-router-dom';

import '../App.css';
import NavBar from './NavBar.jsx';

const Layout = () => (
  <>
    <NavBar />
    <main className="page-container">
      <Outlet />
    </main>
  </>
);

export default Layout;
