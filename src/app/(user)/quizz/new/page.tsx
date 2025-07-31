import { auth, signIn } from "@/auth";
import { checkPremiumStatus } from "@/lib/premium-manager";
import QuizzGeneratorClient from "./QuizzGeneratorClient";

const Page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!session) {
    signIn();
    return;
  }

  const premiumStatus = await checkPremiumStatus(userId!);

  return <QuizzGeneratorClient isSubscribed={premiumStatus.isPremium} />;
};

export default Page;
