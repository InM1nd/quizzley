import { auth, signIn } from "@/auth";
import { checkPremiumStatus } from "@/lib/premium-manager";
import { canAccessQuizSettings } from "@/lib/usage-limits";
import QuizzGeneratorClient from "./QuizzGeneratorClient";

const Page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!session) {
    signIn();
    return;
  }

  const premiumStatus = await checkPremiumStatus(userId!);
  const canAccessSettings = await canAccessQuizSettings(userId!);

  return (
    <QuizzGeneratorClient
      isSubscribed={premiumStatus.isPremium}
      userId={userId!}
      canAccessSettings={canAccessSettings}
    />
  );
};

export default Page;
