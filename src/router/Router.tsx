import { Route, Routes } from "react-router-dom";
import { SignIn } from "../pages/Auth/SignIn/SignIn";
import { SignUp } from "../pages/Auth/SignUp/SignUp";
import { SuspenseWrapper } from "../providers";
import { ROUTER_PATH } from "./Route";

export const WebRouter = () => (
  <Routes>
    {/* Login */}
    <Route
      path={ROUTER_PATH.SIGN_IN}
      element={<SuspenseWrapper component={<SignIn />} />}
    ></Route>
    <Route
      path={ROUTER_PATH.SIGN_UP}
      element={<SuspenseWrapper component={<SignUp />} />}
    ></Route>
  </Routes>
);
