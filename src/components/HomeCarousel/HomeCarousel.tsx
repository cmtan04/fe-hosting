import { Carousel } from "antd";
import { HomeCard, type HomeCardProps } from "../HomeCard/HomeCard";
import { forwardRef, useImperativeHandle, useRef } from "react";
import type { CarouselRef } from "antd/es/carousel";

interface HomeCarouselProps {
  items: HomeCardProps[];
  autoPlay?: boolean;
  autoPlaySpeed?: number;
  dots?: boolean;
  slidesToShow?: number;
}

export interface HomeCarouselRef {
  next: () => void;
  prev: () => void;
  goTo: (slide: number) => void;
}

export const HomeCarousel = forwardRef<HomeCarouselRef, HomeCarouselProps>(
  (
    {
      items,
      autoPlay = true,
      autoPlaySpeed = 3000,
      dots = true,
      slidesToShow = 1,
    },
    ref,
  ) => {
    const carouselRef = useRef<CarouselRef>(null);

    useImperativeHandle(ref, () => ({
      next: () => carouselRef.current?.next(),
      prev: () => carouselRef.current?.prev(),
      goTo: (slide: number) => carouselRef.current?.goTo(slide),
    }));

    return (
      <div className="home-carousel">
        <Carousel
          ref={carouselRef}
          autoplay={autoPlay}
          autoplaySpeed={autoPlaySpeed}
          dots={dots}
          slidesToShow={slidesToShow}
          infinite
          speed={500}
          cssEase="ease-in-out"
          arrows={false}
        >
          {items.map((item, index) => (
            <div key={index} className="carousel-slide">
              <HomeCard {...item} />
            </div>
          ))}
        </Carousel>
      </div>
    );
  },
);
