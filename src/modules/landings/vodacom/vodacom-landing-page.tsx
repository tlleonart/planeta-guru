"use client";

import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { useMedia } from "react-use";
import hero from "@/public/landings/vodacom/hero.png";
import logo from "@/public/logo.png";
import { VodacomWapSubscriptionButton } from "../components/wap-subscription-button";
import { VodacomWebSubscriptionButton } from "../components/web-subscription-button";

interface VodacomLandingPageProps {
  msisdn?: string;
}

export const VodacomLandingPage: FC<VodacomLandingPageProps> = ({ msisdn }) => {
  const isDesktop = useMedia("(min-width: 1024px", true);

  return (
    <main className="h-screen flex flex-col bg-[#010b2b] text-white overflow-hidden">
      <header className="container mx-auto p-6">
        <div className="w-40">
          <Image
            src={logo}
            alt="Planeta Guru Logo"
            width={160}
            height={50}
            priority
          />
        </div>
      </header>
      <div className="flex-1 container mx-auto px-6 flex flex-col">
        <div
          className={`flex flex-1 ${
            !isDesktop
              ? "flex-col items-center text-center"
              : "flex-row items-center justify-between"
          }`}
        >
          <div className={`${!isDesktop ? "mb-8" : "max-w-xl"}`}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Play instantly, anywhere.
              <br />
              Subscribe to Planeta Guru today.
            </h1>
            <div className="space-y-2 mb-8">
              <p className="text-lg">
                Get <span className="font-bold">unlimited access</span> to games
                with no downloads or installs, just have fun.
              </p>
              <p className="text-lg">Subscribe for only R10 per day!</p>
            </div>
            <div className="flex flex-col space-y-4">
              {msisdn === undefined ? (
                <VodacomWebSubscriptionButton />
              ) : (
                <VodacomWapSubscriptionButton msisdn={msisdn} />
              )}
              <p className="text-xs">
                (*) Clicking SUBSCRIBE HERE, you agree to the{" "}
                <Link
                  href="https://storage.googleapis.com/planeta-guru-assets-bucket/terms/planetaguru/tyc-pg-vodacom.html"
                  target="_blank"
                  className="underline"
                >
                  terms and conditions
                </Link>
                .
              </p>
            </div>
          </div>
          <div
            className={`${
              !isDesktop ? "w-full max-w-md" : "w-[500px] h-[500px]"
            }`}
          >
            <Image
              src={hero}
              alt="Game Character"
              width={500}
              height={500}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
      <footer className="w-full bg-[#3a5ac0] py-4 text-center text-white">
        <p>SUBSCRIPTION R10/day. To unsubscribe dial *135*997#</p>
      </footer>
    </main>
  );
};
