import { Route, Routes } from "react-router-dom";
import { ForgotPassword } from "../pages/Auth/ForgotPassword/ForgotPassword";
import { ResetPassword } from "../pages/Auth/ResetPassword/ResetPassword";
import { SignIn } from "../pages/Auth/SignIn/SignIn";
import { SignUp } from "../pages/Auth/SignUp/SignUp";
import { VerifyEmail } from "../pages/Auth/VerifyEmail/VerifyEmail";
import { RenterLayout } from "../pages/Renter/RenterLayout";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTER_PATH } from "./Route";
import { Profile } from "../pages/Profile/pages";
import { ProfileInformation } from "../pages/Profile/pages/ProfileInformation";
import { ProfileLocation } from "../pages/Profile/pages/ProfileLocation";
import { ProfileLocationDetail } from "../pages/Profile/pages/ProfileLocation/ProfileLocationDetail";
import { ProfileChat } from "../pages/Profile/pages/ProfileChat";
import { LocationList } from "../pages/Location/pages/LocationList";
import { Home } from "../pages/Home/pages/Home";
import { HomePage } from "../pages/Home/pages/HomePage/HomePage";

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
        <Route path={ROUTER_PATH.LOCATION} element={<LocationList />}></Route>
      </Route>
      {/* Home */}
      {/* PROFILE */}
      <Route path={ROUTER_PATH.PROFILE} element={<Profile />}>
        <Route
          path={ROUTER_PATH.PROFILE_INFORMATION}
          element={<ProfileInformation />}
        ></Route>
        <Route
          path={ROUTER_PATH.PROFILE_LOCATION}
          element={<ProfileLocation />}
        ></Route>
        <Route
          path={ROUTER_PATH.PROFILE_LOCATION_DETAIL}
          element={<ProfileLocationDetail />}
        ></Route>
        <Route
          path={ROUTER_PATH.PROFILE_CHAT}
          element={<ProfileChat />}
        ></Route>
      </Route>
      {/* PROFILE */}
      {/* RENTER */}
      <Route path={ROUTER_PATH.RENTER} element={<RenterLayout />} />
      {/* RENTER */}
    </Route>
    {/* Protected Router */}
  </Routes>
);
