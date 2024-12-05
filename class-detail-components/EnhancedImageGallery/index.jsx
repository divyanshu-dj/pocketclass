import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function EnhancedImageGallery({ images = [] }) {
  return (
    <div className="relative w-full h-[450px] max-w-[800px] mx-auto">
      {images?.length > 0 ? (
        <Swiper
          navigation={true}
          pagination={true}
          loop={true}
          modules={[Navigation, Pagination]}
          className="mySwiper rounded-xl overflow-hidden h-full"
        >
          {images?.map((imageUrl, index) => (
            <SwiperSlide key={`${imageUrl}-${index}`}>
              <div className="relative h-full w-full rounded-xl overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full w-full -z-10 overflow-hidden bg-cover bg-center bg-no-repeat blur-sm brightness-70"
                  style={{
                    backgroundImage: `url(${imageUrl})`
                  }}
                />
                <img
                  className="object-contain h-full w-full"
                  src={imageUrl}
                  alt={`Class image ${index + 1}`}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="animate-pulse w-full h-full rounded-xl overflow-hidden">
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="space-y-4 w-full px-8">
              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
              <div className="flex justify-center space-x-2 mt-8">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnhancedImageGallery;
