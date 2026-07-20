import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { VehicleImage } from "@repo/types";

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
          delay: 3500,
          disableOnInteraction: false,
        }}
        className="rounded-2xl overflow-hidden shadow-sm border border-muted/40"
      >
        {images.length === 0
          ? imageMock.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt="Vehicle preview placeholder"
                  // Đổi thành object-contain + thêm background nhẹ để tôn dáng xe
                  className="w-full h-[460px] object-contain bg-zinc-50 dark:bg-zinc-900/40"
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
                  // Đổi thành object-contain + thêm background nhẹ để tôn dáng xe
                  className="w-full h-[460px] object-contain bg-zinc-50 dark:bg-zinc-900/40"
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
                // Đồng bộ object-contain cho cả thumbnail để nhìn rõ góc ảnh nhỏ
                className="h-20 w-full rounded-xl object-contain cursor-pointer border border-muted bg-zinc-50 dark:bg-zinc-900/40 transition-all dynamic-thumbnail"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
