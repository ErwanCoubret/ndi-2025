import { quickTopics } from "./utils";

type Props = {
  disabled: boolean;
  onClickTopic: (label: string, prompt: string) => void;
  isDumbMode: boolean;
  labelsSelectedTopics: string[];
};

export default function QuickTopics({
  disabled,
  onClickTopic,
  isDumbMode,
  labelsSelectedTopics,
}: Props) {
  const isSelectedTopic = (label: string, selectedLabels: string[]) => {
    return selectedLabels.includes(label);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {quickTopics.map((topic) => (
        <button
          key={topic.label}
          type="button"
          disabled={disabled}
          onClick={() => onClickTopic(topic.label, topic.prompt)}
          className={`text-xs md:text-sm px-3 py-1 rounded-full border transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
            isSelectedTopic(topic.label, labelsSelectedTopics)
              ? "border-green-400 bg-green-100 text-green-800 cursor-default"
              : isDumbMode
              ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
              : "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
          }`}
        >
          {topic.label}
        </button>
      ))}
    </div>
  );
}
