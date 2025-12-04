import React from "react";
import { quickTopics } from "./utils";

type Props = {
  disabled: boolean;
  onClickTopic: (prompt: string) => void;
  isDumbMode: boolean;
};

export default function QuickTopics({ disabled, onClickTopic, isDumbMode }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {quickTopics.map((topic) => (
        <button
          key={topic.label}
          type="button"
          disabled={disabled}
          onClick={() => onClickTopic(topic.prompt)}
          className={`text-xs md:text-sm px-3 py-1 rounded-full border transition disabled:opacity-60 disabled:cursor-not-allowed ${
            isDumbMode
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
