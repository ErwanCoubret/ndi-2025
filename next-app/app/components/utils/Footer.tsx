import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full h-fit py-8 px-10 lg:py-16 lg:px-20 xl:px-47 flex items-center justify-center bg-white">
      <div className="w-full flex flex-col gap-8 lg:flex-row items-start justify-between">
        <div className="flex flex-col justify-start gap-1 w-50">
          <div className="flex items-center gap-2 text-slate-500">
            <p className="text-xl font-bold italic">Babteam sous NDI</p>
          </div>

          <p className="text-slate-500 font-light text-xs mb-2">
            Une équipe 100% TPS
          </p>

          <Image
            src="/tps.png"
            alt="Logo TPS"
            width={170}
            height={40}
            className="object-contain select-none"
            draggable="false"
          />
        </div>

        <div className="flex flex-col text-slate-500 gap-1.5 w-50">
          <p
            className="relative font-bold italic group w-fit"
          >
            Les activités 
          </p>
          <Link href={"/#chatbot"} className="relative group w-fit">
            Chatbot
            <span className="absolute left-0 bottom-0 w-0 h-px bg-purple-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href={"/#snake"} className="relative group w-fit">
            Snake
            <span className="absolute left-0 bottom-0 w-0 h-px bg-purple-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href={"/#demineur"} className="relative group w-fit">
            Démineur
            <span className="absolute left-0 bottom-0 w-0 h-px bg-purple-400 transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        <div className="flex flex-col text-slate-500 gap-1.5 w-50">
          <p
            className="relative font-bold italic group w-fit"
          >
            La démarche NIRD
          </p>
          <Link href={"/#asso"} className="relative group w-fit">
            Explication
            <span className="absolute left-0 bottom-0 w-0 h-px bg-purple-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href={"https://nird.forge.apps.education.fr/"} target="_blank" className="relative group w-fit">
            Site de NIRD
            <span className="absolute left-0 bottom-0 w-0 h-px bg-purple-400 transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        <div className="flex flex-col text-slate-500 gap-1.5 w-50">
          <h1 className="relative font-bold italic group w-fit">
            L'équipe
          </h1>
          <Link href={"https://www.linkedin.com/in/nathan-wurpillot-b187122b1/"} target="_blank" className="relative italic group w-fit">
            Nathan Wurpillot
            <span className="absolute left-0 bottom-0 w-0 h-px bg-purple-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href={"https://www.linkedin.com/in/antoine-bretzner-17a501331/"} target="_blank" className="relative italic group w-fit">
            Antoine Bretzner
            <span className="absolute left-0 bottom-0 w-0 h-px bg-purple-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href={"https://www.linkedin.com/in/ryan-belaib-978a69294/"} target="_blank" className="relative italic group w-fit">
            Ryan Belaib
            <span className="absolute left-0 bottom-0 w-0 h-px bg-purple-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href={"https://www.linkedin.com/in/adrien-jayat/"} target="_blank" className="relative italic group w-fit">
            Adrien Jayat
            <span className="absolute left-0 bottom-0 w-0 h-px bg-purple-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href={"https://www.linkedin.com/in/erwan-coubret/"} target="_blank" className="relative italic group w-fit">
            Erwan Coubret
            <span className="absolute left-0 bottom-0 w-0 h-px bg-purple-400 transition-all duration-300 group-hover:w-full" />
          </Link>
        
        </div>
      </div>
    </footer>
  );
}
