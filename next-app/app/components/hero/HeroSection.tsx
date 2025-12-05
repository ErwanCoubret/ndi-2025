"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowDown } from "react-icons/fa6";

import Vector from "@/public/hero/Vector.svg";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `0`;
    path.style.strokeLinecap = "round";

    const animation = gsap.to(path, {
      strokeDashoffset: `-${length}`,
      scrollTrigger: {
        trigger: path,
        start: "top 0%",
        end: "bottom 40%",
        scrub: true,
      },
      ease: "none",
      duration: 1,
    });

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <section
      id="hero"
      className="w-full h-screen flex items-center justify-center sm:p-2 lg:p-3"
    >
      <div className="relative w-full h-full min-h-[95vh] bg-slate-100 py-10 px-4 rounded xl:rounded-xl flex flex-col gap-10 xl:gap-12 items-center justify-center z-10 overflow-hidden">
        <Image
          src="/hero/Hero_square.png"
          alt="Hero image"
          fill
          quality={100}
          priority
          unoptimized
          className="object-cover rounded-b sm:rounded lg:rounded-xl select-none"
          draggable="false"
        />

        <div className="absolute inset-0 flex flex-col items-center shadow-xl justify-center text-white text-center px-5 mt-10">
          <div className="hidden sm:block absolute w-full xl:mt-20 top-1/2 opacity-40 -translate-y-1/4 2xl:top-0 2xl:translate-y-0 pointer-events-none z-5">
            <Vector
              ref={(node: SVGSVGElement | null) => {
                if (!node) return;
                const path = node.querySelector(
                  "path"
                ) as SVGPathElement | null;
                pathRef.current = path;
              }}
            />
          </div>

          <div className="z-20 text-3xl lg:text-3xl xl:text-5xl italic font-semibold mt-2 lg:mt-0 mb-4 animation-fade">
            Il est temps de révolutionner l'
            <span
              className="font-extrabold text-purple-200"
              style={{
                background: "linear-gradient(-45deg, #FFFFFF, #D8B4FE)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              informatique responsable
            </span>
          </div>

          <p
            className="font-light text-base xl:text-xl px-8 max-w-250 opacity-0 animation-fade"
            style={{ animationDelay: "100ms" }}
          >
            Découvrez à travers d'activités ludiques comment réduire notre
            empreinte numérique et agir pour un futur numérique plus durable.
          </p>

          <div className="flex max-w-100 gap-3 z-20 mt-6 font-medium xl:text-lg">
            <Link
              href="/#activity"
              className="opacity-0 animation-fade bg-white w-fit text-purple-400 flex items-center justify-center px-6 py-2 rounded-full transform hover:scale-105 duration-300 hover:bg-purple-400 hover:text-white transition-all cursor-pointer group relative"
            >
              <FaArrowDown
                style={{ animationDelay: "200ms" }}
                className="absolute right-6 transform transition-all duration-300 ease-in-out rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100 group-hover:right-4"
              />
              <span className="transition-all duration-300 ease-in-out group-hover:pr-6">
                Les activités
              </span>
            </Link>
            <Link
              href="/#asso"
              style={{ animationDelay: "300ms" }}
              className="opacity-0 animation-fade bg-white w-fit text-purple-400 flex items-center justify-center px-6 py-2 rounded-full transform hover:scale-105 duration-300 hover:bg-purple-400 hover:text-white transition-all cursor-pointer group relative"
            >
              <FaArrowDown className="absolute right-6 transform transition-all duration-300 ease-in-out rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100 group-hover:right-4" />
              <span className="transition-all duration-300 ease-in-out group-hover:pr-6">
                L'association NIRD
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
