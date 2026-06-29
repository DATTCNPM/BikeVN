import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { VehicleImage } from "@repo/types";

// 1. Core modules configuration
import { Navigation, Thumbs, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/autoplay";

import { getImageUrl } from "@repo/utils";
import motorbike1 from "../../assets/images/motorbike1.png";
import motorbike2 from "../../assets/images/motorbike2.png";
import motorbike3 from "../../assets/images/motorbike3.png";
import motorbike4 from "../../assets/images/motorbike4.png";

const imageMock = [motorbike1, motorbike2, motorbike3, motorbike4];

export default function VehicleGallery({
  showThumbnail = true,
  images,
}: {
  showThumbnail?: boolean;
  images: VehicleImage[];
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <div className="space-y-4">
      {/* Main Feature Gallery Carousel */}
      <Swiper
        modules={[Navigation, Thumbs, Autoplay]}
        navigation
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        autoplay={{
          delay: 3500, // Duration before automated transition
          disableOnInteraction: false, // Resume dynamic looping continuous to explicit user touch events
        }}
        className="rounded-2xl overflow-hidden shadow-sm border border-muted/40"
      >
        {images.length === 0
          ? imageMock.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt="Vehicle preview placeholder"
                  className="w-full h-[480px] object-cover"
                />
              </SwiperSlide>
            ))
          : images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={getImageUrl(image.imageUrl)}
                  alt={
                    image.altText ||
                    `Vehicle presentation viewpoint ${index + 1}`
                  }
                  className="w-full h-[480px] object-cover"
                />
              </SwiperSlide>
            ))}
      </Swiper>

      {/* Synchronized Thumbnails Drawer */}
      {showThumbnail && images.length > 0 && (
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          watchSlidesProgress
          spaceBetween={12}
          slidesPerView={4}
          className="mt-2"
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={index}
              className="opacity-75 hover:opacity-100 transition-opacity"
            >
              <img
                src={getImageUrl(image.imageUrl)}
                alt={`Thumbnail indicator ${index + 1}`}
                className="h-20 w-full rounded-xl object-cover cursor-pointer border border-muted transition-all dynamic-thumbnail"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
