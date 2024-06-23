"use client";

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import LogoutButton from "./logout-button";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="w-full bg-slate-300 px-6 md:px-10 lg:px-20 py-2 ">
      <div className="flex justify-between">
        <div>
          <h1 className="text-4xl font-semibold">
            <Link href={"/"}>LOGO</Link>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          {session ? (
            <>
              <span className="font-semibold">
                Welcome {user.username || user.email}
              </span>
              <LogoutButton />
              <Link href={"/dashboard"}>
              <Button variant={"secondary"}>Dashboard</Button>
              </Link>
            </>
          ) : (
            <Link href={"/sign-in"}>
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
