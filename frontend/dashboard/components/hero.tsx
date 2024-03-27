import React from "react";
import { cn } from "@/utils/cn";
import { Spotlight } from "./ui/Spotlight";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import Link from "next/link";

export function Hero() {
  return (
    <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          ChatSight <br /> Uncover Your Chat Insights.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-xl text-center mx-auto">
          Dive deep into your WhatsApp conversations and discover trends,
          patterns, and secrets you never knew existed. ChatSight brings your
          chats into the spotlight, offering a unique perspective on your
          digital dialogues. Why stay in the dark when you can illuminate your
          conversations with insights?
        </p>
        <div className="m-10 flex justify-center text-center">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 hover:bg-white hover:text-amber-950 delay-50 duration-200 ease-in-out"
          >
            <Link href={"/analyze"}>
            <span>Analyze Now!</span>
            </Link>
          </HoverBorderGradient>
        </div>
      </div>
    </div>
  );
}
