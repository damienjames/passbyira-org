"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  alt: string;
  body: string;
  images: readonly GalleryImage[];
}

export default function EventGallery({ items }: { items: readonly GalleryItem[] }) {
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const activeEvent = items.find((item) => item.id === activeEventId) ?? null;
  const activeImages = activeEvent?.images ?? [];
  const activeImage = activeImages[activeImageIndex] ?? null;
  const hasMultipleImages = activeImages.length > 1;

  useEffect(() => {
    if (!activeEvent) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveEventId(null);
        return;
      }

      if (event.key === "Tab") {
        const panel = document.querySelector<HTMLElement>(".gallery-modal__panel");
        const focusable = panel
          ? Array.from(panel.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'))
          : [];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
        return;
      }

      if (!activeImages.length) {
        return;
      }

      if (event.key === "ArrowRight") {
        setActiveImageIndex((currentIndex) => (currentIndex + 1) % activeImages.length);
      }

      if (event.key === "ArrowLeft") {
        setActiveImageIndex((currentIndex) => (currentIndex - 1 + activeImages.length) % activeImages.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      openerRef.current?.focus();
    };
  }, [activeEvent, activeImages.length]);

  return (
    <>
      <div style={{ display: "grid", gap: "2rem" }}>
        {items.map((item) => (
          <section key={item.id} id={item.id} className="feature-card event-gallery-card">
            <div className="gallery-item event-gallery-card__media" style={{ aspectRatio: "16 / 10" }}>
              <Image src={item.src} alt={item.alt} width={1200} height={800} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div className="gallery-caption">{item.title}</div>
            </div>
            <div className="event-gallery-card__body">
              <div className="section-eyebrow">{item.subtitle}</div>
              <h2 style={{ marginTop: 0 }}>{item.title}</h2>
              <p>{item.body}</p>
              <div className="event-gallery-card__actions">
                <button
                  type="button"
                  className="btn-pbi btn-outline-blue"
                  onClick={(event) => {
                    openerRef.current = event.currentTarget;
                    setActiveEventId(item.id);
                    setActiveImageIndex(0);
                  }}
                  aria-haspopup="dialog"
                >
                  {item.images.length > 1 ? `View all ${item.images.length} photos` : "View featured photo"}
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>

      {activeEvent && activeImage ? (
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-labelledby="gallery-modal-title">
          <div className="gallery-modal__backdrop" onClick={() => setActiveEventId(null)} />
          <div className="gallery-modal__panel" role="document">
            <div className="gallery-modal__header">
              <div>
                <div className="section-eyebrow">{activeEvent.subtitle}</div>
                <h2 id="gallery-modal-title" style={{ margin: "0.35rem 0 0" }}>{activeEvent.title}</h2>
              </div>
              <button ref={closeButtonRef} type="button" className="gallery-modal__close" onClick={() => setActiveEventId(null)} aria-label="Close gallery">
                ×
              </button>
            </div>

            <div className="gallery-modal__stage">
              {hasMultipleImages ? (
                <button
                  type="button"
                  className="gallery-modal__nav"
                  onClick={() => setActiveImageIndex((currentIndex) => (currentIndex - 1 + activeImages.length) % activeImages.length)}
                  aria-label="Previous image"
                >
                  ‹
                </button>
              ) : null}
              <div className="gallery-modal__image-wrap">
                <Image src={activeImage.src} alt={activeImage.alt} width={1600} height={1200} className="gallery-modal__image" sizes="(max-width: 760px) 90vw, 900px" />
              </div>
              {hasMultipleImages ? (
                <button
                  type="button"
                  className="gallery-modal__nav"
                  onClick={() => setActiveImageIndex((currentIndex) => (currentIndex + 1) % activeImages.length)}
                  aria-label="Next image"
                >
                  ›
                </button>
              ) : null}
            </div>

            <div className="gallery-modal__footer">
              <p className="gallery-modal__count" aria-live="polite">
                {hasMultipleImages ? `Photo ${activeImageIndex + 1} of ${activeImages.length}` : "Featured event photo"}
              </p>
              {hasMultipleImages ? (
                <div className="gallery-modal__thumbs">
                  {activeImages.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      className={`gallery-modal__thumb${index === activeImageIndex ? " is-active" : ""}`}
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`View ${activeEvent.title} photo ${index + 1}`}
                    >
                      <Image src={image.src} alt="" width={180} height={120} />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
