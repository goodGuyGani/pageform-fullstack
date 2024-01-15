import React from "react";
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/dropdown-menu"
import { getCookie } from "@/actions/session";
import Logout from "@/components/Logout"

function getInitials(fullName: string): string {
  const names = fullName.split(" ");
  const firstNameInitial = names[0][0].toUpperCase();
  const lastNameInitial = names.length > 1 ? names[names.length - 1][0].toUpperCase() : "";
  return `${firstNameInitial}${lastNameInitial}`;
}

export default async function AvatarMenu() {
  const user = await getCookie();

  const name = user?.get('name')?.value;
  if (!name) {
    // Handle the case when user or user.get('name') is undefined
    console.error("User or user name is undefined");
  }

  return name && (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full w-10 h-10">{getInitials(name)}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Logout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}