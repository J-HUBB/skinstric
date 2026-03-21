"use client";
import Image from "next/image.js";
import Header from "../components/Header";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name to short")
    .regex(/^([^0-9]*)$/, "Name cannot contain numbers"),
  location: z
    .string()
    .min(2, "Location is too short")
    .regex(/^([^0-9]*)$/, "City cannot contain numbers"),
});

type FormData = z.infer<typeof formSchema>;

const testing = () => {
  const container = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const proceedLinkRef = useRef<HTMLAnchorElement>(null!);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && step === 1) {
      e.preventDefault();
      const isNameValid = await trigger("name");
      if (isNameValid) setStep(2);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    localStorage.setItem("user_info", JSON.stringify(data));

    try {
      const response = await fetch(
        "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      if (response.ok) {
        setIsComplete(true);
      }
    } catch (error) {
      alert("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  useGSAP(
    () => {
      gsap.to(".diamondLarge", {
        rotation: 360,
        duration: 55,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".diamondMedium", {
        rotation: 360,
        duration: 75,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".diamondSmall", {
        rotation: 360,
        duration: 95,
        repeat: -1,
        ease: "none",
      });

      if (isComplete) {
        gsap.fromTo(
          proceedLinkRef.current,
          { opacity: 0, y: 10, visibility: "hidden" },
          {
            opacity: 1,
            y: 0,
            visibility: "visible",
            duration: 1.2,
            ease: "power2.out",
            onStart: () => {
              gsap.set(proceedLinkRef.current, { pointerEvents: "auto" });
            },
          },
        );
      }
    },
    { scope: container, dependencies: [isComplete] },
  );

  return (
    <main ref={container} className="overflow-hidden">
      <Header />
      <div className="min-h-[90vh] flex flex-col items-center justify-center bg-white text-center">
        <div className="absolute top-16 left-9 text-left">
          <p className="font-semibold text-xs">TO START ANALYSIS</p>
        </div>

        {/* {isSubmitting && (
          <p className="absolute z-50 text-2xl font-bold animate-pulse">
            Processing...
          </p>
        )} */}

        <div className="relative flex flex-col items-center justify-center mb-40 w-full h-full">
          {/* Status Message */}
          <p className="text-sm text-gray-400 tracking-wider uppercase mb-4 h-6">
            {isSubmitting
              ? "Processing..."
              : isComplete
                ? "Thank you, proceed to next step"
                : "Click to type"}
          </p>

          {/* <div className="relative flex flex-col items-center justify-center mb-40 w-full h-full">
          <p className="text-sm text-gray-400 tracking-wider uppercase mb-1">
            CLICK TO TYPE
          </p> */}

          {!isComplete && (
            <form className="relative z-10" onSubmit={handleSubmit(onSubmit)}>
              {step === 1 && (
                <div className="flex flex-col items-center">
                  <input
                    className="text-5xl sm:text-6xl font-normal text-center bg-transparent border-b border-black focus:outline-none appearance-none w-[372px] sm:w-[432px] pt-1 tracking-[-0.07em] leading-[64px] text-[#1A1B1C] z-10"
                    placeholder="Introduce Yourself"
                    autoFocus
                    autoComplete="off"
                    type="text"
                    {...register("name")}
                    onKeyDown={handleKeyDown}
                  />
                  {errors.name && (
                    <span className="text-red-500">{errors.name.message}</span>
                  )}
                  {/* <button type="submit" className="sr-only">
                  (Enter)
                </button> */}
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col items-center">
                  <input
                    className="text-5xl sm:text-6xl font-normal text-center bg-transparent border-b border-black focus:outline-none appearance-none w-[372px] sm:w-[432px] pt-1 tracking-[-0.07em] leading-[64px] text-[#1A1B1C] z-10"
                    placeholder="your city name"
                    type="text"
                    autoFocus
                    autoComplete="off"
                    {...register("location")}
                  />
                  {errors.location && (
                    <span className="text-red">{errors.location.message}</span>
                  )}
                  <button type="submit" className="hidden">
                    Submit
                  </button>
                </div>
              )}
            </form>
          )}

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
          <a
            ref={proceedLinkRef}
            className="invisible group flex flex-row relative justify-center items-center pointer-events-none"
            href="/result"
          >
            <div
              className="relative"
              // style={{
              //   position: "relative",
              //   translate: "none",
              //   rotate: "none",
              //   scale: "none",
              //   visibility: "visible",
              //   opacity: "1",
              //   transform: "translate(0px, 0%)",
              // }}
            >
              <div>
                {/* Mobile */}
                <div className=" w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                  <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">
                    PROCEED
                  </span>
                </div>
                {/* Desktop */}
                <div className="group hidden sm:flex flex-row relative justify-center items-center">
                  <span className="text-sm font-semibold hidden sm:block mr-5">
                    PROCEED
                  </span>
                  <div className=" w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"></div>
                  <span className="absolute right-[15px] bottom-[13px] scale-[0.9] hidden sm:block group-hover:scale-[0.92] ease duration-300">
                    ▶
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </main>
  );
};

export default testing;
