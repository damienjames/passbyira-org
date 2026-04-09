"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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

  const activeEvent = items.find((item) => item.id === activeEventId) ?? null;
  const activeImages = activeEvent?.images ?? [];
  const activeImage = activeImages[activeImageIndex] ?? null;

  useEffect(() => {
    if (!activeEvent) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveEventId(null);
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
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
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
                  onClick={() => {
                    setActiveEventId(item.id);
                    setActiveImageIndex(0);
                  }}
                  aria-haspopup="dialog"
                >
                  View all {item.images.length} photos
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>

      {activeEvent && activeImage ? (
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-labelledby="gallery-modal-title">
          <div className="gallery-modal__backdrop" onClick={() => setActiveEventId(null)} />
          <div className="gallery-modal__panel">
            <div className="gallery-modal__header">
              <div>
                <div className="section-eyebrow">{activeEvent.subtitle}</div>
                <h2 id="gallery-modal-title" style={{ margin: "0.35rem 0 0" }}>{activeEvent.title}</h2>
              </div>
              <button type="button" className="gallery-modal__close" onClick={() => setActiveEventId(null)} aria-label="Close gallery">
                ×
              </button>
            </div>

            <div className="gallery-modal__stage">
              <button
                type="button"
                className="gallery-modal__nav"
                onClick={() => setActiveImageIndex((currentIndex) => (currentIndex - 1 + activeImages.length) % activeImages.length)}
                aria-label="Previous image"
              >
                ‹
              </button>
              <div className="gallery-modal__image-wrap">
                <Image src={activeImage.src} alt={activeImage.alt} width={1600} height={1200} className="gallery-modal__image" />
              </div>
              <button
                type="button"
                className="gallery-modal__nav"
                onClick={() => setActiveImageIndex((currentIndex) => (currentIndex + 1) % activeImages.length)}
                aria-label="Next image"
              >
                ›
              </button>
            </div>

            <div className="gallery-modal__footer">
              <p className="gallery-modal__count">
                Photo {activeImageIndex + 1} of {activeImages.length}
              </p>
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
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}