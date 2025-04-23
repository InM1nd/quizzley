import UploadDoc from "../UploadDoc";
import { auth, signIn } from "@/auth";
import { getUserSubscription } from "@/app/actions/userSubscription";
import UpgradePlan from "../UpgradePlan";
import { FileText, Brain, Settings, Sparkles } from "lucide-react";

const Page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!session) {
    signIn();
    return;
  }

  const subscribed: boolean | null | undefined = await getUserSubscription({
    userId: userId!,
  });

  return (
    <div className="flex flex-col flex-1">
      <main className="py-11 flex flex-col items-center flex-1">
        <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="py-12 text-center text-3xl font-bold text-primary">
            Generate Your Quizz
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Настройки квиза */}
            <div className="relative group">
              <div className="relative bg-zinc-900/50 p-6 rounded-2xl ring-1 ring-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Settings className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-semibold text-white">
                      Quiz Settings
                    </h2>
                  </div>
                  <span className="text-sm font-medium text-primary">
                    Coming Soon
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600"
                        disabled
                      />
                      <span className="text-gray-400">Exam Preparation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600"
                        disabled
                      />
                      <span className="text-gray-400">Interview Practice</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600"
                        disabled
                      />
                      <span className="text-gray-400">General Knowledge</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Number of Questions</span>
                      <span>10</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      defaultValue="10"
                      className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Шаги */}
            <div className="bg-zinc-900/50 p-6 rounded-2xl backdrop-blur-sm ring-1 ring-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-white">
                  How It Works
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <p className="text-gray-400">
                    Upload your document (PDF, DOCX, or text)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <p className="text-gray-400">Our AI analyzes the content</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <p className="text-gray-400">Get your personalized quiz</p>
                </div>
              </div>
            </div>

            {/* Основная зона загрузки */}
            <div className="col-span-1 md:col-span-2 bg-zinc-900/50 p-6 rounded-2xl backdrop-blur-sm ring-1 ring-white/10">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-white">
                  Upload Your Document
                </h2>
              </div>
              {subscribed ? (
                <UploadDoc />
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-6">
                    Upgrade your plan to unlock advanced quiz features and
                    create personalized quizzes from your documents
                  </p>
                  <UpgradePlan />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;

