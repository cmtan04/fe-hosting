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
import { Filter } from "../pages/Filter/Filter";
import { RentPage } from "../pages/RentPage/RentPage";
import { Location } from "../pages/Location/Location";
import { RoomDetailPage } from "../pages/RoomDetail/RoomDetailPage";
import { RenterLayout } from "../pages/Renter/RenterLayout";

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
        <Route path={ROUTER_PATH.HOME} element={<HomePage />}></Route>
        <Route path={ROUTER_PATH.FILTER} element={<Filter />}></Route>
        <Route path={ROUTER_PATH.RENT} element={<RentPage />}>
          {" "}
        </Route>
        <Route path={ROUTER_PATH.LOCATION} element={<Location />}></Route>
        <Route
          path={ROUTER_PATH.ROOMDETAIL}
          element={<RoomDetailPage />}
        ></Route>
      </Route>
      {/* Home */}
      {/* RENTER */}
      <Route path={ROUTER_PATH.RENTER} element={<RenterLayout />} />
      {/* RENTER */}
    </Route>
    {/* Protected Router */}
  </Routes>
);
