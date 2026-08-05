import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Layout } from '@/components/common/Layout';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Products } from '@/pages/Products';
import { Orders } from '@/pages/Orders';
import { Users } from '@/pages/Users';
import { Reviews } from '@/pages/Reviews';
import { Coupons } from '@/pages/Coupons';
import { Categories } from '@/pages/Categories';
import { Blogs } from './components/blogs/Blogs';
import { VideosManager } from './components/videos/VideoManager';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/users" element={<Users />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/coupons" element={<Coupons />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/videos" element={<VideosManager />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
