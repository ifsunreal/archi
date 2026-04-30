"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";

type GalleryItem = {
  src: string;
  alt: string;
  title: string;
  meta: string;
};

const galleryItems: GalleryItem[] = [
  {
    src: "/assets/images/aerial view.avif",
    alt: "Aerial architecture composition",
    title: "Morning Light",
    meta: "Photography · 2024",
  },
  {
    src: "/assets/images/Aventi Townhomes.avif",
    alt: "Aventi townhomes perspective",
    title: "Aventi Townhomes",
    meta: "Residential · 2024",
  },
  {
    src: "/assets/images/Aventi Townhomes Facade Entrance.avif",
    alt: "Townhome facade entrance detail",
    title: "Facade Entrance",
    meta: "Study · 2023",
  },
  {
    src: "/assets/images/front elevation.avif",
    alt: "Front elevation drawing",
    title: "Front Elevation",
    meta: "Design · 2023",
  },
  {
    src: "/assets/images/lgv.avif",
    alt: "Large glass volume concept",
    title: "LGV Concept",
    meta: "Concept · 2022",
  },
  {
    src: "/assets/images/living area.avif",
    alt: "Living area interior",
    title: "Living Area",
    meta: "Interior · 2022",
  },
  {
    src: "/assets/images/award.avif",
    alt: "Architectural award showcase",
    title: "Award Showcase",
    meta: "Feature · 2021",
  },
];

export default function GalleryPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeItem = useMemo(() => galleryItems[activeIndex], [activeIndex]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % galleryItems.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const activeThumb = thumbRefs.current[activeIndex];
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIndex]);

  function goToPrevious() {
    setActiveIndex((current) => (current - 1 + galleryItems.length) % galleryItems.length);
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % galleryItems.length);
  }

  return (
    <>
      <SiteHeader />
      <div className="top-progress" id="topProgress" aria-hidden="true" />

      <main>
        <section className="section container gallery-view-page" id="gallery-view">
          <div className="gallery-shell" role="region" aria-label="Project gallery view">
            <div className="gallery-thumbs" aria-label="Gallery thumbnails">
              {galleryItems.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={item.src}
                    className={isActive ? "gallery-thumb active" : "gallery-thumb"}
                    aria-label={`Show ${item.title}`}
                    aria-pressed={isActive}
                    onClick={() => setActiveIndex(index)}
                    type="button"
                    ref={(element) => {
                      thumbRefs.current[index] = element;
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="96px"
                      className="gallery-thumb-image"
                    />
                  </button>
                );
              })}
            </div>

            <div className="gallery-main-panel">
              <div className="gallery-main-media">
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 78vw"
                  className="gallery-main-image"
                />
                <p className="gallery-main-title-overlay">{activeItem.title}</p>
              </div>

              <div className="gallery-main-meta">
                <div>
                  <h2>{activeItem.title}</h2>
                  <p>{activeItem.meta}</p>
                </div>
                <div className="gallery-controls" aria-label="Gallery controls">
                  <button type="button" onClick={goToPrevious} aria-label="Previous image">
                    &lt;
                  </button>
                  <button type="button" onClick={goToNext} aria-label="Next image">
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
