import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import motorbike1 from "@/assets/images/motorbike1.png";
import motorbike2 from "@/assets/images/motorbike2.png";
import motorbike3 from "@/assets/images/motorbike3.png";
import motorbike4 from "@/assets/images/motorbike4.png";

const images = [motorbike1, motorbike2, motorbike3, motorbike4];
export default function Hero() {
  const plugin = useRef(
    Autoplay({
      delay: 2500,
      stopOnInteraction: true,
    }),
  );
  return (
    <section
      className="
    relative
    overflow-hidden
    min-h-screen
    bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_30%),linear-gradient(135deg,#000000_0%,#111111_35%,#1f1f1f_60%,#090909_100%)]
  "
    >
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[140px] rounded-full" />

      {/* Grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* Content */}
      <div className="z-10 container mx-auto px-6 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl">
          <p className="text-white/60 uppercase tracking-[0.3em] mb-4">
            Premium Vehicle Rental
          </p>

          <h1 className="text-6xl font-bold text-white leading-tight">
            Drive The Future
          </h1>

          <p className="mt-6 text-lg text-white/70">
            Trải nghiệm dịch vụ thuê xe cao cấp với phong cách hiện đại, sang
            trọng và tiện lợi.
          </p>

          <div className="flex gap-4 mt-8">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition">
              Thuê ngay
            </button>

            <button className="px-6 py-3 border border-white/20 text-white hover:bg-white/20 rounded-xl backdrop-blur-md">
              Khám phá
            </button>
          </div>
        </div>
        <Carousel
          plugins={[plugin.current]}
          className="w-full w-xl mx-auto"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <Card className="overflow-hidden border-white/10 bg-white/[0.03]">
                    <CardContent className="p-0">
                      <img
                        src={image}
                        alt={`Car ${index + 1}`}
                        className="
                      w-full
                      h-[250px] md:h-[400px]
                      object-cover
                    "
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className="
          border-white/10
          bg-black/40
          text-white
          hover:bg-black/60
        "
          />

          <CarouselNext
            className="
          border-white/10
          bg-black/40
          text-white
          hover:bg-black/60
        "
          />
        </Carousel>
      </div>
    </section>
  );
}
