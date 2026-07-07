"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Shield,
  Menu,
  ChevronDown,
  FileSearch,
  ShieldCheck,
  AlertTriangle,
  Star,
  Users,
  BookOpen,
  Briefcase,
  Wrench,
  Map,
} from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Data types                                 */
/* -------------------------------------------------------------------------- */

interface NavChild {
  label: string;
  href: string;
  disabled?: boolean;
  disabledLabel?: string;
  badge?: string;
  icon?: React.ReactNode;
}

interface NavItem {
  label: string;
  href?: string;
  disabled?: boolean;
  disabledLabel?: string;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  {
    label: "Features",
    children: [
      {
        label: "AI RFP Analyzer",
        href: "/analyzer",
        icon: <FileSearch className="h-4 w-4" />,
      },
      {
        label: "Compliance Checklist",
        href: "/analyzer#compliance",
        icon: <ShieldCheck className="h-4 w-4" />,
      },
      {
        label: "Risk Assessment",
        href: "/analyzer#risk",
        icon: <AlertTriangle className="h-4 w-4" />,
      },
      {
        label: "Bid Readiness Score",
        href: "/analyzer#recommendation",
        icon: <Star className="h-4 w-4" />,
      },
      {
        label: "Team Collaboration",
        href: "/analyzer#team",
        icon: <Users className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Resources",
    children: [
      {
        label: "Blog",
        href: "/blog",
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        label: "Case Studies",
        href: "/case-studies",
        icon: <Briefcase className="h-4 w-4" />,
      },
      {
        label: "Free RFP Analyzer",
        href: "/free-tool",
        icon: <Wrench className="h-4 w-4" />,
        badge: "Free",
      },
      {
        label: "GovCon Guides",
        href: "/resources",
        icon: <Map className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "About",
    href: "/about",
  },
];

/* -------------------------------------------------------------------------- */
/*                          Desktop Dropdown Trigger                          */
/* -------------------------------------------------------------------------- */

function DesktopDropdown({
  item,
  isActive,
  scrolled,
}: {
  item: NavItem;
  isActive: boolean;
  scrolled: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }, []);

  if (!item.children) return null;

  const childActive = item.children.some((c) => pathname === c.href);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          const related = e.relatedTarget as HTMLElement | null;
          if (!e.currentTarget.parentElement?.contains(related)) {
            setOpen(false);
          }
        }}
        className={cn(
          "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors outline-none min-h-[44px]",
          childActive || isActive
            ? scrolled
              ? "bg-br-primary/8 text-br-primary"
              : "bg-white/15 text-white"
            : scrolled
              ? "text-br-text-secondary hover:bg-br-hover hover:text-br-dark"
              : "text-white/90 hover:bg-white/10 hover:text-white"
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "absolute left-1/2 top-full -translate-x-1/2 pt-2 z-50",
          "opacity-0 invisible translate-y-1",
          "transition-all duration-200 ease-out",
          open && "opacity-100 visible translate-y-0"
        )}
        role="menu"
        aria-label={item.label}
      >
        <div className="w-64 rounded-xl border border-br-border bg-br-surface/95 backdrop-blur-xl shadow-br-xl py-2 overflow-hidden">
          {item.children.map((child) => (
            <Link
              key={child.label}
              href={child.disabled ? "#" : child.href!}
              onClick={(e) => {
                if (child.disabled) {
                  e.preventDefault();
                  return;
                }
                setOpen(false);
              }}
              role="menuitem"
              aria-disabled={child.disabled}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                child.disabled
                  ? "text-br-text-secondary/50 cursor-not-allowed"
                  : pathname === child.href
                    ? "bg-br-primary/8 text-br-primary"
                    : "text-br-dark hover:bg-br-hover hover:text-br-primary"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  child.disabled
                    ? "bg-br-light text-br-text-secondary/40"
                    : pathname === child.href
                      ? "bg-br-secondary/15 text-br-secondary"
                      : "bg-br-light text-br-text-secondary"
                )}
              >
                {child.icon}
              </span>
              <span className="flex-1">{child.label}</span>
              {child.badge && (
                <Badge className="bg-br-accent/15 text-br-accent border-0 text-[10px] px-1.5 py-0">
                  {child.badge}
                </Badge>
              )}
              {child.disabled && child.disabledLabel && (
                <span className="text-[10px] text-br-text-secondary/40">
                  {child.disabledLabel}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           Desktop Nav Links                                */
/* -------------------------------------------------------------------------- */

function DesktopNav({ scrolled }: { scrolled: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {navItems.map((item) => {
        if (item.children) {
          const isActive = item.children.some((c) => pathname === c.href);
          return (
            <DesktopDropdown key={item.label} item={item} isActive={isActive} scrolled={scrolled} />
          );
        }

        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.disabled ? "#" : item.href!}
            onClick={(e) => {
              if (item.disabled) e.preventDefault();
            }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center",
              item.disabled
                ? scrolled
                  ? "text-br-text-secondary/50 cursor-not-allowed"
                  : "text-white/50 cursor-not-allowed"
                : isActive
                  ? scrolled
                    ? "bg-br-primary/8 text-br-primary"
                    : "bg-white/15 text-white"
                  : scrolled
                    ? "text-br-text-secondary hover:bg-br-hover hover:text-br-dark"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
            )}
            title={item.disabled ? item.disabledLabel : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*                          Mobile Collapsible Item                           */
/* -------------------------------------------------------------------------- */

function MobileCollapsible({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const childActive = item.children?.some((c) => pathname === c.href);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between px-1 py-2 text-sm font-medium transition-colors rounded-lg min-h-[44px]",
            childActive
              ? "text-br-primary"
              : "text-br-dark hover:bg-br-hover hover:text-br-primary"
          )}
        >
          <span>{item.label}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-3 mt-1 flex flex-col gap-1 border-l border-br-border pl-3">
        {item.children!.map((child) => (
          <Link
            key={child.label}
            href={child.disabled ? "#" : child.href!}
            onClick={(e) => {
              if (child.disabled) {
                e.preventDefault();
                return;
              }
              onNavigate?.();
            }}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors min-h-[44px]",
              child.disabled
                ? "text-br-text-secondary/50 cursor-not-allowed"
                : pathname === child.href
                  ? "bg-br-primary/8 text-br-primary"
                  : "text-br-dark hover:bg-br-hover hover:text-br-primary"
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                child.disabled
                  ? "bg-br-light text-br-text-secondary/40"
                  : pathname === child.href
                    ? "bg-br-secondary/15 text-br-secondary"
                    : "bg-br-light text-br-text-secondary"
              )}
            >
              {child.icon}
            </span>
            <span className="flex-1">{child.label}</span>
            {child.badge && (
              <Badge className="bg-br-accent/15 text-br-accent border-0 text-[10px] px-1.5 py-0">
                {child.badge}
              </Badge>
            )}
            {child.disabled && child.disabledLabel && (
              <span className="text-[10px] text-br-text-secondary/40">
                {child.disabledLabel}
              </span>
            )}
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

/* -------------------------------------------------------------------------- */
/*                           Mobile Nav Links                                 */
/* -------------------------------------------------------------------------- */

function MobileNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        if (item.children) {
          return (
            <MobileCollapsible
              key={item.label}
              item={item}
              onNavigate={onNavigate}
            />
          );
        }

        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.disabled ? "#" : item.href!}
            onClick={(e) => {
              if (item.disabled) {
                e.preventDefault();
                return;
              }
              onNavigate?.();
            }}
            className={cn(
              "px-1 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center",
              item.disabled
                ? "text-br-text-secondary/50 cursor-not-allowed"
                : isActive
                  ? "bg-br-primary/8 text-br-primary"
                  : "text-br-dark hover:bg-br-hover hover:text-br-primary"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*                         User Menu (replaces UserButton)                      */
/* -------------------------------------------------------------------------- */

function UserMenu({ userName, userEmail, scrolled }: { userName: string; userEmail: string; scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      setOpen(false);
    }
  }, [open]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm min-h-[44px]",
          scrolled
            ? "bg-br-light hover:bg-br-border text-br-dark"
            : "bg-white/10 hover:bg-white/20 text-white"
        )}
      >
        <div className="w-7 h-7 rounded-full bg-br-secondary flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="hidden sm:inline max-w-[120px] truncate">{userName || userEmail}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
            tabIndex={-1}
            aria-hidden="true"
          />
          <div
            role="menu"
            aria-orientation="vertical"
            className="absolute right-0 mt-2 w-56 rounded-lg border border-br-border bg-br-surface/95 backdrop-blur-xl shadow-br-xl py-1 z-50"
          >
            <div className="px-4 py-2 border-b border-br-border">
              <p className="text-sm font-medium text-br-dark truncate">{userName || "User"}</p>
              <p className="text-xs text-br-text-secondary truncate">{userEmail}</p>
            </div>
            <Link
              href="/dashboard"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-br-dark hover:bg-br-hover hover:text-br-primary min-h-[44px]"
            >
              Dashboard
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } });
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-br-dark hover:bg-br-hover hover:text-br-primary w-full text-left min-h-[44px]"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main Navbar                                   */
/* -------------------------------------------------------------------------- */

export function Navbar() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, isPending } = useSession();

  const isSignedIn = !!session?.user;
  const userName = session?.user?.name || "";
  const userEmail = session?.user?.email || "";

  // Scroll detection: transparent at top, solid white on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll(); // Check initial position
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,box-shadow] duration-300",
        scrolled
          ? "bg-br-surface shadow-br-md border-br-border"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-lg bg-br-secondary flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span
              className={cn(
                "text-xl font-bold tracking-tight font-heading transition-colors duration-300",
                scrolled ? "text-br-dark" : "text-white"
              )}
            >
              BidRank<span className="text-br-accent">.pro</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <DesktopNav scrolled={scrolled} />

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2.5">
            {!isPending && !isSignedIn ? (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost">
                    Log In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button>
                    Get Started
                  </Button>
                </Link>
                <Link href="/free-tool">
                  <Button variant="ghost">
                    Analyze Free
                  </Button>
                </Link>
              </>
            ) : isSignedIn ? (
              <>
                <Link href="/free-tool">
                  <Button variant="ghost" size="sm">
                    Analyze Free
                  </Button>
                </Link>
                <UserMenu userName={userName} userEmail={userEmail} scrolled={scrolled} />
              </>
            ) : null}
          </div>

          {/* Mobile Menu */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors",
                  scrolled ? "text-br-dark hover:text-br-primary" : "text-white hover:text-white/80"
                )}
              >
                <Menu className="w-6 h-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 bg-br-surface border-br-border"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">Site navigation links</SheetDescription>
              <div className="flex flex-col gap-6 mt-8">
                <Link
                  href="/"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-br-secondary flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold text-br-dark tracking-tight font-heading">
                    BidRank<span className="text-br-accent">.pro</span>
                  </span>
                </Link>

                <MobileNav onNavigate={() => setSheetOpen(false)} />

                <div className="border-t border-br-border pt-4 flex flex-col gap-3">
                  {!isPending && !isSignedIn ? (
                    <>
                      <Link
                        href="/sign-in"
                        onClick={() => setSheetOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="justify-start w-full"
                        >
                          Log In
                        </Button>
                      </Link>
                      <Link
                        href="/sign-up"
                        onClick={() => setSheetOpen(false)}
                      >
                        <Button className="w-full">
                          Get Started
                        </Button>
                      </Link>
                      <Link
                        href="/free-tool"
                        onClick={() => setSheetOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full"
                        >
                          Analyze Free
                        </Button>
                      </Link>
                    </>
                  ) : isSignedIn ? (
                    <>
                      <Link
                        href="/free-tool"
                        onClick={() => setSheetOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full"
                        >
                          Analyze Free
                        </Button>
                      </Link>
                      <div className="flex items-center gap-3 px-1">
                        <UserMenu userName={userName} userEmail={userEmail} scrolled={true} />
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}