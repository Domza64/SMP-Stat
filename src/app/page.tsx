import Link from "next/link";
import Image from "next/image";
import "./wave.css";
import localFont from "next/font/local";

const Minecrafter = localFont({
  src: "./fonts/Minecrafter.ttf",
  weight: "100 900",
});

export default async function Home() {
  return (
    <>
      <section className="mt-16 md:mt-48 p-4 pb-0">
        <div className="w-full flex justify-between max-w-7xl mx-auto">
          <div className="text-center flex flex-col justify-center items-start w-full lg:w-2/3">
            <div className="w-fullflex flex-col items-start">
              <h1
                className={`text-8xl title text-left text-green-400 ${Minecrafter.className}`}
              >
                Pixel <span>Feed</span>
              </h1>
              <p className="text-white max-w-lg font-semibold text-left text-xl">
                Stay connected to your Minecraft server anytime, anywhere—even
                when you&apos;re offline!
              </p>
              <div className="flex justify-between items-center mt-12">
                <Link
                  href={"/servers"}
                  className="bg-green-400 border-black text-lg border-4 border-dashed hover:bg-green-300 text-black font-bold py-2 px-4 rounded"
                >
                  Track your server!
                </Link>
              </div>
              <div className="mt-4 flex">
                <Link
                  className="text-green-400 hover:text-green-300 underline"
                  href={
                    "https://www.pixelfeed.net/server/672ff07c8d72836b7417c924"
                  }
                >
                  Temp preview
                </Link>
              </div>
            </div>
          </div>
          <div className="w-auto hidden lg:flex flex-col items-end">
            <Image
              src={"/images/dashboard.png"}
              alt={"Dashboard image"}
              height={700}
              width={700}
            />
            <span className="text-gray-300 text-sm mr-10">
              *Dashboard preview
            </span>
          </div>
        </div>
        <div className="text-center mt-16">
          <div className="text-xl flex flex-col items-center">
            <div className="bg-yellow-400 text-black font-bold px-2 mb-4 flex flex-col items-center py-0.5 rounded">
              <strong>Very Early ALPHA!</strong>
              <span className="text-sm font-normal">
                Expect imperfections, unfinished stuff.
              </span>
            </div>
            <span className="text-green-400 text-2xl">ALREADY TRACKING</span>
            <div className="flex items-center gap-4">
              <div>
                <span className="font-bold text-2xl">2</span> public servers
              </div>
              |
              <div>
                <span className="font-bold text-2xl">7</span> private servers
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="clip-wave bg-gray-900 h-32"></div>
        <div className="p-4 bg-gray-900 py-10">
          <div className="p-6 bg-gray-900 py-12 text-white">
            <div className="max-w-7xl mx-auto">
              {/* Section Title */}
              <h2 className="text-4xl font-bold text-center text-white mb-6">
                What is <span className="text-green-400">PixelFeed</span>?
              </h2>

              {/* Intro Text */}
              <p className="max-w-4xl mx-auto text-lg font-medium text-center mb-10">
                PixelFeed is your comprehensive tool for tracking Minecraft
                server activity. Once installed on your server, PixelFeed
                continuously monitors player stats, achievements, and events,
                sending data to this website where it&apos;s displayed in an
                easy-to-use, real-time dashboard. Stay informed, engage your
                community, and enhance gameplay—even when you&apos;re offline!
              </p>

              <div className="flex flex-col items-center">
                {/* Features Section */}
                <h3 className="text-3xl font-semibold mb-2">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Server Stats */}
                  <div>
                    <h4 className="text-xl text-green-300 font-medium mb-1">
                      Server Stats
                    </h4>
                    <ul className="list-disc list-inside ml-6 text-gray-300">
                      <li>Complete player list</li>
                      <li>Server-wide activity summary</li>
                    </ul>
                  </div>

                  {/* Player Stats */}
                  <div>
                    <h4 className="text-xl text-green-300 font-medium mb-1">
                      Player Stats
                    </h4>
                    <ul className="list-disc list-inside ml-6 text-gray-300">
                      <li>Total number of deaths</li>
                      <li>Total playtime in hours</li>
                      <li>Last online time for each player</li>
                    </ul>
                  </div>

                  {/* Server Events */}
                  <div>
                    <h4 className="text-xl text-green-300 font-medium mb-1">
                      Server Events
                    </h4>
                    <ul className="list-disc list-inside ml-6 text-gray-300">
                      <li>Achievements unlocked</li>
                      <li>Deaths and other significant events</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="clip-wave-upside bg-gray-900 h-32"></div>
      </section>
      <section className="text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-left text-green-400 mb-12">
            Dashboard Previews
          </h2>

          {/* Individual Dashboard Components */}
          <div className="lg:col-span-1">
            <Image
              src="/images/players.png"
              alt="Players Component Preview"
              width={400}
              height={400}
              className="w-full h-auto rounded shadow-lg object-cover border-green-400 border-2 my-2"
            />
          </div>
          <div className="lg:col-span-1">
            <Image
              src="/images/events.png"
              alt="Events Component Preview"
              width={400}
              height={400}
              className="w-full h-auto rounded shadow-lg object-cover border-green-400 border-2 my-2"
            />
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 my-16 space-y-4">
        <h2 className="text-3xl font-bold text-green-400 text-left mb-4 mt-12">
          How to use PixelFeed?
        </h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo eligendi
          laboriosam, maiores optio tempora doloribus et, dolores saepe
          accusamus sint voluptatum fugiat assumenda rem cum quidem perferendis
          iure a distinctio.
        </p>
        <h3 className="text-2xl font-bold text-green-400 text-left mb-4">
          Instalation:
        </h3>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. In itaque,
          dolorum esse dolorem minus vel commodi iure, delectus non a eligendi
          reprehenderit rerum nostrum, cumque labore culpa iusto vero deleniti!
        </p>
        <h2 className="text-3xl font-bold text-green-400 text-left">FAQs</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint iste
          voluptas, tempora quo delectus accusantium odio ad. Dignissimos, quod
          harum ea officia commodi, nisi, suscipit impedit est natus quidem
          quaerat!
        </p>
      </section>
    </>
  );
}
