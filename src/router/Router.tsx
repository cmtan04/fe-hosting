import { Route, Routes } from "react-router-dom";
import { SignIn } from "../pages/Auth/SignIn/SignIn";
import { SignUp } from "../pages/Auth/SignUp/SignUp";
import { ROUTER_PATH } from "./Route";
import { ForgotPassword } from "../pages/Auth/ForgotPassword/ForgotPassword";
import { VerifyEmail } from "../pages/Auth/VerifyEmail/VerifyEmail";
import { ResetPassword } from "../pages/Auth/ResetPassword/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import { Home } from "../pages/Home/Home";
import { HomePage } from "../pages/Home/HomePage/HomePage";

export const WebRouter = () => (
  <Routes>
    {/* Auth */}
    <Route path={ROUTER_PATH.SIGN_IN} element={<SignIn />}></Route>
    <Route path={ROUTER_PATH.SIGN_UP} element={<SignUp />}></Route>
    <Route
      path={ROUTER_PATH.FORGOT_PASSWORD}
      element={<ForgotPassword />}
    ></Route>
    <Route path={ROUTER_PATH.VERIFY_EMAIL} element={<VerifyEmail />}></Route>
    <Route
      path={ROUTER_PATH.RESET_PASSWORD}
      element={<ResetPassword />}
    ></Route>
    {/* Auth */}

    {/* Protected Router */}
    <Route element={<ProtectedRoute />}>
      {/* Home */}
      <Route path={ROUTER_PATH.HOME} element={<Home />}>
        <Route path={ROUTER_PATH.HOME_PAGE} element={<HomePage />}></Route>
      </Route>
      {/* Home */}
    </Route>
    {/* Protected Router */}
  </Routes>
);
