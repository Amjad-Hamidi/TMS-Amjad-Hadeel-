import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const images = [
"/images/ceritifecation.jpeg","/images/cet2.jpeg"
];

const ImageSlider = () => {
  return (
    <div className="w-full  mx-auto">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
  
        
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        className="rounded-lg shadow-lg"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-80 object-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
