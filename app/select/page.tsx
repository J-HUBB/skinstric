"use client";
import Image from "next/image";
import Header from "../components/Header";
// import { useRouter } from "next/navigation";
import { useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Select = () => {
  const container = useRef<HTMLDivElement>(null);

  const smallRectRef = useRef<HTMLImageElement>(null);
  const mediumRectRef = useRef<HTMLImageElement>(null);
  const largeRectRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      // Force initial state through GSAP to avoid Tailwind conflicts
      gsap.set(
        [smallRectRef.current, mediumRectRef.current, largeRectRef.current],
        {
          scale: 0.9, // Adding a tiny scale-in effect
          autoAlpha: 0,
        },
      );
    },
    { scope: container },
  );

  // contextSafe makes the function "memory-safe" for GSAP animations
  const handleHover = (target: "small" | "medium" | "large", show: boolean) => {
    const el =
      target === "small"
        ? smallRectRef.current
        : target === "medium"
          ? mediumRectRef.current
          : largeRectRef.current;

    if (el) {
      gsap.to(el, {
        translateY: -25,
        translateX: -27,
        autoAlpha: show ? 2 : 0,
        scale: show ? 1.5 : 0.8,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true, // Prevents animation stuttering
      });
    }
  };

  return (
    <main ref={container}>
      <Header />
      <div>
        <div className="absolute top-10 left-8 text-left mt-5 z-20">
          <h1 className="text-base font-semibold leading-[24px] tracking-tight">
            A.I. ANALYSIS
          </h1>
          <p className="text-sm mt-1 text-muted-foreground uppercase leading-[24px]">
            A.I. has estimated the following.
            <br />
            Fix estimated information if needed.
          </p>
        </div>

        <div className="h-[78.3vh] flex flex-col items-center justify-center bg-white">
          <div className="relative">
            {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none"> */}
            <div className="absolute w-[400px] h-[400px]">
              {/*transition-all duration-400*/}
              <img
                ref={smallRectRef}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
                alt="Diamond Small"
                loading="lazy"
                decoding="async"
                data-nimg="fill"
                sizes="100vw"
                src="/images/smallRectangle.png"
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  inset: "0px",
                  objectFit: "contain",
                  color: "transparent",
                }}
              />
            </div>
            {/* </div> */}

            {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none"> */}
            <div className="absolute w-[400px] h-[400px]">
              <img
                ref={mediumRectRef}
                className="absolute w-full h-full object-contain pointer-events-none z-0"
                alt="Diamond Medium"
                loading="lazy"
                decoding="async"
                data-nimg="fill"
                sizes="100vw"
                src="/images/mediumRectangle.png"
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  inset: "0px",
                  objectFit: "contain",
                  color: "transparent",
                }}
              />
            </div>
            {/* </div> */}

            {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none"> */}
            <div className="absolute w-[400px] h-[400px]">
              <img
                ref={largeRectRef}
                className="absolute w-full h-full object-contain pointer-events-none z-0"
                alt="Diamond Large"
                loading="lazy"
                decoding="async"
                data-nimg="fill"
                sizes="100vw"
                src="/images/largeRectangle.png"
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  inset: "0px",
                  objectFit: "contain",
                  color: "transparent",
                }}
              />
            </div>
            {/* </div> */}

            <div className="relative z-10 grid grid-cols-3 grid-rows-3 gap-0">
              <div className="flex items-center justify-center col-start-2">
                <Link href="/summary">
                  <button
                    onMouseEnter={() => handleHover("small", true)}
                    onMouseLeave={() => handleHover("small", false)}
                    className="w-[153.88px] h-[153.88px] bg-gray-200 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-5 cursor-pointer font-semibold leading-[24px] tracking-tight uppercase hover:scale-[1.05] transition-transform duration-300"
                  >
                    <span className="transform -rotate-45">Demographics</span>
                  </button>
                </Link>
              </div>

              <div className="flex items-center justify-center row-start-2 col-start-1">
                <button
                  onMouseEnter={() => handleHover("medium", true)}
                  onMouseLeave={() => handleHover("medium", false)}
                  className="w-[153.88px] h-[153.88px] bg-gray-100 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-5 font-semibold leading-[24px] tracking-tight uppercase cursor-not-allowed"
                >
                  <span className="transform -rotate-45">
                    Cosmetic Concerns
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-center row-start-2 col-start-3">
                <button
                  onMouseEnter={() => handleHover("medium", true)}
                  onMouseLeave={() => handleHover("medium", false)}
                  className="w-[153.88px] h-[153.88px] bg-gray-100 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-5 font-semibold leading-[24px] tracking-tight uppercase cursor-not-allowed"
                >
                  <span className="transform -rotate-45">
                    Skin Type Details
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-center row-start-3 col-start-2">
                <button
                  onMouseEnter={() => handleHover("large", true)}
                  onMouseLeave={() => handleHover("large", false)}
                  className="w-[153.88px] h-[153.88px] bg-gray-100 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-5 font-semibold leading-[24px] tracking-tight uppercase cursor-not-allowed"
                >
                  <span className="transform -rotate-45">Weather</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 md:pt-12 pb-8 bg-white sticky md:static bottom-40 mb-0 md:mb-0">
          <div className="flex justify-between max-w-full mx-auto px-13 md:px-9">
            <Link href="/results">
              <div>
                <div className="relative w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                  <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">
                    BACK
                  </span>
                </div>
                <div className="group hidden sm:flex flex-row relative justify-center items-center">
                  <div className="w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"></div>
                  <span className="absolute left-[15px] bottom-[13px] scale-[0.9] rotate-180 hidden sm:block group-hover:scale-[0.92] ease duration-300">
                    ▶
                  </span>
                  <span className="text-sm font-semibold hidden sm:block ml-6 ">
                    BACK
                  </span>
                </div>
              </div>
            </Link>
            <Link href="/summary">
              <div>
                <div className=" w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                  <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">
                    SUM
                  </span>
                </div>
                <div className="group hidden sm:flex flex-row relative justify-center items-center">
                  <span className="text-sm font-semibold hidden sm:block mr-5">
                    GET SUMMARY
                  </span>
                  <div className=" w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"></div>
                  <span className="absolute right-[15px] bottom-[13px] scale-[0.9] hidden sm:block group-hover:scale-[0.92] ease duration-300">
                    ▶
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Select;
