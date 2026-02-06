import { useEffect } from "react";
import { FormSearch } from "../FormSearch/formSearch";
import "./Banner.scss";
export const Banner = (props: any) => {
    // Cuộn lên đầu trang mỗi khi vào trang có Banner
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [props?.id]);
    return (
        <div className="banner" style={{ background: `url(${props?.image}) no-repeat center center/cover` }}>

            <div className="banner__content">
                <h1 className="banner__content-title">
                    {props?.title}
                </h1>
                <p className="banner__content-description">
                    {props?.description}
                </p>
                <FormSearch
                    label=""
                    name="search"
                    formItemProps={{
                        className: "banner__content-search",
                    }}
                />
            </div>
        </div>
    );
};