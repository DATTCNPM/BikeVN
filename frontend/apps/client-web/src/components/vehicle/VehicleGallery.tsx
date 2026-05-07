import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import motorbike1 from "../../assets/images/motorbike1.png";
import motorbike2 from "../../assets/images/motorbike2.png";
import motorbike3 from "../../assets/images/motorbike3.png";
import motorbike4 from "../../assets/images/motorbike4.png";

const images = [motorbike1, motorbike2, motorbike3, motorbike4];

export default function VehicleGallery() {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <div className="space-y-4">
      {/* Main Slider */}
      <Swiper
        modules={[Navigation, Thumbs]}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        className="rounded-2xl overflow-hidden"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} alt="" className="w-full h-[500px] object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Slider */}
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
              src={image}
              alt=""
              className="
                h-24
                w-full
                rounded-xl
                object-cover
                cursor-pointer
                border
              "
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
