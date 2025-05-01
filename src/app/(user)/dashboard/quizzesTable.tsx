"use client";
import { quizzes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Quizz = InferSelectModel<typeof quizzes>;

type Props = {
  quizzes: Quizz[];
};

const ITEMS_PER_PAGE = 4;

const QuizzesTable = (props: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(props.quizzes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleQuizzes = props.quizzes.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-900/50 border-b border-zinc-800/50 sticky top-0 z-10">
            <tr>
              <th className="text-zinc-400 text-left py-4 px-6 font-medium hidden md:table-cell">
                #
              </th>
              <th className="text-zinc-400 text-left py-4 px-6 font-medium">
                Name
              </th>
              <th className="text-zinc-400 text-left py-4 px-6 font-medium hidden md:table-cell">
                Description
              </th>
              <th className="text-zinc-400 text-left py-4 px-6 font-medium hidden md:table-cell">
                Created
              </th>
              <th className="text-zinc-400 text-left py-4 px-6 font-medium hidden md:table-cell">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {visibleQuizzes.map((quizz: Quizz, index: number) => (
              <tr
                key={quizz.id}
                className="group hover:bg-orange-500/5 transition-colors duration-200"
              >
                <td className="py-4 px-6 hidden md:table-cell">
                  {startIndex + index + 1}
                </td>
                <td className="py-4 px-6">
                  <Link href={`/quizz/${quizz.id}`}>
                    <p className="text-orange-500 hover:text-orange-400 transition-colors font-medium">
                      {quizz.name}
                    </p>
                  </Link>
                  <div className="md:hidden mt-2 text-sm text-zinc-400">
                    <p className="line-clamp-2 mb-2 md:mb-0">
                      {quizz.description || "No description"}
                    </p>
                    <p>Created: Coming soon</p>
                    <p>Score: Not taken</p>
                  </div>
                </td>
                <td className="py-4 px-6 text-zinc-400 hidden md:table-cell">
                  <p className="line-clamp-2">
                    {quizz.description || "No description"}
                  </p>
                </td>
                <td className="py-4 px-6 text-zinc-400 hidden md:table-cell">
                  Coming soon
                </td>
                <td className="py-4 px-6 text-zinc-400 hidden md:table-cell">
                  Not taken
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-zinc-400">
            Showing {startIndex + 1}-
            {Math.min(startIndex + ITEMS_PER_PAGE, props.quizzes.length)} of{" "}
            {props.quizzes.length} quizzes
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="border-zinc-800 hover:bg-orange-500/10 hover:text-orange-500"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center px-2 text-sm text-zinc-400">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="border-zinc-800 hover:bg-orange-500/10 hover:text-orange-500"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizzesTable;
