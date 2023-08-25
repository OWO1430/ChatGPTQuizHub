"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";

function Navbar() {
  const router = useRouter();
  function handleLogout() {
    destroyCookie(null, "access_token");
    destroyCookie(null, "user_id");
    router.push("/login");
  }
  return (
    <div className="bg-white w-full h-auto p-2.5 border-b-2 flex items-center">
      <Link href="/" passHref className="pl-4 text-3xl text-primary">
        GPTQuizHub
      </Link>
      <div className="flex h-6 ml-8 text-base font-bold">
        <Link href="/articles" passHref>
          <p className="ml-2 mr-2 hover:text-slate-400">文章</p>
        </Link>
        <Link href="/questionbanks" passHref>
          <p className="ml-2 mr-2 hover:text-slate-400">題庫</p>
        </Link>
        <Link href="/test-histories" passHref>
          <p className="ml-2 mr-2 hover:text-slate-400">測驗紀錄</p>
        </Link>
        <Link href="/twoplayer" passHref>
          <p className="ml-2 mr-2 hover:text-slate-400">雙人對戰</p>
        </Link>
      </div>
      <div className="flex mx-6 ml-auto">
        <button type="button" className="mx-4 hover:-translate-y-2" onClick={handleLogout}>
          <Image src="/logout2.png" alt="logoutbtn" width={40} height={40} />
        </button>
        <Image src="/user.png" alt="User" width={40} height={40} className="" />
      </div>
    </div>
  );
}

export default Navbar;
