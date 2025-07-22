"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Trash2,
} from "lucide-react";
import { UserQuizzes } from "@/app/actions/getUserQuizzes";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { toast } from "sonner";
import { sortQuizzes } from "@/lib/sort-quizzes";

type Props = {
  quizzes: UserQuizzes[];
};

type SortField = "name" | "createdAt" | "score" | "questionCount";
type SortOrder = "asc" | "desc";

const ITEMS_PER_PAGE = 5;

function truncateWords(text: string, maxWords: number): string {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + " ...";
}

function parseDate(dateStr: string | number | Date | null | undefined): number {
  if (!dateStr || dateStr === "Not taken") return 0;

  if (typeof dateStr === "string") {
    // Если формат "дд.мм.гггг"
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split(".");
      return new Date(+year, +month - 1, +day).getTime();
    }
    // Если ISO-строка
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) return parsed;
  }

  // Если это Date или число
  const dateObj = new Date(dateStr as any);
  if (!isNaN(dateObj.getTime())) return dateObj.getTime();

  return 0;
}

const QuizzesTable = (props: Props) => {
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [localQuizzes, setLocalQuizzes] = useState(props.quizzes);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);

  const sortedQuizzes = useMemo(() => {
    return [...localQuizzes].sort((a, b) =>
      sortQuizzes(a, b, sortField, sortOrder)
    );
  }, [localQuizzes, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: SortField) => {
    const isActive = sortField === field;
    const iconProps = isActive
      ? "inline h-4 w-4 ml-1 text-orange-500"
      : "inline h-4 w-4 ml-1 text-zinc-500 opacity-50";
    if (isActive) {
      return sortOrder === "asc" ? (
        <ChevronUp className={iconProps} />
      ) : (
        <ChevronDown className={iconProps} />
      );
    }
    // Для неактивных всегда показываем down (или up — на твой вкус)
    return <ChevronDown className={iconProps} />;
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/quizz/${id}/delete`, { method: "DELETE" });
    if (res.ok) {
      setLocalQuizzes((prev) => prev.filter((q) => q.id.toString() !== id));
      toast.success("Quiz deleted successfully");
    } else {
      toast.error("Error deleting quiz");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sortedQuizzes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleQuizzes = sortedQuizzes.slice(
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

  console.log("props.quizzes", props.quizzes.length);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-zinc-900/50 border-b border-zinc-800/50 sticky top-0 z-10">
            <TableRow>
              <TableHead className="text-zinc-400 text-center py-4 px-6 font-medium hidden md:table-cell">
                №
              </TableHead>
              <TableHead
                className="text-zinc-400 text-left py-4 md:px-6 font-medium cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <span className="inline-flex items-center gap-1">
                  Name {getSortIcon("name")}
                </span>
              </TableHead>
              <TableHead className="text-zinc-400 text-left py-4 px-6 font-medium hidden md:table-cell">
                Description
              </TableHead>
              <TableHead className="text-zinc-400 text-center py-4 px-6 font-medium hidden md:table-cell">
                Questions
              </TableHead>
              <TableHead
                className="text-zinc-400 items-center justify-center text-center py-4 px-6 font-medium hidden md:table-cell cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <span className="inline-flex items-center gap-1">
                  Created {getSortIcon("createdAt")}
                </span>
              </TableHead>
              <TableHead
                className="text-zinc-400 text-center py-4 px-6 font-medium hidden md:table-cell cursor-pointer"
                onClick={() => handleSort("score")}
              >
                <span className="inline-flex items-center gap-1">
                  Score {getSortIcon("score")}
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-zinc-800/50">
            {visibleQuizzes.map((quizz: UserQuizzes, index: number) => (
              <TableRow
                key={quizz.id}
                className="group hover:bg-orange-500/5 transition-colors duration-200"
              >
                <TableCell className="py-4 px-6 text-center hidden md:table-cell">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell className="py-4 md:px-6 ">
                  <Link href={`/quizz/${quizz.id}`}>
                    <p className="text-orange-500 hover:text-orange-400 transition-colors font-medium">
                      {quizz.name}
                    </p>
                  </Link>
                  <div className="md:hidden mt-2 text-sm text-zinc-400 gap-2">
                    <p className="line-clamp-2 mb-2 md:mb-0">
                      {truncateWords(quizz.description || "No description", 10)}
                    </p>
                    <p className="text-sm text-zinc-400">
                      Questions: {quizz.questionCount}
                    </p>
                    <p>
                      Created:{" "}
                      {quizz.createdAt
                        ? new Date(quizz.createdAt).toLocaleDateString()
                        : "Not taken"}
                    </p>
                    <p className="text-sm text-zinc-400">
                      Score:{" "}
                      {quizz.score !== null ? (
                        <span
                          className={`font-medium ${
                            quizz.score >= 80
                              ? "text-green-500"
                              : quizz.score >= 60
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {quizz.score}%
                        </span>
                      ) : (
                        "Not taken"
                      )}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6 text-zinc-400 hidden md:table-cell">
                  <p className="line-clamp-2">
                    {truncateWords(quizz.description || "No description", 10)}
                  </p>
                </TableCell>
                <TableCell className="py-4 px-6 text-zinc-400 hidden md:table-cell text-center">
                  {quizz.questionCount}
                </TableCell>
                <TableCell className="py-4 px-6 text-zinc-400 hidden md:table-cell text-center">
                  {quizz.createdAt
                    ? new Date(quizz.createdAt).toLocaleDateString()
                    : "Not taken"}
                </TableCell>
                <TableCell className="py-4 px-6 text-zinc-400 hidden md:table-cell text-center">
                  {quizz.score !== null ? (
                    <span
                      className={`font-medium ${
                        quizz.score >= 80
                          ? "text-green-500"
                          : quizz.score >= 60
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {quizz.score}%
                    </span>
                  ) : (
                    "Not taken"
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:underline"
                    onClick={() => setQuizToDelete(quizz.id.toString())}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
              variant="secondary"
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
              variant="secondary"
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

      <ConfirmDeleteDialog
        open={quizToDelete !== null}
        onCancel={() => setQuizToDelete(null)}
        onConfirm={async () => {
          if (!quizToDelete) return;
          await handleDelete(quizToDelete);
          setQuizToDelete(null);
        }}
      />
    </div>
  );
};

export default QuizzesTable;
