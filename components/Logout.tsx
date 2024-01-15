"use client";
import React from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { deleteCookie } from "@/actions/session";
import { useRouter } from "next/navigation"

function Logout() {
	const router = useRouter();
	const onLogout = async () => {
  	await deleteCookie();
  	router.push("/login-register");
  	router.refresh();
  }
	return (
		<DropdownMenuItem onClick={onLogout}>
          Log out
        </DropdownMenuItem>
	)
}

export default Logout;