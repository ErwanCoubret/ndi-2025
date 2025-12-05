import Link from "next/link";
import { FaArrowRight, FaCheck } from "react-icons/fa6";
import { ImCross } from "react-icons/im";

export default function MineSwipperSection({ mineFlag }: { mineFlag: boolean }) {
  return (
    <div id="demineur" className="relative w-full h-fit pb-1 px-1 lg:pb-3 lg:px-3 overflow-hidden">
      <div className="w-full h-full min-h-[70vh] flex flex-col gap-5 items-center justify-center bg-slate-100 py-10 px-4 rounded xl:rounded-xl relative overflow-hidden">
        <div
          className={`py-2 px-4 w-fit rounded-full border hover:rotate-2 hover:scale-105 transition-transform duration-300 flex items-center ${
            mineFlag
              ? "border-green-500 bg-green-100"
              : "border-slate-300 bg-slate-200"
          }`}
        >
          {mineFlag ? (
            <>
              <FaCheck className="text-green-500 mr-2" />
              Validé
            </>
          ) : (
            <>
              <ImCross className="text-red-500 mr-2 opacity-70" />
              À faire
            </>
          )}
        </div>

        <p className="text-center text-3xl text-purple-400 font-bold">
          Déminez l'Obsolescence Programmée ! 💣🔧♻️
        </p>

        {/* <img src="/emojis/bomb.png" alt="bomb" className="w-[20rem] opacity-0 lg:opacity-20 left-20 -rotate-12 absolute" />

        <img src="/emojis/triangular-flag.png" alt="flag" className="w-[15rem] opacity-5 lg:opacity-15 right-20 top-8 rotate-12 absolute" /> */}

        <img src="/emojis/recycling-symbol.png" alt="recycling" className="w-[10rem] opacity-0 lg:opacity-10 right-1/4 bottom-10 -rotate-6 absolute" />

        <p className="text-center text-slate-500 font-medium max-w-2xl z-10">
          Explorez les fonctionnalités interactives et découvrez comment nous aidons à
          prolonger la durée de vie des produits électroniques tout en réduisant
          les déchets technologiques.
        </p>

        <Link
          href="/demineur"
          className="bg-white w-fit text-purple-400 flex items-center justify-center px-6 py-2 rounded-full transform hover:scale-105 duration-300 hover:bg-purple-400 hover:text-white transition-all cursor-pointer group relative z-10"
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
