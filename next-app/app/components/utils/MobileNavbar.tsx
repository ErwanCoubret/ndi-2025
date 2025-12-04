"use client";

import Link from "next/link";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";

const MobileNavbar = ({ currentRoute }: { currentRoute: string }) => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [hideMobileMenu, setHideMobileMenu] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<null | "pres" | "faq">(null);

  const closeMenu = () => {
    setHideMobileMenu(true);
    if (typeof window !== "undefined") {
      document.body.style.overflow = "auto"; // Restore body scroll
    }
    setOpenDropdown(null);
  };

  return (
    <>
      <nav
        id="navbar"
        className="w-full h-12 fixed top-0 z-50 flex justify-end pointer-events-none items-center px-5 mt-4 animate-fade"
      >
        <div className="pointer-events-auto lg:hidden">
          <button
            aria-label="Navbar toggle button"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-slate-800 cursor-pointer drop-shadow-lg"
            onClick={() => {
              setOpenMobileMenu(true);
              if (typeof window !== "undefined") {
                document.body.style.overflow = "hidden";
              }
              setHideMobileMenu(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </nav>

      {openMobileMenu && (
        <nav
          className={`fixed right-0 lg:hidden w-screen h-screen text-blue-400 z-50 bg-white border-purple-400 border-l-3 ${
            !hideMobileMenu
              ? "flex animate-navbarTranslateIn"
              : "animate-navbarTranslateOut"
          }`}
        >
          <div className="w-full px-8 absolute mt-5 flex justify-between items-center">
            <Link
              href={currentRoute === "/" ? "#hero" : "/"}
              onClick={closeMenu}
              className="flex justify-center items-center font-bold  italic gap-2"
            >
              <span className="text-xl">NDIR / Nuit De L'info</span>
            </Link>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-800 bg-slate-100 cursor-pointer hover:bg-slate-200 transition-colors duration-300"
              onClick={closeMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <ul className="flex flex-col max-w-100 items-start text-xl text-slate-800 uppercase px-8 pt-32 gap-3 h-full overflow-y-auto w-full">
            {/* Présentation Dropdown */}
            <li>
              <Link
                href="/#chatbot"
                onClick={closeMenu}
                className="flex items-center px-5 py-2 rounded w-full hover:bg-slate-100 transition-colors duration-300"
              >
                Chatbot
              </Link>
            </li>

            <li>
              <Link
                href="/#snake"
                onClick={closeMenu}
                className="flex items-center px-5 py-2 rounded w-full hover:bg-slate-100 transition-colors duration-300"
              >
                Snake
              </Link>
            </li>

            <li>
              <Link
                href="/#demineur"
                onClick={closeMenu}
                className="flex items-center px-5 py-2 rounded w-full hover:bg-slate-100 transition-colors duration-300"
              >
                Démineur
              </Link>
            </li>

            <li>
              <Link
                href="https://dashboard.flots.app/"
                onClick={closeMenu}
                className="flex items-center border border-secondary-main justify-center hover:bg-linear-to-r from-[#4751E3] via-[#8955E6] to-[#FD80E6] hover:text-white hover:scale-110 px-5 py-2 rounded-full w-full transition-transform"
              >
                L'association
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default MobileNavbar;
