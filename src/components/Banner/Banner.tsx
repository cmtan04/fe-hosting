import { FormSearch } from "../FormSearch/formSearch";
import "./Banner.scss";
export const Banner = (props: any) => {
    console.log("Banner props:", props);
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