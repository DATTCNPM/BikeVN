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
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={`http://localhost:8080${image.imageUrl}` || image.imageUrl} // Sử dụng URL hình ảnh thực tế
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
