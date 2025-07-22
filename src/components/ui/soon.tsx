import { FC } from "react";

interface SoonProps {
  message?: string;
  description?: string;
}

const Soon: FC<SoonProps> = ({
  message = "Soon here will be a new section!",
  description = "We are actively working on this functionality. Follow updates 🚀",
}) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-lg px-8 py-10 flex flex-col items-center max-w-md w-full border border-orange-100 dark:border-zinc-800">
      <div className="mb-4 flex items-center justify-center">
        <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-orange-600 to-red-400 h-16 w-16 shadow-lg">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              d="M12 8v4l2.5 2.5M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <h2 className="text-2xl font-bold text-orange-600 mb-2 text-center">
        {message}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-center">
        {description}
      </p>
    </div>
  </div>
);

export default Soon;
