"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowDown } from "react-icons/fa6";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="w-full h-screen flex items-center justify-center sm:p-2 lg:p-3"
    >
      <div className="w-full h-full rounded-b sm:rounded xl:rounded-xl relative">
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

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-5 -mt-12">
          <div className="text-2xl lg:text-3xl xl:text-4xl italic font-semibold mt-2 lg:mt-0 mb-4">
        Il est temps de révolutionner l'
        <span
          className="font-extrabold text-purple-200"
          style={{
            background: "linear-gradient(-45deg, #5656FF, #C2C2FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          informatique responsable
        </span>
          </div>

          <p className="font-light text-base xl:text-lg px-8 max-w-200">
        Découvrez à travers d'activités ludiques comment réduire notre empreinte numérique et agir pour un futur numérique plus durable.
          </p>

          <div className="flex w-full max-w-100 gap-3 mt-6 font-medium xl:text-lg">
        <Link
          href="https://dashboard.flots.app/"
          className="bg-white w-full text-blue-500 flex items-center justify-center px-6 py-2 rounded-full transform hover:scale-105 duration-300 hover:bg-blue-500 hover:text-white transition-all cursor-pointer group relative"
        >
          <FaArrowDown className="absolute right-6 transform transition-all duration-300 ease-in-out rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100 group-hover:right-4" />
          <span className="transition-all duration-300 ease-in-out group-hover:pr-6">
            Les activités 
          </span>
        </Link>
        <Link
          href="https://dashboard.flots.app/"
          className="bg-white w-full text-blue-500 flex items-center justify-center px-6 py-2 rounded-full transform hover:scale-105 duration-300 hover:bg-blue-500 hover:text-white transition-all cursor-pointer group relative"
        >
          <FaArrowDown className="absolute right-6 transform transition-all duration-300 ease-in-out rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100 group-hover:right-4" />
          <span className="transition-all duration-300 ease-in-out group-hover:pr-6">
            L'association 
          </span>
        </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
