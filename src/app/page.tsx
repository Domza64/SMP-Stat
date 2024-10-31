import Link from "next/link";

export default async function Home() {
  return (
    <>
      <section className="w-full flex justify-center items-center h-screen flex-col">
        <h1 className="text-2xl font-bold">SMP Stat</h1>
        <span>
          Keep in touch with your MC server even when youre not playing
        </span>
        <Link
          href={"/myServers"}
          className="bg-green-400 border-black border-4 border-dotted hover:bg-green-300 transition-all duration-200 shadow-lg shadow-green-500 text-black font-bold p-4 mt-4 rounded"
        >
          Track your server
        </Link>
      </section>
      <section className="w-full flex justify-center h-96">
        Currently tracking 3 public and 23 private servers
      </section>
      <section className="w-full flex justify-center h-96">
        Collect stats like player deaths and achievements, playtime, server
        updime, get notified when your server crashes or goes ofline and much
        more...
      </section>
    </>
  );
}
