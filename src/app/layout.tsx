import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import LoginButton from "@/component/LoginButton";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import LogoutButton from "@/component/LogoutButton";

export const metadata: Metadata = {
  title: "SMP Stat",
  description: "SMP Stat website",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = await getUser();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between">
        <header className="fixed flex justify-center bg-gradient-to-r from-green-400 to-green-500 text-black w-full h-12">
          <div className="w-full max-w-6xl flex items-center justify-between">
            <div>
              <Link href="/" className="text-xl font-bold">
                smpstat.net
              </Link>
              <Link href={"/myServers"} className="text-xl font-bold">
                Servers
              </Link>
            </div>
          </div>
          {isUserAuthenticated ? (
            <>
              <span>User: {user.username}</span>
              <LogoutButton>
                <span>Logout</span>
              </LogoutButton>
            </>
          ) : (
            <div className="flex items-center">
              <LoginButton>
                <span>Login</span>
              </LoginButton>
            </div>
          )}
        </header>
        <main className="pt-12 flex-1">{children}</main>
        <footer className="flex w-full justify-center bg-slate-600 h-12 items-center">
          smpstat.net
        </footer>
      </body>
    </html>
  );
}
