import { quizzes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";

export type Quizz = InferSelectModel<typeof quizzes>;

type Props = {
  quizzes: Quizz[];
};

const QuizzesTable = (props: Props) => {
  return (
    <div className="rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-zinc-900/50 border-b border-zinc-800/50">
          <tr>
            <th className="text-zinc-400 text-left py-4 px-6 font-medium">
              Name
            </th>
            <th className="text-zinc-400 text-left py-4 px-6 font-medium">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {props.quizzes.map((quizz: Quizz) => (
            <tr
              key={quizz.id}
              className="group hover:bg-orange-500/5 transition-colors duration-200"
            >
              <td className="py-4 px-6">
                <Link href={`/quizz/${quizz.id}`}>
                  <p className="text-orange-500 hover:text-orange-400 transition-colors font-medium">
                    {quizz.name}
                  </p>
                </Link>
              </td>
              <td className="py-4 px-6 text-zinc-400">{quizz.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizzesTable;
