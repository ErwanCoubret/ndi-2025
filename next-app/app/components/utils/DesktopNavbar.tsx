"use client";

import Link from "next/link";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";

const DesktopNavbar = ({ currentRoute }: { currentRoute: string }) => {
  const [isPresDropdownOpen, setIsPresDropdownOpen] = useState(false);

  return (
    <nav
      id="navbar"
      className="w-6/7 lg:w-5/6 xl:w-2/3 min-w-200 max-w-300 h-14 select-none mx-auto fixed left-1/2 -translate-x-1/2 top-0 z-50 flex items-center justify-between bg-white px-1 mt-12 ld:mt-8 shadow-md rounded-full"
    >
      <Link
        href={currentRoute === "/" ? "/#hero" : "/"}
        className={`flex justify-center items-center gap-2 text-slate-800 ml-4`}
      >
        <p className="text-xl font-bold italic">NDIR / Nuit De L'info</p>
      </Link>

      <ul
        className={`flex gap-2 items-center rounded-lg p-1.5 text-slate-800 uppercase text-sm pointer-events-auto`}
      >
        <li className="flex items-center">
          <Link
            href="/#chatbot"
            className={`flex items-center whitespace-nowrap justify-center hover:bg-slate-100 transition-colors duration-300 px-5 py-2 rounded-full w-full`}
          >
            Chatbot
          </Link>
        </li>

        <li className="flex items-center">
          <Link
            href="/#snake"
            className={`flex items-center whitespace-nowrap justify-center hover:bg-slate-100 transition-colors duration-300 px-5 py-2 rounded-full w-full`}
          >
            Snake
          </Link>
        </li>

        <li className="flex items-center">
          <Link
            href="/#demineur"
            className={`flex items-center whitespace-nowrap justify-center hover:bg-slate-100 transition-colors duration-300 px-5 py-2 rounded-full w-full`}
          >
            Démineur
          </Link>
        </li>

        <Link
          href="https://dashboard.flots.app/"
          className="bg-white border border-secondary-main text-blue-500 flex items-center justify-center px-6 py-2 rounded-full transform duration-300 hover:bg-blue-500 hover:text-white transition-all cursor-pointer group relative"
        >
          <FaArrowRight className="absolute right-2 transform transition-all duration-300 ease-in-out rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100 group-hover:right-5" />
          <span className="transition-all duration-300 ease-in-out group-hover:pr-6">
            L'association
          </span>
        </Link>
      </ul>
    </nav>
  );
};

export default DesktopNavbar;
