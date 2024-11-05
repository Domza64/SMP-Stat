import Link from "next/link";

export default async function Soon() {
  return (
    <section className="flex text-center flex-col max-w-7xl mx-auto justify-center items-center h-96">
      <h1 className="text-7xl font-semibold text-green-400 mb-6">
        Coming Soon!
      </h1>
      <span className="text-gray-300">
        Release date currently unspecified but <br /> anticipated in the near
        future.
      </span>
      <Link
        className="text-green-400 font-semibold mt-6 hover:text-green-300 underline"
        href="/"
      >
        Home
      </Link>
    </section>
  );
}
