import { Banner } from "../../../components/Banner/Banner";
import { RoomList } from "../../../components/RoomList/RoomList";
import { roomTypeProps } from "../../../assets/data/mockData";
import { useSearchParams } from "react-router-dom";
import "./RentPage.scss";
import { Pagination } from "../../../components/PaginationCommon/paginationCommon";

export const RentPage = () => {
    const [searchParams] = useSearchParams();
    const rent = searchParams.get("rent");
    const props = roomTypeProps.find(item => item.id === rent);

    return (
        <div>
            <Banner
                {...props}
            ></Banner>
            <RoomList></RoomList>
        </div>
    );
};
