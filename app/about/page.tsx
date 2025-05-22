import PageTitle from "@/components/ui/PageTitle";
import Image from "next/image";
import profile from "./profile.json" assert { type: "json" };
import palette from "./palette";
import MailIcon from "@/assets/mail.svg";
import GithubIcon from "@/assets/github.svg";
import Link from "next/link";

export function generateMetadata() {
  return {
    title: `YH_Blog :: About Me`,
    description: `YH_Blog :: About Me`,
    openGraph: {
      type: "article",
      title: `YH_Blog :: About Me`,
      description: `YH_Blog :: About Me`,
      url: `${process.env.HOST}/about`,
    },
  };
}

export default async function About() {
  const myProfile = profile;
  const keys = Object.keys(myProfile) as (keyof typeof myProfile)[];

  return (
    <main className="flex flex-col">
      <PageTitle title={"about"} />
      <section className="flex justify-end items-center my-1">
        <Link
          className="w-[5%] h-[5%] mr-[1%] tablet:w-[4%] tablet:h-[4%] laptop:w-[2.5%] laptop:h-[2.5%] min-w-5 min-h-5"
          href="https://github.com/yeonhwan"
        >
          <GithubIcon />
        </Link>
        <Link
          className="w-[5%] h-[5%] mr-[1%] tablet:w-[4%] tablet:h-[4%] laptop:w-[2.5%] laptop:h-[2.5%] min-w-5 min-h-5"
          href="mailto:yeonhwandev@gmail.com"
        >
          <MailIcon />
        </Link>
      </section>
      <section className="flex bg-text-white dark:bg-dark-green w-full rounded-sm flex-col px-4">
        <div data-name="status_bar" className="flex justify-between gap-2 w-fit my-4">
          <i className="rounded-full w-2 h-2 bg-red-500"></i>
          <i className="rounded-full w-2 h-2 bg-yellow-500"></i>
          <i className="rounded-full w-2 h-2 bg-green-500"></i>
        </div>
        <div className="w-fit font-mono text-mb-sub laptop:text-dt-base flex justify-between items-center gap-2 my-4">
          <p className="text-neon-blue-100 dark:text-neon-green-200 font-bold">yeonhwan@mac</p>
          <p className="text-neon-blue-100 dark:text-neon-green-200 font-bold">$</p>
          <p>whoami</p>
        </div>
        <Image
          priority
          data-name="ascii_image"
          className="my-8 w-3/4 mx-auto block dark:hidden laptop:max-w-[40%]"
          src="/ascii_blue.webp"
          alt="my_proifle"
          width={2071}
          height={1089}
        />
        <Image
          priority
          data-name="ascii_image"
          className="my-8 w-3/4 mx-auto hidden dark:block laptop:max-w-[40%]"
          src="/ascii_green.webp"
          alt="my_proifle"
          width={2071}
          height={1089}
        />
        <ul data-name="content" className="w-fit font-mono flex flex-col gap-2 my-4">
          <li className="w-fit text-neon-blue-100 dark:text-neon-green-200 text-sm laptop:text-base font-semibold border-b border-sub-gray border-dashed pb-1">
            yeonhwan@korea
          </li>
          {keys.map((key) => (
            <li key={key} className="flex text-xs laptop:text-base">
              <p className="text-neon-blue-100 dark:text-neon-green-300 font-semibold">{`${key}: `}</p>
              <p className="ml-1">{myProfile[key]}</p>
            </li>
          ))}
        </ul>
        <div data-name="color-box" className="flex flex-col items-end w-fit mb-10">
          <div className="flex">
            {palette.slice(0, 8).map((color) => {
              return (
                <div
                  key={color}
                  style={{ backgroundColor: color }}
                  className="h-4 w-4 laptop:w-6 laptop:h-6"
                ></div>
              );
            })}
          </div>

          <div className="flex">
            {palette.slice(9).map((color) => {
              return (
                <div
                  key={color}
                  style={{ backgroundColor: color }}
                  className="h-4 w-4 laptop:w-6 laptop:h-6"
                ></div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
