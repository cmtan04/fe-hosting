import { Outlet } from "react-router-dom";
import "./home.scss";
import { TopBar } from "../../components/TopBar/TopBar";

export const Home = () => {
  return (
    <div className="home">
      <div className="home__top">
        <TopBar />
      </div>
      <div className="home__body">
        <Outlet />
      </div>
      <div className="home__footer"></div>
    </div>
  );
};
