import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import BrandMark from "./BrandMark";
import DefaultResumeDownload from "./DefaultResumeDownload";
import styles from "./PortfolioHome.module.scss";
import {
  careerStart,
  formatCareerTenure,
  getCareerTenure,
  getDisplayPeriod,
  getEmployerAward,
  getEmployerMarketFlags,
  getEmployerMetrics,
  getEmployerPresentation,
  getRoundedCareerYears,
  homepageCopy,
  impactMetrics,
  metricContext,
  navigation,
  orderedExperience,
  personalProject,
  portfolioConfig,
  resumeData,
  skillGroups,
} from "./content";
import type { EmployerPresentation } from "./content";
import usePortfolioMotion from "./usePortfolioMotion";

const CompanyBrand = ({
  presentation,
}: {
  presentation: EmployerPresentation;
}) => {
  const { brand } = presentation;

  if (brand.kind === "logo-pair") {
    return (
      <>
        <div
          className={`${styles.brandMelt} ${styles.logoPairMelt}`}
          aria-hidden="true"
        >
          <Image
            src={brand.primaryLogo.src}
            width={brand.primaryLogo.width}
            height={brand.primaryLogo.height}
            alt=""
            className={styles.brandMeltPrimary}
          />
          <Image
            src={brand.secondaryLogo.src}
            width={brand.secondaryLogo.width}
            height={brand.secondaryLogo.height}
            alt=""
            className={styles.brandMeltSecondary}
          />
        </div>
        <div
          className={styles.openTableLockup}
          role="img"
          aria-label={brand.ariaLabel}
        >
          <Image
            src={brand.primaryLogo.src}
            width={brand.primaryLogo.width}
            height={brand.primaryLogo.height}
            alt={brand.primaryLogo.alt}
            className={styles.openTableLogo}
          />
          <span aria-hidden="true" />
          <Image
            src={brand.secondaryLogo.src}
            width={brand.secondaryLogo.width}
            height={brand.secondaryLogo.height}
            alt={brand.secondaryLogo.alt}
            className={styles.bookingLogo}
          />
        </div>
      </>
    );
  }

  if (brand.kind === "client-lockup") {
    return (
      <>
        <div
          className={`${styles.brandMelt} ${styles.clientBrandMelt}`}
          aria-hidden="true"
        >
          <Image
            src={brand.clientLogo.src}
            width={brand.clientLogo.width}
            height={brand.clientLogo.height}
            alt=""
            className={styles.brandMeltClient}
          />
        </div>
        <div
          className={styles.qburstLockup}
          role="img"
          aria-label={brand.ariaLabel}
        >
          <strong>{brand.employerWordmark}</strong>
          <span>{brand.qualifier}</span>
          <Image
            src={brand.clientLogo.src}
            width={brand.clientLogo.width}
            height={brand.clientLogo.height}
            alt={brand.clientLogo.alt}
            className={styles.uniqloLogo}
          />
          <span className={styles.uniqloName}>{brand.clientName}</span>
        </div>
      </>
    );
  }

  return (
    <div
      className={styles.qburstLockup}
      role="img"
      aria-label={brand.ariaLabel}
    >
      <strong>{brand.label}</strong>
    </div>
  );
};

const ExperienceCardBrandAtmosphere = ({
  presentation,
}: {
  presentation: EmployerPresentation;
}) => {
  const { brand } = presentation;

  if (brand.kind === "logo-pair") {
    return (
      <div className={styles.experienceCardBrandAtmosphere} aria-hidden="true">
        <span
          className={`${styles.experienceCardBrandGhost} ${styles.openTableExperienceGhost}`}
        >
          <Image
            src={brand.primaryLogo.src}
            width={brand.primaryLogo.width}
            height={brand.primaryLogo.height}
            alt=""
            draggable={false}
          />
        </span>
        <span
          className={`${styles.experienceCardBrandGhost} ${styles.bookingExperienceGhost}`}
        >
          <Image
            src={brand.secondaryLogo.src}
            width={brand.secondaryLogo.width}
            height={brand.secondaryLogo.height}
            alt=""
            draggable={false}
          />
        </span>
      </div>
    );
  }

  if (brand.kind === "client-lockup") {
    return (
      <div className={styles.experienceCardBrandAtmosphere} aria-hidden="true">
        <span
          className={`${styles.experienceCardBrandGhost} ${styles.uniqloExperienceGhost}`}
        >
          <Image
            src={brand.clientLogo.src}
            width={brand.clientLogo.width}
            height={brand.clientLogo.height}
            alt=""
            draggable={false}
          />
        </span>
      </div>
    );
  }

  return null;
};

const ExperienceRoleBrandAtmosphere = ({
  presentation,
}: {
  presentation: EmployerPresentation;
}) => {
  const { brand } = presentation;

  if (brand.kind === "logo-pair") {
    return (
      <div className={styles.roleBrandAtmosphere} aria-hidden="true">
        <span
          className={`${styles.roleBrandGhost} ${styles.openTableRoleBrandGhost}`}
        >
          <Image
            src={brand.primaryLogo.src}
            width={brand.primaryLogo.width}
            height={brand.primaryLogo.height}
            alt=""
            draggable={false}
          />
        </span>
        <span
          className={`${styles.roleBrandGhost} ${styles.bookingRoleBrandGhost}`}
        >
          <Image
            src={brand.secondaryLogo.src}
            width={brand.secondaryLogo.width}
            height={brand.secondaryLogo.height}
            alt=""
            draggable={false}
          />
        </span>
      </div>
    );
  }

  if (brand.kind === "client-lockup") {
    return (
      <div className={styles.roleBrandAtmosphere} aria-hidden="true">
        <span
          className={`${styles.roleBrandGhost} ${styles.uniqloRoleBrandGhost}`}
        >
          <Image
            src={brand.clientLogo.src}
            width={brand.clientLogo.width}
            height={brand.clientLogo.height}
            alt=""
            draggable={false}
          />
        </span>
      </div>
    );
  }

  return null;
};

const ExperienceDomainBackdrop = ({
  kind,
}: {
  kind: EmployerPresentation["domain"]["kind"];
}) => {
  if (kind === "hospitality-platform") {
    return (
      <svg
        className={`${styles.domainBackdrop} ${styles.hospitalityBackdrop}`}
        viewBox="0 0 960 520"
        aria-hidden="true"
        focusable="false"
      >
        <g className={styles.domainBackdropPrimary}>
          <rect x="86" y="72" width="430" height="304" rx="30" />
          <path d="M86 176h430M236 72v304M390 72v304" />
          <circle cx="158" cy="126" r="35" />
          <path d="M158 72v18M158 162v18M104 126h18M194 126h18" />
          <circle cx="314" cy="270" r="46" />
          <path d="M314 199v22M314 319v22M243 270h22M363 270h22" />
          <circle cx="452" cy="126" r="28" />
          <path d="M452 79v18M452 155v18M405 126h18M481 126h18" />
        </g>
        <g className={styles.domainBackdropSecondary}>
          <rect x="610" y="82" width="210" height="286" rx="28" />
          <path d="M610 148h210M655 114h22M696 114h22M737 114h22" />
          <path d="M648 199h34v34h-34zM700 199h34v34h-34zM752 199h34v34h-34zM648 251h34v34h-34zM700 251h34v34h-34zM752 251h34v34h-34z" />
          <path d="M516 270c52 0 53-102 98-102M516 307c61 0 91 94 148 94h106" />
          <circle cx="516" cy="270" r="7" />
          <circle cx="614" cy="168" r="7" />
          <circle cx="664" cy="401" r="7" />
          <circle cx="770" cy="401" r="7" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      className={`${styles.domainBackdrop} ${styles.commerceBackdrop}`}
      viewBox="0 0 960 520"
      aria-hidden="true"
      focusable="false"
    >
      <g className={styles.domainBackdropPrimary}>
        <rect x="88" y="72" width="174" height="220" rx="24" />
        <rect x="294" y="72" width="174" height="220" rx="24" />
        <path d="M116 104h118v112H116zM322 104h118v112H322zM116 244h76M322 244h76" />
        <path d="M571 124h171l-18 141H590zM612 124c0-47 19-71 44-71s44 24 44 71" />
        <circle cx="614" cy="303" r="13" />
        <circle cx="704" cy="303" r="13" />
      </g>
      <g className={styles.domainBackdropSecondary}>
        <path d="M124 394c124-70 246-64 352-6 112 62 217 76 356-14" />
        <path d="M167 400c47-124 169-186 289-170 105 13 194 91 239 190" />
        <circle cx="167" cy="400" r="8" />
        <circle cx="348" cy="250" r="8" />
        <circle cx="516" cy="265" r="8" />
        <circle cx="695" cy="420" r="8" />
        <circle cx="832" cy="374" r="8" />
        <path d="m780 116 42 17-18 42-42-17zM818 87l23 10M746 190l23 10" />
      </g>
    </svg>
  );
};

type ThemeMode = "light" | "dark";

type PointerSample = {
  clientX: number;
  clientY: number;
  target: HTMLElement;
};

const PortfolioHome = () => {
  const [careerTenure, setCareerTenure] = useState(() =>
    getCareerTenure(new Date()),
  );
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(
    () => new Set(),
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSkillGroups, setOpenSkillGroups] = useState<Set<string>>(
    () => new Set(homepageCopy.mobile.initiallyOpenSkillGroups),
  );
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [themeReady, setThemeReady] = useState(false);
  const desktopNavRef = useRef<HTMLElement>(null);
  const heroFrame = useRef<number | null>(null);
  const heroPointerSample = useRef<PointerSample | null>(null);
  const interactivePointerRef = useRef(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const projectFrame = useRef<number | null>(null);
  const projectPointerSample = useRef<PointerSample | null>(null);
  const reducedMotionRef = useRef(false);
  const siteRef = useRef<HTMLDivElement>(null);
  const { about, contact, experience, footer, header, hero, skills, work } =
    homepageCopy;

  usePortfolioMotion(siteRef);

  useEffect(() => {
    const interactivePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncInteractionPreferences = () => {
      interactivePointerRef.current = interactivePointer.matches;
      reducedMotionRef.current = reducedMotion.matches;
    };

    syncInteractionPreferences();
    interactivePointer.addEventListener("change", syncInteractionPreferences);
    reducedMotion.addEventListener("change", syncInteractionPreferences);

    return () => {
      interactivePointer.removeEventListener(
        "change",
        syncInteractionPreferences,
      );
      reducedMotion.removeEventListener("change", syncInteractionPreferences);
    };
  }, []);

  useEffect(() => {
    const refreshCareerTenure = () =>
      setCareerTenure(getCareerTenure(new Date()));
    refreshCareerTenure();

    const refreshInterval = window.setInterval(
      refreshCareerTenure,
      6 * 60 * 60 * 1000,
    );
    return () => window.clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    let savedTheme: string | null = null;
    try {
      savedTheme = window.localStorage.getItem("portfolio-theme");
    } catch (_error) {
      // System preference remains available when browser storage is blocked.
    }
    const bootstrappedTheme = document.documentElement.getAttribute(
      "data-portfolio-theme",
    );
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const resolvedTheme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : bootstrappedTheme === "dark" || bootstrappedTheme === "light"
          ? bootstrappedTheme
          : systemTheme;
    setTheme(resolvedTheme);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return undefined;
    const pageColor = theme === "dark" ? "#080808" : "#fbfaf7";
    document.documentElement.setAttribute("data-portfolio-theme", theme);
    document.documentElement.style.backgroundColor = pageColor;
    document.documentElement.style.colorScheme = theme;
    document.body.style.backgroundColor = pageColor;
    document
      .querySelector<HTMLMetaElement>("#portfolio-theme-color")
      ?.setAttribute("content", pageColor);

    return () => {
      document.documentElement.style.removeProperty("background-color");
      document.documentElement.style.removeProperty("color-scheme");
      document.body.style.removeProperty("background-color");
    };
  }, [theme, themeReady]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    };
    const desktopBreakpoint = window.matchMedia("(min-width: 761px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (!event.matches || !menuOpen) return;
      const focusWasInMenu = mobileMenuRef.current?.contains(
        document.activeElement,
      );
      setMenuOpen(false);
      if (focusWasInMenu) {
        window.requestAnimationFrame(() => {
          desktopNavRef.current
            ?.querySelector<HTMLAnchorElement>("a")
            ?.focus({ preventScroll: true });
        });
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    desktopBreakpoint.addEventListener("change", closeOnDesktop);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      desktopBreakpoint.removeEventListener("change", closeOnDesktop);
      if (heroFrame.current !== null) {
        window.cancelAnimationFrame(heroFrame.current);
        heroFrame.current = null;
      }
      if (projectFrame.current !== null) {
        window.cancelAnimationFrame(projectFrame.current);
        projectFrame.current = null;
      }
      heroPointerSample.current = null;
      projectPointerSample.current = null;
    };
  }, [menuOpen]);

  const motionIsSuppressed = () =>
    document.hidden ||
    siteRef.current?.dataset.motion === "reduced" ||
    siteRef.current?.hasAttribute("data-inactive") ||
    reducedMotionRef.current;

  const toggleTheme = () => {
    setTheme((current) => {
      const nextTheme = current === "light" ? "dark" : "light";
      try {
        window.localStorage.setItem("portfolio-theme", nextTheme);
      } catch (_error) {
        // Theme switching should still work for the current visit.
      }
      return nextTheme;
    });
  };

  const toggleRole = (roleId: string) => {
    setExpandedRoles((current) => {
      const next = new Set(current);
      if (next.has(roleId)) {
        next.delete(roleId);
      } else {
        next.add(roleId);
      }
      return next;
    });
  };

  const toggleSkillGroup = (groupId: string) => {
    setOpenSkillGroups((current) => {
      const next = new Set(current);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const moveHeroLight = (event: React.PointerEvent<HTMLElement>) => {
    if (motionIsSuppressed() || !interactivePointerRef.current) {
      return;
    }

    heroPointerSample.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      target: event.currentTarget,
    };
    if (heroFrame.current !== null) return;

    heroFrame.current = window.requestAnimationFrame(() => {
      heroFrame.current = null;
      const sample = heroPointerSample.current;
      heroPointerSample.current = null;
      if (!sample || motionIsSuppressed()) return;

      const bounds = sample.target.getBoundingClientRect();
      sample.target.style.setProperty(
        "--pointer-x",
        `${sample.clientX - bounds.left}px`,
      );
      sample.target.style.setProperty(
        "--pointer-y",
        `${sample.clientY - bounds.top}px`,
      );
    });
  };

  const moveProject = (event: React.PointerEvent<HTMLElement>) => {
    if (motionIsSuppressed() || !interactivePointerRef.current) {
      return;
    }

    projectPointerSample.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      target: event.currentTarget,
    };
    if (projectFrame.current !== null) return;

    projectFrame.current = window.requestAnimationFrame(() => {
      projectFrame.current = null;
      const sample = projectPointerSample.current;
      projectPointerSample.current = null;
      if (!sample || motionIsSuppressed()) return;

      const bounds = sample.target.getBoundingClientRect();
      const x = (sample.clientX - bounds.left) / bounds.width;
      const y = (sample.clientY - bounds.top) / bounds.height;
      sample.target.style.setProperty("--spot-x", `${x * 100}%`);
      sample.target.style.setProperty("--spot-y", `${y * 100}%`);
      sample.target.style.setProperty("--tilt-x", `${(0.5 - y) * 1.5}deg`);
      sample.target.style.setProperty("--tilt-y", `${(x - 0.5) * 1.8}deg`);
    });
  };

  const resetProject = (event: React.PointerEvent<HTMLElement>) => {
    projectPointerSample.current = null;
    if (projectFrame.current !== null) {
      window.cancelAnimationFrame(projectFrame.current);
      projectFrame.current = null;
    }
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div
      className={`${styles.siteShell} ${theme === "dark" ? styles.darkMode : ""}`}
      data-theme={theme}
      ref={siteRef}
    >
      <div
        className={styles.pageAmbient}
        data-scroll-ambient
        aria-hidden="true"
      />
      <a className={styles.skipLink} href="#main-content">
        {header.skipLink}
      </a>

      <div className={styles.scrollRail} aria-hidden="true">
        <span data-scroll-rail />
      </div>

      <header className={styles.header}>
        <a href="#top" className={styles.wordmark}>
          <BrandMark decorative className={styles.logoMark} />
          <span className={styles.wordmarkCopy}>
            <strong>{portfolioConfig.identity.displayName}</strong>
            <small>{portfolioConfig.identity.jobTitle}</small>
          </span>
          <span className={styles.visuallyHidden}>Home</span>
        </a>

        <nav
          className={styles.desktopNav}
          aria-label={header.primaryNavigationLabel}
          ref={desktopNavRef}
        >
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.headerControls}>
          <button
            type="button"
            className={styles.themeButton}
            data-theme-active={theme}
            data-theme-ready={themeReady ? "true" : "false"}
            aria-label="Dark mode"
            aria-pressed={themeReady ? theme === "dark" : undefined}
            title={
              themeReady
                ? `Switch to ${theme === "light" ? "dark" : "light"} mode`
                : undefined
            }
            onClick={toggleTheme}
          >
            <span className={styles.themeGlyph} aria-hidden="true">
              <svg viewBox="0 0 36 36" focusable="false">
                <defs>
                  <mask
                    id="portfolio-theme-disc"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                  >
                    <rect width="36" height="36" fill="white" />
                    <circle
                      className={styles.moonCutout}
                      cx="18"
                      cy="18"
                      r="8.2"
                      fill="black"
                    />
                  </mask>
                </defs>
                <g className={styles.sunRays}>
                  <path d="M18 4.8v3.4" />
                  <path d="M18 27.8v3.4" />
                  <path d="m8.7 8.7 2.4 2.4" />
                  <path d="m24.9 24.9 2.4 2.4" />
                  <path d="M4.8 18h3.4" />
                  <path d="M27.8 18h3.4" />
                  <path d="m8.7 27.3 2.4-2.4" />
                  <path d="m24.9 11.1 2.4-2.4" />
                </g>
                <circle
                  className={styles.celestialDisc}
                  cx="18"
                  cy="18"
                  r="7"
                  mask="url(#portfolio-theme-disc)"
                />
              </svg>
            </span>
          </button>
          <button
            type="button"
            className={styles.menuButton}
            ref={menuButtonRef}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
        id="mobile-navigation"
        ref={mobileMenuRef}
      >
        <nav aria-label={header.mobileNavigationLabel}>
          {navigation.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => {
                setMenuOpen(false);
                window.requestAnimationFrame(() =>
                  menuButtonRef.current?.focus({ preventScroll: true }),
                );
              }}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span>0{index + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <main id="main-content" tabIndex={-1}>
        <section
          className={styles.hero}
          id="top"
          onPointerMove={moveHeroLight}
          data-scroll-scene
        >
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span aria-hidden="true" />
                {portfolioConfig.identity.fullName} ·{" "}
                {portfolioConfig.identity.jobTitle}
              </p>
              <h1>
                {hero.headlineLead}
                <em> {hero.headlineEmphasis}</em>
              </h1>
              <p className={styles.heroIntro}>
                <span className={styles.desktopCopy}>{hero.intro}</span>
                <span className={styles.mobileCopy}>
                  {homepageCopy.mobile.heroIntro}
                </span>
              </p>

              <div className={styles.heroActions}>
                <a className={styles.primaryAction} href="#experience">
                  {hero.primaryActionLabel} <span aria-hidden="true">↘</span>
                </a>
                <DefaultResumeDownload
                  className={styles.secondaryAction}
                  compact
                />
              </div>
            </div>

            <div
              className={styles.heroStage}
              aria-label={`Portrait of ${portfolioConfig.identity.displayName}`}
            >
              <div className={styles.portraitFrame}>
                <Image
                  src={portfolioConfig.identity.portrait.src}
                  width={portfolioConfig.identity.portrait.width}
                  height={portfolioConfig.identity.portrait.height}
                  sizes="(max-width: 440px) 84vw, (max-width: 760px) 24rem, (max-width: 1200px) 33rem, 30rem"
                  quality={68}
                  priority
                  alt={portfolioConfig.identity.portrait.alt}
                  className={styles.portrait}
                />
              </div>
              <div className={styles.portraitIndex} aria-hidden="true">
                <span>{hero.portraitIndex}</span>
                <i />
              </div>
              <div className={styles.profileCard}>
                <span>{hero.profileLocationLabel}</span>
                <strong>{hero.profileStatement}</strong>
              </div>
              <div className={styles.experienceBadge} aria-hidden="true">
                <strong suppressHydrationWarning>
                  {getRoundedCareerYears(careerTenure)}
                </strong>
                <span suppressHydrationWarning>
                  {getRoundedCareerYears(careerTenure) === 1 ? "year" : "years"}{" "}
                  {hero.experienceBadgeSuffix}
                </span>
              </div>
            </div>
          </div>

          <a className={styles.scrollCue} href="#experience">
            <span>{hero.scrollCueLabel}</span>
            <i aria-hidden="true">↓</i>
          </a>
        </section>

        <section
          className={styles.metricGrid}
          aria-label={homepageCopy.impactAriaLabel}
          data-reveal="metrics"
          data-scroll-scene
        >
          {impactMetrics.map((metric, index) => (
            <article key={metric.id}>
              <span>0{index + 1}</span>
              <strong>{metric.value}</strong>
              <p>{metric.label}</p>
              <small>{metricContext[index]}</small>
            </article>
          ))}
        </section>

        <section
          className={styles.experienceSection}
          id="experience"
          data-scroll-scene
        >
          <div className={styles.experienceBackdrop} aria-hidden="true">
            <span />
            <i />
            <b />
          </div>
          <div className={styles.experienceIntro} data-reveal="headline">
            <p className={styles.sectionLabel}>{experience.label}</p>
            <h2>
              <span className={styles.desktopCopy}>{experience.heading}</span>
              <span className={styles.mobileCopy}>
                {homepageCopy.mobile.experienceHeading}
              </span>
            </h2>
            <p>
              <span className={styles.desktopCopy}>
                {experience.tenurePrefix}{" "}
                <span suppressHydrationWarning>
                  {formatCareerTenure(careerTenure)}
                </span>
                , {experience.tenureSuffix}
              </span>
              <span className={styles.mobileCopy}>
                <span suppressHydrationWarning>
                  {formatCareerTenure(careerTenure)}
                </span>{" "}
                {homepageCopy.mobile.experienceIntroSuffix}
              </span>
            </p>
          </div>

          <div className={styles.experienceLayout}>
            <aside className={styles.experienceThread} aria-hidden="true">
              <span>{experience.timelineNowLabel}</span>
              <i />
              <span>{careerStart.year}</span>
            </aside>

            <div className={styles.experienceDeck}>
              {orderedExperience.map((company, companyIndex) => {
                const presentation = getEmployerPresentation(company.company);
                if (!presentation) return null;
                const companyPeriod = getDisplayPeriod(company.companyPeriod);
                const award = getEmployerAward(company.company);
                const employerMetrics = getEmployerMetrics(company.company);
                const companyId = `${presentation.id}-company`;
                const marketFlags = getEmployerMarketFlags(company.company);

                return (
                  <article
                    className={styles.experienceCard}
                    key={presentation.id}
                    aria-labelledby={companyId}
                    data-company={presentation.id}
                    data-reveal={
                      companyIndex % 2 === 0 ? "card-left" : "card-right"
                    }
                  >
                    <div className={styles.caseFileLabel} aria-hidden="true">
                      {experience.caseLabel}
                    </div>
                    <span
                      className={styles.companyYearWatermark}
                      aria-hidden="true"
                    >
                      {companyPeriod.startYear}
                    </span>
                    <header className={styles.companyHeader}>
                      <h3 className={styles.visuallyHidden} id={companyId}>
                        {company.company}
                      </h3>
                      <CompanyBrand presentation={presentation} />
                      <div className={styles.companyMeta}>
                        <span>{experience.tenureLabel}</span>
                        <p>
                          <span className={styles.visuallyHidden}>From </span>
                          <strong>{companyPeriod.start}</strong>
                          <i aria-hidden="true">→</i>
                          <span className={styles.visuallyHidden}> to </span>
                          <strong>{companyPeriod.end}</strong>
                        </p>
                        {companyPeriod.detail && (
                          <small>{companyPeriod.detail}</small>
                        )}
                      </div>
                    </header>

                    <div className={styles.mobileEmployerContext}>
                      <Image
                        src={presentation.domain.backgroundImage.src}
                        width={presentation.domain.backgroundImage.width}
                        height={presentation.domain.backgroundImage.height}
                        alt=""
                        sizes="(max-width: 760px) calc(100vw - 2.6rem), 1px"
                        quality={64}
                        className={styles.mobileEmployerContextImage}
                      />
                      <div
                        className={styles.mobileEmployerContextFilm}
                        aria-hidden="true"
                      />
                      <div className={styles.mobileEmployerContextCopy}>
                        <span>{presentation.domain.eyebrow}</span>
                        <p>{presentation.domain.mobileStatement}</p>
                      </div>
                      <div
                        className={styles.mobileEmployerFlags}
                        role="img"
                        aria-label={`${presentation.domain.marketLabel}: ${marketFlags
                          .map((flag) => flag.label)
                          .join(", ")}`}
                      >
                        {marketFlags.map((flag) => (
                          <span
                            key={flag.code}
                            title={flag.label}
                            aria-hidden="true"
                          >
                            {flag.emoji}
                          </span>
                        ))}
                      </div>
                    </div>

                    {award && (
                      <section
                        className={styles.awardHighlight}
                        aria-labelledby={`${companyId}-award-title`}
                      >
                        <span className={styles.awardMark} aria-hidden="true">
                          <svg viewBox="0 0 48 48" focusable="false">
                            <circle cx="24" cy="24" r="18.5" />
                            <circle cx="24" cy="24" r="13" />
                            <path d="m24 14.5 2.7 6.8 6.8 2.7-6.8 2.7-2.7 6.8-2.7-6.8-6.8-2.7 6.8-2.7 2.7-6.8Z" />
                          </svg>
                        </span>
                        <div className={styles.awardLead}>
                          <small>{award.eyebrow}</small>
                          <h4 id={`${companyId}-award-title`}>{award.title}</h4>
                        </div>
                        <ul className={styles.awardResults}>
                          {award.highlights.map((highlight) => (
                            <li key={highlight.schemaName}>
                              <b>{highlight.label}</b>
                              <span>{highlight.detail}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {employerMetrics.length > 0 && (
                      <div
                        className={styles.impactSummary}
                        aria-label={`${presentation.brand.ariaLabel} impact`}
                      >
                        {employerMetrics.map((metric) => (
                          <span key={metric.id}>
                            <strong>{metric.value}</strong>
                            {metric.label}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className={styles.roles}>
                      <div className={styles.domainStage}>
                        <Image
                          src={presentation.domain.backgroundImage.src}
                          width={presentation.domain.backgroundImage.width}
                          height={presentation.domain.backgroundImage.height}
                          alt=""
                          sizes="(max-width: 760px) calc(100vw - 2rem), (max-width: 1200px) 78vw, 960px"
                          quality={64}
                          className={styles.domainPhoto}
                        />
                        <div className={styles.domainFilm} aria-hidden="true" />
                        <ExperienceDomainBackdrop
                          kind={presentation.domain.kind}
                        />
                        <ExperienceCardBrandAtmosphere
                          presentation={presentation}
                        />
                        <div className={styles.domainCopy}>
                          <span className={styles.domainEyebrow}>
                            {presentation.domain.eyebrow}
                          </span>
                          <p>
                            <span className={styles.desktopCopy}>
                              {presentation.domain.statement}
                            </span>
                            <span className={styles.mobileCopy}>
                              {presentation.domain.mobileStatement}
                            </span>
                          </p>
                          <div
                            className={styles.domainSignalRail}
                            aria-label={presentation.domain.exposureLabel}
                          >
                            <span className={styles.domainSignalLabel}>
                              {presentation.domain.exposureLabel}
                            </span>
                            <ul>
                              {presentation.domain.exposure.map((item) => (
                                <li key={item}>
                                  <i aria-hidden="true" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div
                          className={styles.marketFlagStrip}
                          role="img"
                          aria-label={`${presentation.domain.marketLabel}: ${marketFlags
                            .map((flag) => flag.label)
                            .join(", ")}`}
                        >
                          {marketFlags.map((flag) => (
                            <span
                              className={styles.marketFlag}
                              key={flag.code}
                              title={flag.label}
                              aria-hidden="true"
                            >
                              {flag.emoji}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className={styles.roleStack}>
                        {company.roles.map((role, roleIndex) => {
                          const roleResponsibilities =
                            role.responsibilities ?? [];
                          const roleId = `${presentation.id}-role-${roleIndex}`;
                          const roleHeadingId = `${roleId}-heading`;
                          const achievementListId = `${roleId}-achievements`;
                          const isRoleExpanded = expandedRoles.has(roleId);
                          const roleDisclosureLabel = isRoleExpanded
                            ? "Hide details"
                            : "Details";
                          const displaysRoleBrand =
                            presentation.brand.kind === "client-lockup"
                              ? role.position ===
                                  presentation.brand.roleWatermarkPosition &&
                                role.period ===
                                  presentation.brand.roleWatermarkPeriod
                              : roleIndex === 0;

                          return (
                            <section
                              className={styles.role}
                              aria-labelledby={roleHeadingId}
                              key={`${presentation.id}-${role.position}-${role.period}`}
                            >
                              {displaysRoleBrand && (
                                <ExperienceRoleBrandAtmosphere
                                  presentation={presentation}
                                />
                              )}
                              <header className={styles.roleHeading}>
                                <h4 id={roleHeadingId}>{role.position}</h4>
                                <p className={styles.rolePeriod}>
                                  <span className={styles.visuallyHidden}>
                                    From{" "}
                                  </span>
                                  <span>
                                    {getDisplayPeriod(role.period).start}
                                  </span>
                                  <i aria-hidden="true">→</i>
                                  <span className={styles.visuallyHidden}>
                                    {" "}
                                    to{" "}
                                  </span>
                                  <span>
                                    {getDisplayPeriod(role.period).end}
                                  </span>
                                </p>
                                {roleResponsibilities.length > 0 && (
                                  <button
                                    type="button"
                                    className={styles.roleDisclosure}
                                    aria-controls={achievementListId}
                                    aria-expanded={isRoleExpanded}
                                    aria-label={`${roleDisclosureLabel} for ${role.position}`}
                                    onClick={() => toggleRole(roleId)}
                                  >
                                    <span>{roleDisclosureLabel}</span>
                                    <i aria-hidden="true" />
                                  </button>
                                )}
                              </header>
                              <ul
                                className={`${styles.achievementList} ${
                                  !isRoleExpanded
                                    ? styles.mobileRoleDetailsHidden
                                    : ""
                                }`}
                                aria-label={`Achievements for ${role.position}`}
                                id={achievementListId}
                              >
                                {roleResponsibilities.map((responsibility) => (
                                  <li
                                    key={`${role.position}-${responsibility}`}
                                  >
                                    <span
                                      className={styles.achievementMarker}
                                      aria-hidden="true"
                                    />
                                    <p>{responsibility}</p>
                                  </li>
                                ))}
                              </ul>
                            </section>
                          );
                        })}
                      </div>
                    </div>
                  </article>
                );
              })}

              <aside className={styles.openSourceNote} data-reveal="scale">
                <div className={styles.openSourceIdentity}>
                  <p className={styles.sectionLabel}>
                    {experience.openSourceLabel}
                  </p>
                  <h3>
                    <span>{resumeData.openSource.title}</span>
                    <small>{resumeData.openSource.subtitle}</small>
                  </h3>
                  <div
                    className={styles.ycAffiliation}
                    role="img"
                    aria-label={`${resumeData.openSource.title}, ${experience.openSourceAffiliation.name}, ${experience.openSourceAffiliation.cohort}`}
                  >
                    <svg
                      viewBox="0 0 32 32"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <rect width="32" height="32" rx="3" />
                      <path d="M7.1 6.6h4.35l4.67 8.4 4.72-8.4h4.13l-6.93 11.72v7.08h-3.88v-7.08L7.1 6.6Z" />
                    </svg>
                    <span>
                      <strong>{experience.openSourceAffiliation.name}</strong>
                      <small>{experience.openSourceAffiliation.cohort}</small>
                    </span>
                  </div>
                </div>
                <ul>
                  {resumeData.openSource.contributions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </aside>
            </div>
          </div>
        </section>

        <section className={styles.workSection} id="work" data-scroll-scene>
          <div className={styles.chessAtmosphere} aria-hidden="true">
            <span />
            <i />
            <b />
          </div>
          <div className={styles.projectWordmark} aria-hidden="true">
            {work.wordmark}
          </div>

          <div className={styles.workIntro} data-reveal="headline">
            <p className={styles.sectionLabel}>{work.label}</p>
            <h2>{work.heading}</h2>
            <p>
              <span className={styles.desktopCopy}>{work.intro}</span>
              <span className={styles.mobileCopy}>
                {homepageCopy.mobile.workIntro}
              </span>
            </p>
          </div>

          <article
            className={styles.projectPortal}
            onPointerMove={moveProject}
            onPointerLeave={resetProject}
            data-reveal="project"
            aria-labelledby="wizards-chess-title"
          >
            <a
              className={styles.projectMedia}
              href={personalProject.live}
              target="_blank"
              rel="noreferrer"
              aria-label={`${work.visitLabel}. ${work.projectLinkLabel}`}
            >
              <span className={styles.projectImageLayer}>
                <span className={styles.projectImageReveal}>
                  <Image
                    src={personalProject.image}
                    alt={personalProject.imageAlt}
                    fill
                    sizes="(max-width: 900px) 100vw, 68vw"
                    className={styles.projectImage}
                  />
                </span>
              </span>
              <span className={styles.projectSpotlight} aria-hidden="true" />
              <span className={styles.projectSweep} aria-hidden="true" />
              <span className={styles.projectNumber} aria-hidden="true">
                {work.projectNumber}
              </span>
              <span className={styles.projectMediaCta} aria-hidden="true">
                <span>{work.visitLabel}</span>
                <b>↗</b>
              </span>
            </a>

            <div className={styles.projectBody}>
              <p>{personalProject.eyebrow}</p>
              <h3 id="wizards-chess-title">{personalProject.name}</h3>
              <p className={styles.projectDescription}>
                <span className={styles.desktopCopy}>
                  {personalProject.description}
                </span>
                <span className={styles.mobileCopy}>
                  {homepageCopy.mobile.projectDescription}
                </span>
              </p>
              <ul
                className={styles.techList}
                aria-label={work.technologiesAriaLabel}
              >
                {personalProject.tech.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        </section>

        <section className={styles.aboutSection} id="about" data-scroll-scene>
          <div className={styles.aboutCopy} data-reveal="about">
            <p className={styles.sectionLabel}>{about.label}</p>
            <h2>{about.heading}</h2>
            <p>
              <span className={styles.desktopCopy}>{about.body}</span>
              <span className={styles.mobileCopy}>
                {homepageCopy.mobile.aboutBody}
              </span>
            </p>
          </div>

          <div className={styles.skillLanes} id="skills" data-reveal="skills">
            <header className={styles.skillsHeader}>
              <div>
                <p className={styles.sectionLabel}>
                  <span className={styles.desktopCopy}>
                    {skills.capabilitiesLabel}
                  </span>
                  <span className={styles.mobileCopy}>
                    {skills.capabilitiesLabel}
                  </span>
                </p>
                <h3>{skills.heading}</h3>
              </div>
              <p>
                <span className={styles.desktopCopy}>{skills.intro}</span>
                <span className={styles.mobileCopy}>
                  {homepageCopy.mobile.skillsIntro}
                </span>
              </p>
            </header>

            <div className={styles.skillGrid}>
              {skillGroups.map((group) => {
                const isSkillGroupOpen = openSkillGroups.has(group.key);
                const skillListId = `${group.key}-skill-list`;
                const skillDisclosureLabel = isSkillGroupOpen ? "Hide" : "View";

                return (
                  <section
                    className={styles.skillLane}
                    key={group.key}
                    data-skill-group={group.key}
                    data-mobile-open={isSkillGroupOpen ? "true" : "false"}
                  >
                    <header>
                      <div>
                        <h4>{group.label}</h4>
                        <p>{group.description}</p>
                      </div>
                      <button
                        type="button"
                        className={styles.skillDisclosure}
                        aria-controls={skillListId}
                        aria-expanded={isSkillGroupOpen}
                        aria-label={`${skillDisclosureLabel} ${group.label} skills`}
                        onClick={() => toggleSkillGroup(group.key)}
                      >
                        <span>{skillDisclosureLabel}</span>
                        <i aria-hidden="true" />
                      </button>
                    </header>

                    <ul id={skillListId}>
                      {group.items.map((item) => (
                        <li key={item.source} title={item.source}>
                          <span className={styles.skillIcon} aria-hidden="true">
                            {item.icon ? (
                              <Image
                                src={item.icon}
                                width={32}
                                height={32}
                                alt=""
                              />
                            ) : (
                              <b>{item.mark}</b>
                            )}
                          </span>
                          <span className={styles.skillName}>{item.label}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className={styles.contactSection}
          id="contact"
          data-reveal="contact"
          data-scroll-scene
        >
          <div className={styles.contactAtmosphere} aria-hidden="true">
            <span />
            <i />
            <b>{contact.atmosphereWord}</b>
          </div>
          <div className={styles.contactGrid}>
            <div className={styles.contactCopy}>
              <p className={styles.sectionLabel}>{contact.label}</p>
              <h2>{contact.heading}</h2>
              <p className={styles.contactIntro}>
                <span className={styles.desktopCopy}>{contact.intro}</span>
                <span className={styles.mobileCopy}>
                  {homepageCopy.mobile.contactIntro}
                </span>
              </p>
              <a
                className={styles.contactAction}
                href={`mailto:${resumeData.personalInfo.email}`}
              >
                {contact.emailActionLabel} <span aria-hidden="true">↗</span>
              </a>
            </div>

            <aside
              className={styles.contactSignal}
              aria-label={contact.availabilityAriaLabel}
            >
              <span>
                <i aria-hidden="true" /> {contact.availabilityStatus}
              </span>
              <strong>{contact.availabilityStatement}</strong>
              <p>{contact.locationStatement}</p>
            </aside>
          </div>

          <div className={styles.contactDetails}>
            <a href={`mailto:${resumeData.personalInfo.email}`}>
              <span>{contact.emailLabel}</span>
              {resumeData.personalInfo.email}
            </a>
            <a
              href={resumeData.personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <span>{contact.networkLabel}</span>
              LinkedIn ↗
            </a>
            <a
              href={resumeData.personalInfo.github}
              target="_blank"
              rel="noreferrer"
            >
              <span>{contact.codeLabel}</span>
              GitHub ↗
            </a>
          </div>
        </section>
      </main>

      <footer className={styles.footer} data-reveal="footer">
        <p>{footer.credit}</p>
        <a href="#top">{footer.backToTopLabel}</a>
        <span suppressHydrationWarning>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};

export default PortfolioHome;
