import { RoomList } from "../../components/RoomList/RoomList";
import { Banner } from "../../components/Banner/Banner";
import { locationProps } from "../../assets/data/mockData";
import { useSearchParams } from "react-router-dom";
import "./Location.scss";

export const Location = () => {
    const [searchParams] = useSearchParams();
    const location = searchParams.get("location");
    const props = locationProps.find(item => item.id === location);
    return (
        <div>
            <Banner
                {...props}
            ></Banner>
            <RoomList></RoomList>
        </div>
    );
};
