"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import messages from "@/messages.json";

import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <section className="flex flex-col justify-center items-center">
        <h1 className="mb-8 md:mb-12 text-7xl font-semibold">
          Bhadresh dingle
        </h1>
        <Carousel
          className="w-full max-w-xs"
          plugins={[Autoplay({ delay: 2000 })]}
        >
          <CarouselContent>
            {messages.map((item) => (
              <CarouselItem key={item.title}>
                <div className="p-1">
                  <Card>
                    <CardHeader className="text-2xl font-bold">{item.title}</CardHeader>
                    <CardContent className="flex items-center">
                      <span className="font-semibold">{item.content}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </main>
  );
}
