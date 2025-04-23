import { CreditCard, Plus, User, BarChartBig, Share, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function NavMenu() {
  return (
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <Link
            href="/dashboard"
            className="flex flex-row items-center gap-2"
          >
            <BarChartBig />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href="/quizz/new"
            className="flex flex-row items-center gap-2"
          >
            <Plus />
            <span>New Quizz</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href="/billing"
            className="flex flex-row items-center gap-2"
          >
            <CreditCard />
            <span>Billing</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuItem>
        <Link
          href="/feedback"
          className="flex flex-row items-center gap-2"
        >
          <Star />
          <span>Give a feedback</span>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
