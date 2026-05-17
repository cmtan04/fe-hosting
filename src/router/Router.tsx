import { Navigate, Route, Routes } from "react-router-dom";
import { ForgotPassword } from "@pages/Auth/ForgotPassword/ForgotPassword";
import { ResetPassword } from "@pages/Auth/ResetPassword/ResetPassword";
import { SignIn } from "@pages/Auth/SignIn/SignIn";
import { SignUp } from "@pages/Auth/SignUp/SignUp";
import { VerifyEmail } from "@pages/Auth/VerifyEmail/VerifyEmail";
import { RenterLayout } from "@pages/Renter/";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTER_PATH } from "./Route";
import { Profile } from "@pages/Profile";
import { ProfileInformation } from "@pages/Profile/ProfileInformation";
import { ProfileLocation } from "@pages/Profile/ProfileLocation";
import { ProfileLocationDetail } from "@pages/Profile/ProfileLocation/ProfileLocationDetail";
import { ProfileChat } from "@pages/Profile/ProfileChat";
import { LocationList } from "@pages/Location/pages/LocationList";
import { LocationMap } from "@pages/Location/pages/LocationMap";
import { Home } from "@pages/Home/pages/Home";
import { HomePage } from "@pages/Home/pages/HomePage/HomePage";
import { LocationDetail } from "@pages/Location/pages/LocationDetail";
import { ProfileOwnerPackage } from "@pages/Profile/ProfileOwnerPackage";

export const WebRouter = () => (
  <Routes>
    <Route path="/" element={<Navigate to={ROUTER_PATH.HOME} replace />} />
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

    {/* Home */}
    <Route path={ROUTER_PATH.HOME} element={<Home />}>
      <Route path={ROUTER_PATH.HOME} element={<HomePage />}></Route>
      <Route path={ROUTER_PATH.LOCATIONS} element={<LocationList />}></Route>
      <Route path={ROUTER_PATH.MAP} element={<LocationMap />}></Route>
      <Route
        path={ROUTER_PATH.LOCATION_DETAIL}
        element={<LocationDetail />}
      ></Route>
    </Route>
    {/* Home */}

    {/* Protected Router */}
    <Route element={<ProtectedRoute />}>
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
        <Route
          path={ROUTER_PATH.PROFILE_OWNER_PACKAGE}
          element={<ProfileOwnerPackage />}
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
