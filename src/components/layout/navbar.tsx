"use client";

import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useState, MouseEvent, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
} from "../ui/drawer";

// register gsap plugins once on client
if (
  typeof window !== "undefined" &&
  (gsap as any) &&
  !(gsap as any)._htbPlugins
) {
  gsap.registerPlugin(ScrollToPlugin, ScrambleTextPlugin);
  (gsap as any)._htbPlugins = true;
}

import { NAV_LINKS, SOCIAL_LINKS } from "~/lib/constants/navigation";
import { useRouter, usePathname } from "next/navigation";

const STYLES = {
  navButton: {
    base: "bg-transparent font-normal",
    desktop: "text-black text-xs",
    mobile: "text-white font-whyte",
  },
} as const;

const NavLinks = ({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const containerClasses = mobile
    ? "flex flex-col items-start gap-2 text-[9px]"
    : "flex w-full items-center justify-center gap-14 text-black";

  const buttonClasses = mobile
    ? "py-1 px-0 text-2xl rounded-none text-white w-auto inline-block font-bold"
    : `${STYLES.navButton.base} ${STYLES.navButton.desktop}`;

  // smooth scroll handler using gsap ScrollTo with offset for navbar
  const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("/#")) return;

    if (pathname !== "/") {
      router.push("/");
      return;
    }

    // play click animation on mobile
    if (mobile) {
      const anchor = e.currentTarget;
      const bg = anchor.querySelector(".navlink-bg") as HTMLElement | null;
      const text = anchor.querySelector(".navlink-text") as HTMLElement | null;
      if (bg) {
        gsap.killTweensOf(bg);
        gsap.set(bg, { zIndex: 0, transformOrigin: "left center", scaleX: 0 });
        gsap.to(bg, { scaleX: 1, duration: 0.25, ease: "power2.out" });
      }
      if (text) {
        if (!text.dataset.originalLabel)
          text.dataset.originalLabel = text.textContent || "";
        gsap.killTweensOf(text);
        gsap.set(text, { position: "relative", zIndex: 1 });
        gsap.to(text, { color: "#000", duration: 0.2, ease: "power2.out" });
        gsap.to(text, {
          duration: 0.5,
          scrambleText: {
            text: text.dataset.originalLabel || "",
            chars: "upperCase",
            revealDelay: 0,
            speed: 0.6,
          },
        });
      }
    }

    const id = href.replace("/#", "");
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 88; // approximate navbar height

    const doScroll = () =>
      gsap.to(window, {
        duration: 0.6,
        ease: "power2.out",
        scrollTo: { y: el, offsetY: offset },
      });

    if (mobile && onNavigate) {
      // close the drawer first so content becomes scrollable and visible
      onNavigate();
      // give the drawer a brief moment to start closing before scrolling
      setTimeout(doScroll, 220);
    } else {
      doScroll();
    }
  };

  return (
    <div className={containerClasses}>
      {NAV_LINKS.map(({ href, label }) => (
        <Button
          asChild
          key={href}
          className={buttonClasses + " hover:none px-0 py-0"}
          variant="ghost"
        >
          <a
            href={href}
            onClick={(e) => handleClick(e, href)}
            className="relative inline-block"
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              const bg = el.querySelector(".navlink-bg") as HTMLElement;
              const text = el.querySelector(".navlink-text") as HTMLElement;
              if (bg) {
                gsap.killTweensOf(bg);
                gsap.set(bg, { zIndex: 0 });
                gsap.fromTo(
                  bg,
                  { scaleX: 0, transformOrigin: "left center" },
                  { scaleX: 1, duration: 0.25, ease: "power2.out" }
                );
              }
              if (text) {
                // Store original label if not already stored
                if (!text.dataset.originalLabel) {
                  text.dataset.originalLabel = label;
                }
                gsap.killTweensOf(text);
                gsap.set(text, { position: "relative", zIndex: 1 });
                gsap.to(text, {
                  color: mobile ? "#000" : "#fff",
                  duration: 0.2,
                  ease: "power2.out",
                });
                gsap.to(text, {
                  duration: 0.5,
                  scrambleText: {
                    text: label,
                    chars: "upperCase",
                    revealDelay: 0,
                    speed: 0.6,
                  },
                });
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              const bg = el.querySelector(".navlink-bg") as HTMLElement;
              const text = el.querySelector(".navlink-text") as HTMLElement;
              if (bg) {
                gsap.killTweensOf(bg);
                gsap.to(bg, {
                  scaleX: 0,
                  transformOrigin: "right center",
                  duration: 0.25,
                  ease: "power2.in",
                });
              }
              if (text) {
                gsap.killTweensOf(text);
                // Restore original text content to avoid partial scramble
                if (text.dataset.originalLabel) {
                  text.textContent = text.dataset.originalLabel;
                }
                gsap.to(text, {
                  color: mobile ? "#fff" : "#000",
                  duration: 0.2,
                  ease: "power2.out",
                });
              }
            }}
          >
            <span
              className={
                "navlink-bg pointer-events-none absolute inset-0 -z-10 origin-left scale-x-0 " +
                (mobile ? "bg-white" : "bg-black")
              }
            />
            <span className="navlink-text relative z-[1]">{label}</span>
          </a>
        </Button>
      ))}
    </div>
  );
};

const MobileDrawer = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => (
  <div className="flex h-full items-center px-4">
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="-ml-1 block cursor-pointer lg:hidden"
        >
          <Menu className="h-6 w-6 text-black" />
        </button>
      </DrawerTrigger>

      <DrawerContent className="h-fit border border-border/10 bg-black backdrop-blur-xl">
        <DrawerTitle className="sr-only">Menu</DrawerTitle>
        <div className="z-1 absolute -top-1 h-10 w-full bg-black"></div>

        <div className="z-10 -mt-5 flex flex-col divide-y divide-zinc-800">
          <section className="flex items-start px-6 pb-3 pt-9">
            <div className="shrink-0 basis-1/3 pr-4">
              <div className="flex items-center gap-2 pt-2 text-[9px] uppercase text-white">
                <span className="h-1 w-1 bg-white" />
                <span>Pages</span>
              </div>
            </div>
            <div className="basis-2/3">
              <div className="flex flex-col items-start gap-1 font-whyte text-sm [&_a]:inline-block [&_a]:rounded-none [&_a]:px-0 [&_a]:py-1 [&_a]:text-left">
                <NavLinks mobile onNavigate={() => onOpenChange(false)} />
              </div>
            </div>
          </section>

          <section className="flex items-start px-6 py-8">
            <div className="shrink-0 basis-1/3 pr-4">
              <div className="flex items-center gap-2 text-[9px] uppercase text-white">
                <span className="h-1 w-1 bg-white" />
                <span>Connect</span>
              </div>
            </div>
            <div className="basis-2/3">
              <ul className="-mt-0.5 flex flex-col gap-2 text-[11px] uppercase tracking-wide">
                {SOCIAL_LINKS.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="text-white">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="flex flex-col items-center py-8 text-xs uppercase">
            <div className="text-[10px] text-neutral-600">
              MADE WITH &lt;3 BY:{" "}
              Jinxuan
              {" "} | Thanks to <a href="https://hacktheburgh.com" className="underline">Hack The Burgh</a> for kindly letting us adapt their website design and code.
            </div>
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
);

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="pointer-events-auto fixed top-0 inset-x-0 z-50 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 px-4 py-3 text-center text-sm font-medium text-white shadow-lg border-b border-blue-400/40 sm:text-base">
        <span className="font-semibold tracking-wide text-white">
          Looking for BioHackathon 2027?
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm">
          <a
            href="https://eidynbio.com/"
            target="_blank"
            className="inline-flex items-center gap-1 rounded-full bg-white px-3.5 py-1 font-bold text-blue-950 shadow transition-all hover:bg-blue-50 hover:scale-105"
          >
            BioHackathon 2027 →
          </a>
          <a
            href="https://eidynbio.com/hackathon/2026/"
            target="_blank"
            className="inline-flex items-center gap-1 rounded-full bg-blue-900/70 border border-white/30 px-3.5 py-1 font-medium text-white transition-all hover:bg-blue-900 hover:scale-105"
          >
            2026 Recap
          </a>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 z-40 block grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr_auto] md:grid pt-16 sm:pt-14">
        <div
          className="col-span-3 hidden h-5 w-full backdrop-blur-sm md:block"
          aria-hidden="true"
        />
      <div
        className="hidden h-full w-5 backdrop-blur-sm md:block"
        aria-hidden="true"
      />

      <div className="flex h-full w-full flex-col rounded-lg md:border md:border-gray-200">
        <nav className="pointer-events-auto relative flex h-14 w-full items-center justify-between rounded-t-lg border-b border-gray-200 bg-white px-2 md:px-0 md:pl-14">
          {mounted ? (
            <MobileDrawer
              open={mobileOpen}
              onOpenChange={setMobileOpen}
            />
          ) : (
            <div className="flex h-full items-center px-4">
              <button
                type="button"
                aria-label="Open menu"
                className="-ml-1 block cursor-pointer lg:hidden"
                disabled
              >
                <Menu className="h-6 w-6 text-black" />
              </button>
            </div>
          )}

          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-4 px-4 lg:block">
            <NavLinks />
          </div>
        </nav>

        <div
          className="hidden h-full w-14 border-r border-gray-200 bg-white md:block"
          aria-hidden="true"
        />
        <div
          className="hidden h-14 w-full rounded-b-lg border-t border-gray-200 bg-white md:block"
          aria-hidden="true"
        />
      </div>

      <div
        className="hidden h-5 w-5 backdrop-blur-sm md:block"
        aria-hidden="true"
      />

      <div
        className="col-span-3 hidden h-5 w-full backdrop-blur-sm md:block"
        aria-hidden="true"
      />
    </div>
    </>
  );
}
