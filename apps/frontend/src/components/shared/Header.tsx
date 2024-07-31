import Image from "next/image";
import TopMenu from "@/components/shared/TopMenu";

export interface HeaderProps {
  title: string
  description: string
}

const Header = (props: HeaderProps) => {
  return (
    <div className="py-10 relative h-[180px]">
      <Image
        src='/banners/principal.webp'
        fill
        alt="Barbearia"
        className="object cover"
      />
      <div className="flex flex-col items-center absolute top-0 left-0 w-full h-full bg-black/80 md:bg-transparent md:bg-gradient-to-r from-black/30 via-black/90 to-black/30">
        <TopMenu />
        <div className="container flex-1 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-black text-white/70">
            {props.title}
          </h1>
          <p className="text-xs font-light text-white/60">
            {props.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Header
