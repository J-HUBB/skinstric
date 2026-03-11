"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Header from "./components/Header";
import Link from "next/link";

export default function Home() {
  const container = useRef<HTMLDivElement>(null);

  const leftHoverTL = useRef<gsap.core.Timeline | null>(null);
  const rightHoverTL = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      gsap.from(".hero-headline", {
        opacity: 0,
        duration: 1,
        ease: "power3.in",
        delay: 0.3,
      });

      leftHoverTL.current = gsap.timeline({ paused: true })
      .to(".hero-headline", { x: 330, duration: 0.4, ease: "power1.inOut"})
      .to("#take-test-button", { opacity: 0, scale: 0.9, duration: 0.3 }, "<")
      .to(".dotted-boxRight", { opacity: 0, duration: 0.3 }, "<");

      rightHoverTL.current = gsap.timeline({ paused: true })
      .to(".hero-headline", { x: -330, duration: 0.4, ease: "power1.inOut"})
      .to("#discover-button", { opacity: 0, scale: 0.9, duration: 0.3 }, "<")
      .to(".dotted-boxLeft", { opacity: 0, duration: 0.3 }, "<");
    },

    { scope: container }
  );

  const handleHover = (side: string, entering: boolean) => {
    if (side === 'left') {
      entering ? leftHoverTL.current?.play() : leftHoverTL.current?.reverse();
    } else {
      entering ? rightHoverTL.current?.play() : rightHoverTL.current?.reverse();
    }
  };

  return (
    <main
      ref={container}
      className="max-sm:scale-[0.75] max-sm:origin-center max-sm:p-6"
    >
      <Header />
      <div className="flex flex-col items-center justify-center h-[71dvh] md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
        <div className="absolute inset-0 flex items-center justify-center lg:hidden">
          <div className="w-[350px] h-[350px] border border-dotted border-[#A0A4AB] rotate-45 absolute top-1/2 left-1/2 -translate-x-[52%] -translate-y-1/2"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center lg:hidden">
          <div className="w-[420px] h-[420px] border border-dotted border-[#A0A4AB] rotate-45 absolute top-1/2 left-1/2 -translate-x-[52%] -translate-y-1/2"></div>
        </div>

        <div className="relative z-10 text-center">
          <h1
            className="hero-headline"
            style={{
              opacity: "1",
              translate: "none",
              rotate: "none",
              scale: "none",
              transform: "translate(0px, 0px)",
            }}
          >
            Sophisticated <br />{" "}
            <span
              className="block text-[#1A1B1C]"
              style={{
                translate: "none",
                rotate: "none",
                scale: "none",
                transform: "translate(0px, 0px)",
              }}
            >
              skincare
            </span>
          </h1>
        </div>

        <p className="z-10 block lg:hidden w-[30ch] mt-4 text-[16px] font-semibold text-center text-muted-foreground text-[#1a1b1c83]">
          Skinstric developed an A.I. that creates a highly-personalised routine
          tailored to what your skin needs.
        </p>

        <div className="z-10 mt-4 lg:hidden">
          <Link href="/testing">
            <button className="relative flex items-center gap-4 hover:scale-105 duration-300">
              <span className="text-[12px] font-bold cursor-pointer">
                ENTER EXPERIENCE
              </span>
              <div className="w-[24px] h-[24px] border border-solid border-black rotate-45 cursor-pointer"></div>
              <span className="absolute left-[126px] scale-[0.5] hover:scale-60 duration-300">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-current text-black"
                >
                  <path d="M8 5v14l11-7z"></path>
                </svg>
              </span>
            </button>
          </Link>
        </div>

        <div className="hidden lg:block fixed bottom-[calc(-7vh)] left-[calc(-20vw)] xl:left-[calc(-27vw)] 2xl:left-[calc(-31vw)] [@media(width&gt;=1920px)]:left-[calc(-33vw)] font-normal text-sm text-[#1A1B1C] space-y-3 uppercase">
          <p>
            Skinstric developed an A.I. that creates a<br />
            highly-personalized routine tailored to
            <br />
            what your skin needs.
          </p>
        </div>

        <div
          id="left-section"
          className="hidden lg:block fixed left-[calc(-53vw)] xl:left-[calc(-50vw)] top-1/2 -translate-y-1/2 w-[500px] h-[500px] transition-opacity duration-500 ease-in-out opacity-100"
        >
          <div className="relative w-full h-full">
            <div className="dotted-boxLeft"></div>
            <button
              id="discover-button"
              onMouseEnter={() => handleHover('left', true)}
              onMouseLeave={() => handleHover('left', false)}
              className="group inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-md text-sm font-normal text-[#1A1B1C] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer disabled:opacity-50 h-9 absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/5 xl:translate-x-1/6 [@media(width&gt;=1920px)]:translate-x-1/20 px-3 py-1"
            >
              <div className="w-[30px] h-[30px] border border-solid border-black rotate-45 cursor-pointer group-hover:scale-110 duration-300"></div>
              <span className="absolute left-[18px] top-[8px] scale-[0.9] rotate-180 group-hover:scale-105 duration-300">
                ▶
              </span>
              <span>DISCOVER A.I.</span>
            </button>
          </div>
        </div>

        <div
          id="right-section"
          className="hidden lg:block fixed top-1/2 right-[calc(-53vw)] xl:right-[calc(-50vw)] -translate-y-1/2 w-[500px] h-[500px] transition-opacity duration-500 ease-in-out opacity-100"
        >
          <div className="relative w-full h-full">
            <div className="dotted-boxRight"></div>
            <Link href="/testing">
              <button
                id="take-test-button"
                onMouseEnter={() => handleHover('right', true)}
                onMouseLeave={() => handleHover('right', false)}
                className="group inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-md text-sm font-normal text-[#1A1B1C] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer disabled:opacity-50 h-9 absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/5 xl:-translate-x-1/6 [@media(width&gt;=1920px)]:-translate-x-1/20 px-3 py-1"
              >
                TAKE TEST
                <div className="w-[30px] h-[30px] border border-solid border-black rotate-45 group-hover:scale-110 duration-300"></div>
                <span className="absolute left-[107px] top-[9px] scale-[0.9] cursor-pointer group-hover:scale-105 duration-300">
                  ▶
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
