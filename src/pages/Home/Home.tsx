import { Outlet } from "react-router-dom";
import "./home.scss";

export const Home = () => {
  return (
    <div className="home">
      <div className="home__top"></div>
      <div className="home__body">
        <Outlet />
      </div>
      <div className="home__footer"></div>
    </div>
  );
};
