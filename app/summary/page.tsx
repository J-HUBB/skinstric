"use client";

import Header from "../components/Header";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Image from "next/image";

interface DataItem {
  label: string;
  confidence: number;
}

interface TransformedData {
  age: DataItem[];
  gender: DataItem[];
  race: DataItem[];
}

const Summary = () => {
  // 1. Create state to hold our A.I. data
  const [data, setData] = useState<TransformedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] =
    useState<keyof TransformedData>("race");
  const [selectedItems, setSelectedItems] = useState<{
    race: DataItem | null;
    age: DataItem | null;
    gender: DataItem | null;
  }>({ race: null, age: null, gender: null });
  const activeItem = selectedItems[activeCategory];
  const progressRef = useRef<SVGPathElement | null>(null);
  const percentageRef = useRef<HTMLSpanElement | null>(null);

  // 2. Fetch data from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem("ai_analysis_data");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);

        // Ensure we are accessing the nested "data" object from the API response
        const apiData = parsed.data ? parsed.data : parsed;

        // --- LOG 1: See what we pulled from LocalStorage ---
        console.log("🚀 SUCCESS: Raw API Data parsed:", apiData);

        // Helper function to find the key with the highest value in an object
        const transformGroup = (
          groupObj: Record<string, number>,
          groupName: string,
        ): DataItem[] => {
          const transformed = Object.entries(groupObj)
            .map(([label, decimal]) => ({
              label: label.charAt(0).toUpperCase() + label.slice(1),
              confidence: (decimal as number) * 100,
            }))
            .sort((a, b) => b.confidence - a.confidence);
          // NEW: This prints a beautiful table in your console
          console.log(`📊 Transformed Data for: ${groupName.toUpperCase()}`);
          console.table(transformed);

          return transformed;
        };

        const finalData: TransformedData = {
          age: transformGroup(apiData.age, "age"),
          gender: transformGroup(apiData.gender, "gender"),
          race: transformGroup(apiData.race, "race"),
        };

        // --- LOG 2: See the cleaned data before we set it to state ---
        console.log("✨ Cleaned Data for UI:", finalData);

        setData(finalData);

        // Default the active race to the one with the highest confidence score
        setSelectedItems({
          race: finalData.race[0],
          age: finalData.age[0],
          gender: finalData.gender[0],
        });
      } catch (error) {
        console.error("Failed to parse A.I. data", error);
      }
    } else {
      console.log("⚠️ No A.I. data found in localStorage");
    }

    const timer = setTimeout(() => {
    setIsLoading(false);
    }, 2500);

    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);

  }, []);

  // --- LOG 3: See what is currently in React State every time the component renders ---
  console.log("🔄 Component Rendered. Current State Data:", data);
  console.log("🎯 Active Race Selected:", activeItem);

  //   3. Dynamically calculate the SVG progress bar offset based on active confidence
  const CIRCUMFERENCE = 308.819;
  const confidenceScore = activeItem?.confidence || 0;
  const strokeDashoffset =
    CIRCUMFERENCE - (CIRCUMFERENCE * confidenceScore) / 100;

  useGSAP(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        strokeDashoffset: strokeDashoffset,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }, [confidenceScore]); // Re-runs whenever the score changes

useGSAP(() => {
    if (!isLoading && activeItem) {
      const tl = gsap.timeline();

      // 1. Fade in the main containers and text
      tl.from("header, .text-start, .grid > div, .mt-auto", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      // 2. Scale the Progress Circle specifically (lines 244-301 context)
      // This targets the SVG and makes it "pop" into view
      tl.from(".CircularProgressbar", {
        scale: 0.6,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
      }, "-=0.6"); // Starts slightly before the previous animation finishes

      // 3. The Path Animation 
      tl.fromTo(progressRef.current, 
        { strokeDashoffset: CIRCUMFERENCE }, // Start empty
        { 
          strokeDashoffset: strokeDashoffset, // End at calculated value
          duration: 1.5, 
          ease: "power2.inOut" 
        }, 
        "-=0.8"
      );

      // 4. Percentage Counter Animation
      const stats = { value: 0 };
      tl.to(stats, {
        value: confidenceScore,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          if (percentageRef.current) {
            percentageRef.current.innerHTML = Math.round(stats.value).toString();
          }
        }
      }, "-=1.5");

    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <main
        className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden"
      >
        <Header />
        <div className="relative flex flex-col items-center justify-center translate-y-[-10%]">
          <div className="w-[270px] h-[270px] md:w-[482px] md:h-[482px]"></div>
          <Image
            alt="Diamond Large"
            width="482"
            height="482"
            className="diamondLarge2 absolute"
            src="/images/largeRectangle.png"
          />
          <Image
            alt="Diamond Medium"
            width="444"
            height="444"
            className="diamondMedium2 absolute"
            src="/images/mediumRectangle.png"
          />
          <Image
            alt="Diamond Small"
            width="405"
            height="405"
            className="diamondSmall2 absolute"
            src="/images/smallRectangle.png"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Added animate-pulse here */}
            <Image
              alt="Camera Icon"
              width="136"
              height="136"
              className="w-[100px] h-[100px] md:w-[136px] md:h-[136px] animate-pulse"
              src="/images/camera-icon.png"
            />
            <p className="text-xs md:text-sm font-semibold mt-8 tracking-widest text-[#1A1B1C] animate-pulse">
              A.I. CAMERA IS FINALIZING...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col md:mt-5">
        <main className="flex-1 w-full bg-white">
          <div className="max-w-full mx-5 px-4 md:px-auto flex flex-col">
            <div className="text-start ml-4 mb-4 md:mb-10 md:ml-0">
              <h2 className="text-base md:text-base font-semibold mb-1 leading-[24px]">
                A.I. ANALYSIS
              </h2>
              <h3 className="text-4xl md:text-[72px] font-normal leading-[64px] tracking-tighter">
                DEMOGRAPHICS
              </h3>
              <h4 className="text-sm mt-2 leading-[24px]">
                PREDICTED RACE &amp; AGE
              </h4>
            </div>
            <div className="grid md:grid-cols-[1.5fr_8.5fr_3.15fr] gap-4 mt-10 mb-10 md:mb-0">
              {/* LEFT COLUMN: Categories */}
              <div className="bg-white-100 space-y-3 md:flex md:flex-col h-[62%]">
                {/* Race Box */}
                <div
                  onClick={() => setActiveCategory("race")}
                  className={`p-3 cursor-pointer flex-1 flex flex-col justify-between border-t transition-colors ${activeCategory === "race" ? "bg-[#1A1B1C] text-white" : "bg-[#F3F3F4] hover:bg-[#E1E1E2]"}`}
                >
                  <p className="text-base font-semibold">
                    {selectedItems.race?.label}
                  </p>
                  <h4 className="text-base font-semibold mb-1">RACE</h4>
                </div>

                {/* Age Box */}
                <div
                  onClick={() => setActiveCategory("age")}
                  className={`p-3 cursor-pointer flex-1 flex flex-col justify-between border-t transition-colors ${activeCategory === "age" ? "bg-[#1A1B1C] text-white" : "bg-[#F3F3F4] hover:bg-[#E1E1E2]"}`}
                >
                  <p className="text-base font-semibold">
                    {selectedItems.age?.label}
                  </p>
                  <h4 className="text-base font-semibold mb-1">AGE</h4>
                </div>

                {/* Sex Box */}
                <div
                  onClick={() => setActiveCategory("gender")}
                  className={`p-3 cursor-pointer flex-1 flex flex-col justify-between border-t transition-colors ${activeCategory === "gender" ? "bg-[#1A1B1C] text-white" : "bg-[#F3F3F4] hover:bg-[#E1E1E2]"}`}
                >
                  <p className="text-base font-semibold">
                    {selectedItems.gender?.label?.toUpperCase()}
                  </p>
                  <h4 className="text-base font-semibold mb-1">SEX</h4>
                </div>
              </div>

              {/* MIDDLE COLUMN: Circular Progress */}
              <div className="relative bg-gray-100 p-4 flex flex-col items-center justify-center md:h-[57vh] md:border-t">
                <p className="hidden md:block md:absolute text-[40px] mb-2 left-5 top-2">
                  {activeItem?.label}
                  {activeCategory === "age" && (
                    <span className="ml-2 text-2xl font-light lowercase">
                      years-old
                    </span>
                  )}
                </p>
                <div className="relative md:absolute w-full md:w-1/2 lg:w-1/3 max-w-[384px] aspect-square mb-4 md:right-5 md:bottom-2">
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      maxHeight: "384px",
                      position: "relative",
                      transform: "scale(1)",
                      transformOrigin: "center center",
                    }}
                  >
                    <svg
                      className="CircularProgressbar text-[#1A1B1C]"
                      viewBox="0 0 100 100"
                    //   data-test-id="CircularProgressbar"
                    >
                      <path
                        className="CircularProgressbar-trail"
                        d="M 50,50
                        m 0,-49.15
                        a 49.15,49.15 0 1 1 0,98.3
                        a 49.15,49.15 0 1 1 0,-98.3"
                        strokeWidth="1.7"
                        fillOpacity="0"
                        style={{
                          stroke: "#d6d6d6",
                          strokeLinecap: "butt",
                          strokeDasharray: "308.819px, 308.819px",
                          strokeDashoffset: "0px",
                        }}
                      ></path>
                      <path
                        ref={progressRef}
                        className="CircularProgressbar-path"
                        d="
                        M 50,50
                        m 0,-49.15
                        a 49.15,49.15 0 1 1 0,98.3
                        a 49.15,49.15 0 1 1 0,-98.3
                        "
                        strokeWidth="1.7"
                        fillOpacity="0"
                        style={{
                          stroke: "rgb(26, 27, 28)",
                          strokeLinecap: "butt",
                          transitionDuration: "0.8s",
                          strokeDasharray: `${CIRCUMFERENCE}px, ${CIRCUMFERENCE}px`,
                        }}
                      ></path>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-3xl md:text-[40px] font-normal">
                       <span ref={percentageRef}>{Math.round(confidenceScore)}</span>
                        <span className="text-xl md:text-3xl">%</span>
                      </p>
                    </div>
                  </div>
                </div>
                <p className="md:absolute text-xs text-[#A0A4AB] md:text-sm lg:text-base font-normal mb-1 leading-[24px] md:bottom-[-15%] md:left-[22%] lg:left-[30%] xl:left-[40%] 2xl:left-[45%]">
                  If A.I. estimate is wrong, select the correct one.
                </p>
              </div>

              {/* Right Panel: Mapped Race Data */}
              <div className="bg-gray-100 pt-4 pb-4 md:border-t">
                <div className="space-y-0">
                  <div className="flex justify-between px-4">
                    <h4 className="text-base leading-[24px] tracking-tight font-medium mb-2 capitalize">
                      {activeCategory === "gender" ? "sex" : activeCategory}
                    </h4>
                    <h4 className="text-base leading-[24px] tracking-tight font-medium mb-2">
                      A.I. CONFIDENCE
                    </h4>
                  </div>

                  {/* 4. Map through the data and use ternaries for active classes/icons */}
                  {data?.[activeCategory].map((Item) => {
                    const isActive = activeItem?.label === Item.label;

                    return (
                      <div
                        key={Item.label} // The map handles the repetition, this is the only div you need!
                        onClick={() =>
                          setSelectedItems((prev) => ({
                            ...prev,
                            [activeCategory]: Item,
                          }))
                        }
                        className={`flex items-center justify-between h-[48px] px-4 cursor-pointer transition-colors duration-200 
                            ${isActive ? "bg-[#1A1B1C] text-white hover:bg-black" : "hover:bg-[#E1E1E2] text-[#1A1B1C]"}`}
                      >
                        <div className="flex items-center gap-1">
                          <img
                            alt="radio button"
                            src={
                              isActive
                                ? "/images/radioButton2.png"
                                : "/images/radioButton.png"
                            }
                            loading="lazy"
                            width="12"
                            height="12"
                            className="w-[12px] h-[12px] mr-2"
                          />
                          <span className="font-normal text-base leading-6 tracking-tight">
                            {Item.label}
                          </span>
                        </div>
                        <span className="font-normal text-base leading-6 tracking-tight">
                          {Math.round(Item.confidence)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="pt-10 pb-16 bg-white mt-auto">
              <div className="flex justify-between max-w-full mx-auto px-4 md:px-0">
                <Link href="/select">
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
                <Link href="/">
                  <div>
                    <div className=" w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                      <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">
                        HOME
                      </span>
                    </div>
                    <div className="hidden sm:flex flex-row relative justify-center items-center">
                      <span className="text-sm font-semibold hidden sm:block mr-5">
                        HOME
                      </span>
                      <div className=" w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85]"></div>
                      <span className="absolute right-[15px] bottom-[13px] scale-[0.9] hidden sm:block">
                        ▶
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Summary;
