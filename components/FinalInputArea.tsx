import { FC } from "react";
import TypeAnimation from "./TypeAnimation";
import Image from "next/image";

type TInputAreaProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
  setMessages: React.Dispatch<
    React.SetStateAction<{ role: string; content: string }[]>
  >;
  handleChat: (messages?: { role: string; content: string }[]) => void;
  messages: { role: string; content: string }[];
  handleInitialChat: () => void;
};

const FinalInputArea: FC<TInputAreaProps> = ({
  promptValue,
  setPromptValue,
  disabled,
  setMessages,
  handleChat,
  messages,
  handleInitialChat,
}) => {
  return (
    <form
      className="mx-auto flex w-full items-center justify-between"
      onSubmit={(e) => {
        e.preventDefault();
        if (messages.length > 0) {
          let latestMessages = [
            ...messages,
            { role: "user", content: promptValue },
          ];
          setMessages(latestMessages);
          handleChat(latestMessages);
        } else {
          handleInitialChat();
        }
      }}
    >
      <div className="flex w-full rounded-lg border">
        <input
          type="text"
          placeholder="Teach me about..."
          className="block w-full rounded-l-full border-r p-6 text-gray-900 placeholder:text-gray-400"
          disabled={disabled}
          value={promptValue}
          required
          onChange={(e) => setPromptValue(e.target.value)}
        />
        <div className="flex items-center justify-center">
          {/* TODO: Add this in state and pass to the prompt */}
          <select
            id="grade"
            name="grade"
            className="ring-none mr-4 h-full rounded-md rounded-r-full border-0 bg-transparent pl-2 font-medium text-black focus:ring-0 sm:text-sm"
          >
            <option>Elementary School</option>
            <option>Middle School</option>
            <option>High School</option>
            <option>College</option>
            <option>Undergrad</option>
            <option>Graduate</option>
          </select>
        </div>
      </div>
      <button
        disabled={disabled}
        type="submit"
        className="relative ml-3 flex size-[72px] shrink-0 items-center justify-center rounded-md bg-[linear-gradient(154deg,#2A8EF9_23.37%,#175CB6_91.91%)] disabled:pointer-events-none disabled:opacity-75"
      >
        {disabled && (
          <div className="absolute inset-0 flex items-center justify-center">
            <TypeAnimation />
          </div>
        )}

        <Image
          unoptimized
          src={"/up-arrow.svg"}
          alt="search"
          width={24}
          height={24}
          className={disabled ? "invisible" : ""}
        />
      </button>
    </form>
  );
};

export default FinalInputArea;