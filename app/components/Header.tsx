import Image from "next/image";
import Link from "next/link";

const header = () => {
  return (
    <div className="flex flex-row h-16 w-full justify-between py-3 mb-3 relative z-50">
      <div className="flex flex-row pt-1 scale-75 justify-center items-center">
        <Link
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors h-9 px-4 py-2 font-semibold text-sm mr-2 line-clamp-4 leading-[16px] text-[#1A1B1C] z-50"
          href="/"
        >
          SKINSTRIC
        </Link>
        <Image
          src="/images/leftBracket.png"
          alt="Left Bracket"
          width={4}
          height={17}
          style={{ width: 'auto' }}
        />
        <p className="text-[#1a1b1c83] text-opacity-70  font-semibold text-sm ml-1.5 mr-1.5">INTRO</p>
        <Image
          src="/images/rightBracket.png"
          alt="Right Bracket"
          width={4}
          height={17}
          style={{ width: 'auto' }}
        />
      </div>
      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold  transition-colors cursor-not-allowed text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 mx-4 scale-[0.8] text-[#FCFCFC] text-[10px] bg-[#1A1B1C] leading-[16px]">
        ENTER CODE
      </button>
    </div>
  );
};

export default header;
