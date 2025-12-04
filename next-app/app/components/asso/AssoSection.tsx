import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export default function AssoSection() {
  return (
    <div id="asso" className="w-full h-fit pb-1 px-1 lg:pb-3 lg:px-3">
      <div className="w-full h-full min-h-[70vh] flex flex-col gap-10 items-center justify-center bg-slate-100 py-20 px-4 rounded xl:rounded-xl relative overflow-hidden">
        <h1 className="text-center text-3xl font-bold text-purple-400">
          La démarche NIRD
        </h1>

        <p className="text-slate-500 max-w-250 border-l-2 border-purple-400 py-1 pl-4 italic">
          À l’heure où la fin annoncée du support de Windows 10 met en lumière
          une dépendance structurelle critique aux géants de la Tech, les
          établissements scolaires se retrouvent confrontés à un véritable
          empire numérique.
        </p>

        <div className="flex flex-col gap-4 items-center justify-center">
          <Image
            src="/asso/image.png"
            alt="Description"
            width={500}
            height={300}
            className="rounded-lg"
          />
          <span className="text-sm text-slate-500">
            Image illustrative de la démarche NIRD, source: NIRD
          </span>
        </div>

        <p className="text-slate-500 max-w-250">
          Nous faisons face à un système puissant qui impose un matériel rendu
          obsolète alors qu’il est encore fonctionnel, des licences coûteuses,
          un stockage de données hors de l'Union Européenne et des écosystèmes
          fermés qui enferment les utilisateurs. Face à ce "Goliath" numérique,
          l'École a le devoir et la capacité de devenir un village résistant,
          ingénieux et autonome, en refusant la fatalité du gaspillage et de la
          surveillance.
        </p>

        <p className="text-slate-500 max-w-250">
          La démarche NIRD (Numérique Inclusif, Responsable et Durable) incarne
          cette ambition de résistance constructive. Elle vise à permettre aux
          établissements scolaires d’adopter progressivement des solutions
          libres pour redonner du pouvoir d’agir aux équipes éducatives. En
          remplaçant les systèmes propriétaires par Linux et en favorisant le
          reconditionnement, nous luttons concrètement contre l'obsolescence
          programmée.
        </p>

        <p className="text-slate-500 max-w-250">
          C'est une approche globale qui ne se limite pas à la technique, mais
          qui englobe une dimension éthique et écologique, permettant de former
          des citoyens numériques éclairés plutôt que de simples consommateurs
          captifs.
        </p>

        <Link
          href="https://nird.forge.apps.education.fr/"
          target="_blank"
          className="bg-white w-fit text-purple-400 flex items-center justify-center px-6 py-2 rounded-full transform hover:scale-105 duration-300 hover:bg-purple-400 hover:text-white transition-all cursor-pointer group relative"
        >
          <FaArrowRight className="absolute right-6 transform transition-all duration-300 ease-in-out rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100 group-hover:right-4" />
          <span className="transition-all duration-300 ease-in-out group-hover:pr-6">
            Site de la démarche NIRD 
          </span>
        </Link>
      </div>
    </div>
  );
}
