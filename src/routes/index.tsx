import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import useAuth from "../hooks/auth";

import LoginPage from "../view/login";
import LoadingPage from "../view/loading";
import NotFound from "../view/not-found";
import DashboardLayout from "../layout/dashboardLayout";

const AdminSettingslazy = lazy(() => import("../view/admin/settings"));
const ServicesAdminLazy = lazy(() => import("../view/admin/services"));

type IProps = {
  isAdmin?: boolean;
  children: JSX.Element;
};

const RoutesAplication = () => {
  const { user, signOut } = useAuth();

  const Autenticate = ({ children, isAdmin }: IProps) => {
    let errAccess = false;
    if (!user) errAccess = true;

    if (isAdmin && user?.is_admin === 0) errAccess = true;

    if (errAccess) {
      signOut();
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<DashboardLayout />}>
        <Route
          path="/admin/settings"
          element={
            <Autenticate isAdmin>
              <Suspense fallback={<LoadingPage />}>
                <AdminSettingslazy />
              </Suspense>
            </Autenticate>
          }
        />

        <Route
          path="/admin/settings/services"
          element={
            <Autenticate isAdmin>
              <Suspense fallback={<LoadingPage />}>
                <ServicesAdminLazy />
              </Suspense>
            </Autenticate>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesAplication;
