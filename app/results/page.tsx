"use client";
import Image from "next/image.js";
import Header from "../components/Header";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";

const Results = () => {
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [view, setView] = useState<"select" | "loading" | "capture" | "review">(
    "select",
  );

  const startCameraPreview = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Camera access denied or not available.");
      setIsModalOpen(false);
    }
  };

  const confirmAndProceed = () => {
    setIsModalOpen(false); // Close the modal
    setView("loading"); // Switch to the loading animation

    // Wait 2.5 seconds, then go to the capture screen
    setTimeout(() => {
      setView("capture");
    }, 2500);
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;

      // Instead of just setting the raw (massive) string, we draw it to a canvas to shrink it
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");

        // Scale it down to match the camera width
        const MAX_WIDTH = 640;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Compress to JPEG at 70% quality
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

          // 1. Set the image so the user can see it in the "Review" view
          setCapturedImage(compressedBase64);

          // 2. Stop the camera if it was running
          stopCamera();

          // 3. Switch to the review screen
          setView("review");
        }
      };
      img.src = reader.result as string;
    };
    // This triggers the conversion of the file to a Base64 string
    reader.readAsDataURL(file);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  useGSAP(
    () => {
      gsap.to(".diamondLarge2", {
        rotation: 360,
        duration: 55,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".diamondMedium2", {
        rotation: 360,
        duration: 75,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".diamondSmall2", {
        rotation: 360,
        duration: 95,
        repeat: -1,
        ease: "none",
      });
    },
    { scope: container, dependencies: [view] },
  );

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, view]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const takePicture = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // 1. Set canvas dimensions to match the actual video resolution
        canvas.width = 640;
        canvas.height = 480;

        // 2. Draw the current video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 3. Convert the canvas drawing into a JPEG image string
        const imageData = canvas.toDataURL("image/jpeg", 0.7); // 0.9 is image quality

        console.log("Photo captured successfully!");
        setCapturedImage(imageData);

        //   setIsUploading(true)
        // 4. Turn off the camera since we have the photo
        stopCamera();

        // 5. Next Step: Change the view to show the user their photo!
        setView("review");

        // try {
        //   // 4. Send to the API
        //   const response = await fetch(
        //     "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo",
        //     {
        //       method: "POST",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },
        //       // IMPORTANT: Check if your API expects the key to be "image", "file", or something else!
        //       body: JSON.stringify({ "Image": imageData }),
        //     },
        //   );

        //   if (!response.ok) {
        //     throw new Error(`API Error: ${response.status}`);
        //   }

        //   const data = await response.json();
        //   console.log("A.I. Analysis Complete:", data);

        //   // 5. Success! Move to the final results view
        //   // setView("results");
        // } catch (error) {
        //   console.error("Error uploading image:", error);
        //   alert("There was an issue analyzing your photo. Please try again.");
        //   // Optional: restart the camera so they can try again
        // } finally {
        //   setIsUploading(false); // Turn off the loading UI
        // }
      }
    }
  };

  const submitPhoto = async () => {
    if (!capturedImage) return;

    setIsUploading(true); // Start the loading spinner

    try {
      // 1. Strip the "data:image/jpeg;base64," prefix so the API just gets the raw string
      const base64String = capturedImage.includes(",")
        ? capturedImage.split(",")[1]
        : capturedImage;

      // 2. Construct the exact payload
      const payload = {
        Image: base64String,
        image: base64String,
      };

      console.log("Sending payload. String length:", base64String.length);

      // 3. Send to your endpoint
      const response = await fetch(
        "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server Error Response:", errorData);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("A.I. Analysis Complete:", data);

      localStorage.setItem("ai_analysis_data", JSON.stringify(data));

      // Success! Here you will transition to your final results page.
      //   setView("results");
      router.push("/summary");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("There was an issue analyzing your photo. Please try again.");
    } finally {
      setIsUploading(false); // Stop the loading spinner
    }
  };

  // ==========================================
  // VIEW: LOADING SCREEN
  // ==========================================
  if (view === "loading") {
    return (
      <main
        ref={container}
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
              A.I. CAMERA IS INITIALIZING...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // VIEW: PHOTO CAPTURE SCREEN
  // ==========================================
  if (view === "capture") {
    return (
      <main className="min-h-screen bg-[#f4f5f7] flex flex-col relative">
        <Header />
        <div className="h-[90vh] w-screen">
          <div className="relative h-[92vh] w-screen overflow-hidden bg-gray-900">
            <div className="absolute inset-0 z-10">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 flex items-center space-x-3">
                <div className="font-semibold text-sm tracking-tight leading-[14px] text-[#FCFCFC] hidden sm:block">
                  TAKE PICTURE
                </div>
                <div className="transform hover:scale-105 ease-in-out duration-300">
                  <Image
                    alt="Take Picture"
                    loading="lazy"
                    width="60"
                    height="60"
                    decoding="async"
                    data-nimg="1"
                    className="w-16 h-16 cursor-pointer"
                    src="/images/captureButton.png"
                    style={{ color: "transparent" }}
                    onClick={takePicture}
                  />
                </div>
              </div>
              <div className="absolute bottom-30 sm:bottom-40 left-0 right-0 text-center z-20">
                <p className="text-sm mb-2 font-normal leading-6 text-[#FCFCFC]">
                  TO GET BETTER RESULTS MAKE SURE TO HAVE
                </p>
                <div className="flex justify-center space-x-8 text-xs leading-6 text-[#FCFCFC]">
                  <p>◇ NEUTRAL EXPRESSION</p>
                  <p>◇ FRONTAL POSE</p>
                  <p>◇ ADEQUATE LIGHTING</p>
                </div>
              </div>
            </div>
            <div className="absolute md:bottom-8 bottom-60 left-8 z-20">
              <button
                onClick={() => {
                  stopCamera();
                  setView("select");
                }}
              >
                <div>
                  <div className="relative w-12 h-12 flex items-center justify-center border border-[#FCFCFC] rotate-45 scale-[1] sm:hidden">
                    <span className="rotate-[-45deg] text-xs font-semibold sm:hidden text-[#FCFCFC]">
                      BACK
                    </span>
                  </div>
                  <div className="group hidden sm:flex flex-row relative justify-center items-center">
                    <div className=" w-12 h-12 hidden sm:flex justify-center border border-[#FCFCFC] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"></div>
                    <span className="absolute left-[15px] bottom-[13px] scale-[0.9] rotate-180 hidden sm:block text-[#FCFCFC] group-hover:scale-[0.92] ease duration-300">
                      ▶
                    </span>
                    <span className="text-sm font-semibold hidden sm:block ml-6 text-[#FCFCFC]">
                      BACK
                    </span>
                  </div>
                </div>
              </button>
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // VIEW: REVIEW PHOTO SCREEN
  // ==========================================
  if (view === "review") {
    return (
      <main className="min-h-screen bg-[#f4f5f7] flex flex-col relative">
        <Header />
        <div className="h-[90vh] w-screen">
          <div className="relative h-[92vh] w-screen overflow-hidden bg-gray-900">
            <div className="absolute inset-0 z-10 flex flex-col items-center">
              {/* Display the captured static image */}
              {capturedImage && (
                <img
                  src={capturedImage}
                  alt="Captured selfie"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {/* Uploading Overlay (Shows when they click Submit) */}
              {isUploading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                  <p className="text-white font-semibold tracking-widest text-sm animate-pulse">
                    ANALYZING A.I. DATA...
                  </p>
                </div>
              )}

              <div className="absolute text-sm leading-6 uppercase text-[#FCFCFC] top-40">
                GREAT SHOT!
              </div>
              <div className="absolute bottom-40 sm:bottom-16 left-0 right-0 flex flex-col items-center z-20">
                <h2 className="text-lg font-semibold mb-5 md:mb-7 text-[#FCFCFC] drop-shadow-md">
                  Preview
                </h2>
                <div className="flex justify-center space-x-6">
                  <button
                    onClick={() => {
                      setCapturedImage(null);
                      startCameraPreview(); // Turn the camera back on
                      setView("capture"); // Go back to the capture screen
                    }}
                    disabled={isUploading}
                    className="px-4 py-1 bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300 shadow-md text-sm"
                  >
                    Retake
                  </button>
                  <button
                    onClick={submitPhoto}
                    disabled={isUploading}
                    className="px-6 py-2 bg-[#1A1B1C] text-[#FCFCFC] cursor-pointer hover:bg-gray-800 shadow-md text-sm"
                  >
                    Use This Photo
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute md:bottom-8 bottom-60 left-8 z-20">
              <a href="/results">
                <div>
                  <div className="relative w-12 h-12 flex items-center justify-center border border-[#FCFCFC] rotate-45 scale-[1] sm:hidden">
                    <span className="rotate-[-45deg] text-xs font-semibold sm:hidden text-[#FCFCFC]">
                      BACK
                    </span>
                  </div>
                  <div className="group hidden sm:flex flex-row relative justify-center items-center">
                    <div className=" w-12 h-12 hidden sm:flex justify-center border border-[#FCFCFC] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"></div>
                    <span className="absolute left-[15px] bottom-[13px] scale-[0.9] rotate-180 hidden sm:block text-[#FCFCFC] group-hover:scale-[0.92] ease duration-300">
                      ▶
                    </span>
                    <span className="text-sm font-semibold hidden sm:block ml-6 text-[#FCFCFC]">
                      BACK
                    </span>
                  </div>
                </div>
              </a>
            </div>
            <canvas className="hidden" width="1280" height="720"></canvas>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // VIEW: DEFAULT SELECTION SCREEN
  // ==========================================

  return (
    <main ref={container}>
      <Header />
      <div className="min-h-[92vh] flex flex-col bg-white relative md:pt-[64px] justify-center">
        <div className="absolute top-2 left-9 md:left-8 text-left">
          <p className="font-semibold text-xs md:text-sm">TO START ANALYSIS</p>
        </div>
        <div className="flex-[0.4] md:flex-1 flex flex-col md:flex-row items-center xl:justify-center relative mb-0 md:mb-30 space-y-[-20px] md:space-y-0">
          <div className="relative md:absolute md:left-[55%] lg:left-[50%] xl:left-[40%] md:-translate-y-[0%] -translate-y-[1%] md:-translate-x-full flex flex-col items-center justify-center">
            <div className="w-[270px] h-[270px] md:w-[482px] md:h-[482px]"></div>
            <Image
              alt="Diamond Large"
              loading="lazy"
              width="482"
              height="482"
              decoding="async"
              data-nimg="1"
              className="diamondLarge2"
              src="/images/largeRectangle.png"
              style={{ color: "transparent" }}
            />
            <Image
              alt="Diamond Medium"
              width="444"
              height="444"
              decoding="async"
              data-nimg="1"
              className="diamondMedium2"
              src="/images/mediumRectangle.png"
              style={{ color: "transparent" }}
            />
            <Image
              alt="DiamondSmall"
              loading="lazy"
              width="405"
              height="405"
              decoding="async"
              data-nimg="1"
              className="diamondSmall2"
              src="/images/smallRectangle.png"
              style={{ color: "transparent" }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Image
                id="cameraTrigger"
                alt="Camera Icon"
                loading="lazy"
                width="136"
                height="136"
                decoding="async"
                data-nimg="1"
                className="absolute w-[100px] h-[100px] md:w-[136px] md:h-[136px] hover:scale-108 duration-700 ease-in-out cursor-pointer"
                src="/images/camera-icon.png"
                style={{ color: "transparent" }}
                onClick={() => {
                  setIsModalOpen(true);
                  startCameraPreview();
                }}
              />
              <div className="absolute bottom-[1%] right-[90px] md:top-[30.9%] md:right-[-12px] translate-y-[-20px]">
                <p className="text-xs md:text-sm font-normal mt-1 leading-[24px]">
                  ALLOW A.I.
                  <br />
                  TO SCAN YOUR FACE
                </p>
                <Image
                  alt="Scan Line"
                  loading="lazy"
                  width="66"
                  height="59"
                  decoding="async"
                  data-nimg="1"
                  className="absolute hidden md:block md:right-[143px] md:top-[20px]"
                  src="/images/scanLine.png"
                  style={{ color: "transparent" }}
                />
              </div>
            </div>
            <div
              id="cameraModal"
              className={`${isModalOpen ? "block" : "hidden"} absolute md:top-[43%] md:left-[360px] w-[352px] z-50`}
            >
              <div className="bg-[#1A1B1C] pt-4 pb-2">
                <h2 className="text-[#FCFCFC] text-base font-semibold mb-12 leading-[24px] pl-4">
                  ALLOW A.I. TO ACCESS YOUR CAMERA
                </h2>
                <div className="flex mt-4 border-t border-[#FCFCFC] pt-2">
                  <button
                    id="denyBtn"
                    onClick={() => {
                      stopCamera();
                      setIsModalOpen(false);
                    }}
                    className="px-7 md:translate-x-45 text-[#fcfcfca1] font-normal text-sm leading-4 tracking-tight cursor-pointer hover:text-gray-500"
                  >
                    DENY
                  </button>
                  <button
                    onClick={confirmAndProceed}
                    className="px-5 md:translate-x-45 text-[#FCFCFC] font-semibold text-sm leading-4 tracking-tight cursor-pointer hover:text-gray-300"
                  >
                    ALLOW
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`relative md:absolute md:left-[45%] lg:left-[50%] xl:left-[55%] flex flex-col items-center mt-12 md:mt-0 justify-center md:-translate-y-[0%] -translate-y-[10%] transition-all duration-300 ${stream ? "opacity-30 pointer-events-none" : "opacity-100"}`}
          >
            <div className="w-[270px] h-[270px] md:w-[482px] md:h-[482px]"></div>
            <Image
              alt="Diamond Large"
              loading="lazy"
              width="484"
              height="484"
              decoding="async"
              data-nimg="1"
              className="diamondLarge2"
              src="/images/largeRectangle.png"
              style={{ color: "transparent" }}
            />
            <Image
              alt="DiamondMedium"
              loading="lazy"
              width="448"
              height="448"
              decoding="async"
              data-nimg="1"
              className="diamondMedium2"
              src="/images/mediumRectangle.png"
              style={{ color: "transparent" }}
            />
            <Image
              alt="DiamondSmall"
              loading="lazy"
              width="408"
              height="408"
              decoding="async"
              data-nimg="1"
              className="diamondSmall2"
              src="/images/smallRectangle.png"
              style={{ color: "transparent" }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Image
                alt="Photo Upload Icon"
                loading="lazy"
                width="136"
                height="136"
                decoding="async"
                data-nimg="1"
                className={`absolute w-[100px] h-[100px] md:w-[136px] md:h-[136px] hover:scale-108 duration-700 ease-in-out ${stream ? "cursor-not-allowed" : "cursor-pointer"}`}
                src="/images/photo-upload.png"
                style={{ color: "transparent" }}
                onClick={() => {
                  if (!stream) fileInputRef.current?.click();
                }} //Opens file picker
              />
              <div className="absolute top-[75%] md:top-[70%] md:left-[17px] translate-y-[-10px]">
                <p className="text-[12px] md:text-[14px] font-normal mt-2 leading-[24px] text-right">
                  ALLOW A.I.
                  <br />
                  ACCESS GALLERY
                </p>
                <Image
                  alt="Gallery Line"
                  loading="lazy"
                  width="66"
                  height="59"
                  decoding="async"
                  data-nimg="1"
                  className="absolute hidden md:block md:left-[120px] md:bottom-[39px]"
                  src="/images/galleryLine.png"
                  style={{
                    color: "transparent",
                    width: "66.33px",
                    height: "59.37px",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="absolute top-[-75px] right-7 md:top-[-50px] md:right-8 transition-opacity duration-300 opacity-100">
            <h1 className="text-xs md:text-sm font-normal mb-1">Preview</h1>
            <div className="w-24 h-24 md:w-32 md:h-32 border border-gray-300 overflow-hidden">
              {stream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-[10px] text-gray-500 text-center px-2">
                  Camera Off
                </div>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            type="file"
            onChange={handleFileUpload}
          />
        </div>
        <div className="pt-4 md:pt-0 pb-8 bg-white sticky md:static bottom-30.5 mb-0 md:mb-0">
          <div className="absolute bottom-8 w-full flex justify-between md:px-9 px-13">
            <a className="relative" aria-label="Back" href="/testing">
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
            <a href="/select">
              <div className="hidden">
                <div>
                  <div className=" w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                    <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">
                      PROCEED
                    </span>
                  </div>
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
      </div>
    </main>
  );
};

export default Results;
