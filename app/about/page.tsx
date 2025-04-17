import PageTitle from "@/components/ui/PageTitle";
import Image from "next/image";
import profile from "./profile.json" assert { type: "json" };
import palette from "./palette";
import MailIcon from "@/assets/mail.svg";
import DocumentIcon from "@/assets/document.svg";
import GithubIcon from "@/assets/github.svg";
import Link from "next/link";

export default function About() {
  const myProfile = profile;
  const keys = Object.keys(myProfile) as (keyof typeof myProfile)[];

  return (
    <div className="flex flex-col">
      <div className="flex">
        <PageTitle title={"about"} />
      </div>
      <div className="flex gap-2 mx-auto items-center my-4">
        <Link href="https://github.com/yeonhwan">
          <GithubIcon className="w-6 h-6" />
        </Link>

        <Link href="mailto:yeonhwan619@gmail.com">
          <MailIcon className="w-6 h-6" />
        </Link>
        <Link href="/yeonhwan_resume.pdf" download>
          <DocumentIcon className="w-6 h-6" />
        </Link>
      </div>
      <div className="flex bg-dark-green w-full rounded-sm flex-col px-4">
        <div data-name="status_bar" className="flex justify-between gap-2 w-fit my-4">
          <i className="rounded-full w-2 h-2 bg-red-500"></i>
          <i className="rounded-full w-2 h-2 bg-yellow-500"></i>
          <i className="rounded-full w-2 h-2 bg-green-500"></i>
        </div>
        <div className="w-fit font-fira text-mb-sub flex justify-between items-center gap-2 my-4">
          <p className="text-neon-green-200 font-bold">yeonhwan@mac</p>
          <p className="text-neon-green-200 font-bold">$</p>
          <p>whoami</p>
        </div>
        <Image
          data-name="ascii_image"
          className="my-8 w-3/4 mx-auto"
          src="/ascii_green.png"
          alt="my_proifle"
          width={2071}
          height={1089}
        />
        <div data-name="content" className="w-fit font-fira flex flex-col gap-2 my-4">
          <p className="w-fit text-neon-green-200 text-sm font-semibold border-b border-sub-gray border-dashed pb-1">
            yeonhwan-park@seoul
          </p>
          {keys.map((key) => (
            <div key={key} className="flex text-xs">
              <p className="text-neon-green-300 font-semibold">{`${key}: `}</p>
              <p className="ml-1">{myProfile[key]}</p>
            </div>
          ))}
        </div>
        <div data-name="color-box" className="flex flex-col items-end w-fit mb-10">
          <div className="flex">
            {palette.slice(0, 8).map((color, idx) => {
              return <div key={color} style={{ backgroundColor: color }} className="h-4 w-4"></div>;
            })}
          </div>

          <div className="flex">
            {palette.slice(9).map((color, idx) => {
              return <div key={color} style={{ backgroundColor: color }} className="h-4 w-4"></div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
