import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export default function MineSwipperSection() {
  return (
    <div id="demineur" className="w-full h-fit pb-1 px-1 lg:pb-3 lg:px-3">
      <div className="w-full h-full min-h-[70vh] flex flex-col gap-5 items-center justify-center bg-slate-100 py-10 px-4 rounded xl:rounded-xl relative overflow-hidden">
        <p className="text-center text-3xl text-purple-400 font-bold">
          Mine Swipper Section Placeholder
        </p>

        <p className="text-center text-slate-500 font-medium max-w-2xl">
          Mine Swipper Section Description
        </p>

        <Link
          href="/demineur"
          className="bg-white w-fit text-purple-400 flex items-center justify-center px-6 py-2 rounded-full transform hover:scale-105 duration-300 hover:bg-purple-400 hover:text-white transition-all cursor-pointer group relative"
        >
          <FaArrowRight className="absolute right-6 transform transition-all duration-300 ease-in-out rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100 group-hover:right-4" />
          <span className="transition-all duration-300 ease-in-out group-hover:pr-6">
            Accéder au Démineur 
          </span>
        </Link>
      </div>
    </div>
  );
}
