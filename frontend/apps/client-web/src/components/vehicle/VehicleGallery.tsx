import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import type { VehicleImage } from "@repo/types";
// 1. Import module Autoplay
import { Navigation, Thumbs, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
// 2. (Tùy chọn) Import CSS cho autoplay nếu cần hiệu ứng đặc biệt
import "swiper/css/autoplay";

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
      {/* Main Slider */}
      <Swiper
        // 3. Thêm Autoplay vào mảng modules
        modules={[Navigation, Thumbs, Autoplay]}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        // 4. Cấu hình autoplay tại đây
        autoplay={{
          delay: 3000, // Thời gian chờ giữa các hình (3 giây)
          disableOnInteraction: false, // Tiếp tục chạy sau khi người dùng tương tác (vuốt/click)
        }}
        className="rounded-2xl overflow-hidden"
      >
        {images.length === 0
          ? imageMock.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt=""
                  className="w-full h-[500px] object-cover"
                />
              </SwiperSlide>
            ))
          : images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={
                    `http://localhost:8080${image.imageUrl}` || image.imageUrl
                  } // Sử dụng URL hình ảnh thực tế
                  alt=""
                  className="w-full h-[500px] object-cover"
                />
              </SwiperSlide>
            ))}
      </Swiper>

      {/* Thumbnail Slider - Thường không cần autoplay cho phần này */}
      {showThumbnail && (
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          watchSlidesProgress
          spaceBetween={12}
          slidesPerView={4}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={`http://localhost:8080${image.imageUrl}` || image.imageUrl} // Sử dụng URL hình ảnh thực tế
                alt=""
                className="h-24 w-full rounded-xl object-cover cursor-pointer border"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
