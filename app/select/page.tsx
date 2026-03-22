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

      // 2. Create a master timeline
      const tl = gsap.timeline({
        delay: 0.1, // Slight buffer on mount
        defaults: { ease: "power4.out", duration: 0.9 }, // Shared easing for consistency
      });

      // 3. Animate the header text sliding DOWN
      tl.from(".header-text", {
        autoAlpha: 0,
        y: -30,
        duration: 0.7,
        stagger: 0.1, // H1 fades in, then the paragraph follows
      })

        // 4. Animate the diamonds floating UP
        .from(".diamond-btn", {
          autoAlpha: 0,
          y: 40,
          duration: 0.8,
          delay: 0.1,
          ease: "power3.out",
          stagger: 0.15,
        }) // Starts mid-way through header animation

        .from(
          ".footer-nav",
          {
            autoAlpha: 0,
            y: 50,
            duration: 1,
          },
          "-=0.6",
        ); // Starts mid-way through diamond animation
    },
    { scope: container },
  );

  // contextSafe makes the function "memory-safe" for GSAP animations
  const handleHover = (
    target: "small" | "medium" | "large",
    show: boolean,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const el =
      target === "small"
        ? smallRectRef.current
        : target === "medium"
          ? mediumRectRef.current
          : largeRectRef.current;

    if (el) {
      gsap.to(el, {
        y: -0,
        x: -0,
        autoAlpha: show ? 1 : 0,
        scale: show ? 1.5 : 0.8,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true, // Prevents animation stuttering
      });

      gsap.to(event.currentTarget, {
        scale: show ? 1.05 : 1,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true,
      });
    }
  };

  return (
    <main ref={container}>
      <Header />
      <div>
        <div className="absolute top-10 left-8 text-left mt-5 z-20">
          <h1 className="header-text text-base font-semibold leading-[24px] tracking-tight">
            A.I. ANALYSIS
          </h1>
          <p className="header-text text-sm mt-1 text-muted-foreground uppercase leading-[24px]">
            A.I. has estimated the following.
            <br />
            Fix estimated information if needed.
          </p>
        </div>

        <div className="h-[78.3vh] flex flex-col items-center justify-center bg-white overflow-visible py-32 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div className="absolute w-[400px] h-[400px]">
                {/*transition-all duration-400*/}
                <img
                  ref={smallRectRef}
                  className="absolute inset-0 w-full h-full flex items-center justify-center object-contain"
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
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[450px] h-[450px]">
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
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[500px] h-[500px]">
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
            </div>

            <div className="relative  grid grid-cols-3 grid-rows-3 gap-0">
              <div className="flex items-center justify-center row-start-1 col-start-2">
                <Link href="/summary">
                  <button
                    onMouseEnter={(e) => handleHover("small", true, e)}
                    onMouseLeave={(e) => handleHover("small", false, e)}
                    className="diamond-btn w-[153.88px] h-[153.88px] bg-gray-200 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-5 cursor-pointer font-semibold leading-[24px] tracking-tight uppercase"
                  >
                    <span className="transform -rotate-45">Demographics</span>
                  </button>
                </Link>
              </div>

              <div className="flex items-center justify-center row-start-2 col-start-1">
                <button
                  onMouseEnter={(e) => handleHover("medium", true, e)}
                  onMouseLeave={(e) => handleHover("medium", false, e)}
                  className="diamond-btn w-[153.88px] h-[153.88px] bg-gray-100 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-5 font-semibold leading-[24px] tracking-tight uppercase cursor-not-allowed"
                >
                  <span className="transform -rotate-45">
                    Cosmetic Concerns
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-center row-start-2 col-start-3">
                <button
                  onMouseEnter={(e) => handleHover("medium", true, e)}
                  onMouseLeave={(e) => handleHover("medium", false, e)}
                  className="diamond-btn w-[153.88px] h-[153.88px] bg-gray-100 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-5 font-semibold leading-[24px] tracking-tight uppercase cursor-not-allowed"
                >
                  <span className="transform -rotate-45">
                    Skin Type Details
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-center row-start-3 col-start-2">
                <button
                  onMouseEnter={(e) => handleHover("large", true, e)}
                  onMouseLeave={(e) => handleHover("large", false, e)}
                  className="diamond-btn w-[153.88px] h-[153.88px] bg-gray-100 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-5 font-semibold leading-[24px] tracking-tight uppercase cursor-not-allowed"
                >
                  <span className="transform -rotate-45">Weather</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-nav pt-4 md:pt-12 pb-8 bg-white sticky md:static bottom-40 mb-0 md:mb-0 z-20">
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
