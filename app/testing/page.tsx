"use client";
import Image from "next/image.js";
import Header from "../components/Header";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const testing = () => {
  const container = useRef();

  useGSAP(() => {
    gsap.to(".diamondLarge", {
      rotation: 360,
      duration: 55,
      repeat: -1,
      ease: "none"
    });

    gsap.to(".diamondMedium", {
      rotation: 360,
      duration: 75,
      repeat: -1,
      ease: "none"
    });

    gsap.to(".diamondSmall", {
      rotation: 360,
      duration: 95,
      repeat: -1,
      ease: "none"
    });
  }, { scope: container });

  return (
    <main ref={container}>
      <Header />
      <div className="min-h-[90vh] flex flex-col items-center justify-center bg-white text-center">
        <div className="absolute top-16 left-9 text-left">
          <p className="font-semibold text-xs">TO START ANALYSIS</p>
        </div>
        <div className="relative flex flex-col items-center justify-center mb-40 w-full h-full">
          <p className="text-sm text-gray-400 tracking-wider uppercase mb-1">
            CLICK TO TYPE
          </p>
          <form
            action="javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
            className="relative z-10"
          >
            <div className="flex flex-col items-center"></div>
            <input
              className="text-5xl sm:text-6xl font-normal text-center bg-transparent border-b border-black focus:outline-none appearance-none w-[372px] sm:w-[432px] pt-1 tracking-[-0.07em] leading-[64px] text-[#1A1B1C] z-10"
              placeholder="Introduce Yourself"
              autoComplete="off"
              type="text"
              name="name"
            />
            <button type="submit" className="sr-only">
              Submit
            </button>
          </form>
          <Image
            alt="Diamond Large"
            loading="eager"
            width="762"
            height="762"
            decoding="async"
            data-nimg="1"
            className="diamondLarge"
            src="/images/largeRectangle.png"
            style={{ color: "transparent", width: "auto" }}
          />
          <Image
            alt="Diamond Medium"
            loading="lazy"
            width="682"
            height="682"
            decoding="async"
            data-nimg="1"
            className="diamondMedium"
            src="/images/mediumRectangle.png"
            style={{ color: "transparent" }}
          />
          <Image
            alt="Diamond Small"
            loading="lazy"
            width="602"
            height="602"
            decoding="async"
            data-nimg="1"
            className="diamondSmall"
            src="/images/smallRectangle.png"
            style={{ color: "transparent" }}
          />
        </div>
        <div className="absolute bottom-38.5 md:bottom-8 w-full flex justify-between md:px-9 px-13">
          <a className="inset-0" aria-label="Back" href="/">
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
          </a>
        </div>
      </div>
    </main>
  );
};

export default testing;
