import type { Metadata } from "next";
import Link from "next/link";
import { Poppins } from "next/font/google";
import "./globals.css";
import LoginButton from "@/component/LoginButton";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import LogoutButton from "@/component/LogoutButton";
import Image from "next/image";

export const metadata: Metadata = {
  title: "SMP Stat",
  description: "SMP Stat website",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
      <body
        className={`min-h-screen flex flex-col justify-between ${poppins.className} antialiased`}
      >
        <header className="fixed top-0 w-full bg-gradient-to-r from-green-400 to-green-500 text-black z-20 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
            {/* Logo and Home Link */}
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold"
            >
              <Image
                src="/images/smp_stat_green_logo.svg"
                alt="SMP Stat Logo"
                width={40}
                height={40}
              />
              <span className="text-black hidden lg:block">SMP Stat</span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex gap-6 text-lg font-semibold">
              <Link href="/myServers" className="hover:text-gray-700">
                My Servers
              </Link>
              <Link href="/tutorial" className="hover:text-gray-700">
                Tutorial
              </Link>
              <Link href="/install" className="hover:text-gray-700">
                Install
              </Link>
            </nav>

            {/* User Auth Actions */}
            <div className="flex items-center gap-4">
              {isUserAuthenticated ? (
                <>
                  <span className="text-md text-black">
                    Hello, {user.username}!
                  </span>
                  <LogoutButton className="bg-black hover:bg-gray-800 text-white font-bold py-1 px-3 rounded">
                    Logout
                  </LogoutButton>
                </>
              ) : (
                <LoginButton className="bg-black hover:bg-gray-800 text-white font-bold py-1 px-3 rounded">
                  Login
                </LoginButton>
              )}
            </div>
          </div>
        </header>
        <main className="pt-20 flex-1">{children}</main>
        <footer className="bg-gray-900 text-white py-12 mt-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 text-center lg:text-left">
            {/* About Section */}
            <div>
              <h3 className="text-xl font-bold text-green-400">
                About SMP Stat
              </h3>
              <p className="mt-2 text-gray-400">
                SMP Stat lets all server players track server events and player
                stats, providing a real-time overview of gameplay even when
                you’re offline. With features like leaderboards and much more on
                the way, SMP Stat is your go-to tool for staying connected with
                your Minecraft community.
              </p>
            </div>

            {/* Useful Links Section */}
            <div>
              <div className="flex justify-center">
                <div>
                  <h3 className="text-xl font-bold text-green-400">
                    Useful Links
                  </h3>
                  <ul className="mt-2 space-y-2 text-gray-400">
                    <li>
                      <Link href="/myServers" className="hover:text-green-300">
                        My Servers
                      </Link>
                    </li>
                    <li>
                      <Link href="/tutorial" className="hover:text-green-300">
                        Tutorial
                      </Link>
                    </li>
                    <li>
                      <Link href="/install" className="hover:text-green-300">
                        Installation Guide
                      </Link>
                    </li>
                    <li>
                      <Link href="/faq" className="hover:text-green-300">
                        FAQ
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div>
              <h3 className="text-xl font-bold text-green-400">Get in Touch</h3>
              <p className="mt-2 text-gray-400">
                Have questions or need support? Feel free to contact me about
                anything related to this project!
              </p>
              <p className="text-gray-400">
                Email:{" "}
                <a
                  href="mailto:juricicdominik@protonmail.com"
                  className="hover:text-green-300"
                >
                  juricicdominik@protonmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Project Links */}
          <div className="max-w-6xl mx-auto mt-8 text-center text-gray-400">
            <h3 className="text-lg font-semibold text-green-400 mb-4">
              Project Links
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/your-username/smp-stat-website"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-300 underline"
              >
                GitHub - Website
              </a>
              <a
                href="https://github.com/your-username/smp-stat-plugin"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-300 underline"
              >
                GitHub - Plugin
              </a>
              <a
                href="https://curseforge.com/minecraft/bukkit-plugins/smp-stat"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-300 underline"
              >
                CurseForge
              </a>
              <a
                href="https://modrinth.com/plugin/smp-stat"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-300 underline"
              >
                Modrinth
              </a>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} SMP Stat. Made with
              <Image
                src={"/images/heart.png"}
                alt={"Heart icon"}
                width={16}
                height={16}
                className="inline mx-1 pixel-art"
              />
              by Domza64.
            </p>
            <p className="mt-1 flex gap-1 justify-center">
              <Link
                href="https://domza.xyz"
                className="hover:text-green-300 underline"
              >
                domza.xyz
              </Link>
              |
              <Link href="/privacy" className="hover:text-green-300 underline">
                Privacy Policy
              </Link>
              |
              <Link href="/terms" className="hover:text-green-300 underline">
                Terms of Service
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
