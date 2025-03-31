import { auth, signOut } from "@/auth";
import { Button } from "./button";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavMenu } from "@/components/NavMenu";
import { Wand } from "lucide-react";

function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button
        type="submit"
        variant="ghost"
        className="text-white hover:text-primary hover:bg-white/10"
      >
        Sign Out
      </Button>
    </form>
  );
}

const Header = async () => {
  const session = await auth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative py-4">
          <nav className="relative z-10 flex items-center justify-between rounded-2xl bg-zinc-900/50 p-4 backdrop-blur-sm ring-1 ring-white/10">
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <Wand className="text-primary w-8 h-8" />
              <h1 className="text-2xl font-bold text-white">Quizzley</h1>
            </Link>
            <div>
              {session?.user ? (
                <div className="flex items-center gap-4">
                  {session.user.name && session.user.image && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="hover:bg-white/10"
                        >
                          <Image
                            src={session.user.image}
                            alt={session.user.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <NavMenu />
                    </DropdownMenu>
                  )}
                  <SignOut />
                </div>
              ) : (
                <Link href="api/auth/signin">
                  <Button
                    variant="outline"
                    className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
