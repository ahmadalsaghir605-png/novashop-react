import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import Cart from './pages/Cart.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Products from './pages/Products.jsx';
import Register from './pages/Register.jsx';

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin', 'manager']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute roles={['admin', 'manager']}>
            <AdminOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute roles={['admin', 'manager']}>
            <AdminProducts />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default App;
