import { FaCheck } from "react-icons/fa6";
import { ImCross } from "react-icons/im";

export default function ActivitySection({
  chatbotFlag,
  setChatbotFlag,
  snakeFlag,
  setSnakeFlag,
  mineFlag,
  setMineFlag,
}: {
  chatbotFlag: boolean;
  setChatbotFlag: (flag: boolean) => void;
  snakeFlag: boolean;
  setSnakeFlag: (flag: boolean) => void;
  mineFlag: boolean;
  setMineFlag: (flag: boolean) => void;
}) {
  return (
    <div className="relative w-full h-fit pb-1 px-1 lg:pb-3 lg:px-3 text-lg">
      <div id="activity" className="absolute -mt-20" />

      <div className="w-full h-full text-slate-500 min-h-[50vh] flex flex-col gap-10 items-center justify-center bg-slate-100 py-20 px-4 rounded xl:rounded-xl relative overflow-hidden">
        <h1 className="text-center text-3xl font-bold text-purple-400">
          Les activités !!!
        </h1>

        <p className=" max-w-250 border-l-2 border-purple-400 py-1 pl-4 italic">
          Convaincre par les arguments, c'est bien... mais agir pour comprendre
          par vous même, c'est encore mieux ! Notre but est d'essayer de vous
          apporter un esprit critique face aux technologies propriétaires
          auxquelles nous sommes confrontés au quotidien.
        </p>

        <div className="max-w-250 text-center flex flex-col gap-4 items-center justify-center">
          <p>
            Votre mission, si vous l'acceptez, est de réussir les trois
            activités proposées ci-dessous. Chaque activité accomplie vous
            rapprochera un peu plus de la compréhension des enjeux du numérique
            libre et responsable.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div
            className={`py-2 px-4 w-fit rounded-full border hover:rotate-2 hover:scale-105 transition-transform duration-300 ${
              chatbotFlag
                ? "border-green-500 bg-green-100"
                : "border-slate-300 bg-slate-200"
            }`}
          >
            {chatbotFlag ? (
              <FaCheck className="inline text-green-500 mr-2" />
            ) : (
              <ImCross className="inline text-slate-500 mr-2 opacity-70" />
            )}
            🤖 Chatbot éducatif
          </div>

          <div
            className={`py-2 px-4 w-fit rounded-full border hover:rotate-2 hover:scale-105 transition-transform duration-300 ${
              snakeFlag
                ? "border-green-500 bg-green-100"
                : "border-slate-300 bg-slate-200"
            }`}
          >
            {snakeFlag ? (
              <FaCheck className="inline text-green-500 mr-2" />
            ) : (
              <ImCross className="inline text-slate-500 mr-2 opacity-70" />
            )}
            🐍 Snake face aux dilemmes
          </div>

          <div
            className={`py-2 px-4 w-fit rounded-full border hover:rotate-2 hover:scale-105 transition-transform duration-300 ${
              mineFlag
                ? "border-green-500 bg-green-100"
                : "border-slate-300 bg-slate-200"
            }`}
          >
            {mineFlag ? (
              <FaCheck className="inline text-green-500 mr-2" />
            ) : (
              <ImCross className="inline text-slate-500 mr-2 opacity-70" />
            )}
            💣 Démineur éthique
          </div>
        </div>
      </div>
    </div>
  );
}
