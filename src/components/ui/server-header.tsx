import { getUserSession } from "@/lib/user-session";
import ClientHeader from "./header";

export default async function ServerHeader() {
  const session = await getUserSession();
  return <ClientHeader session={session} />;
}
