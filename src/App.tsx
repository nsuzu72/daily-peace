import React, { useRef, useState, useEffect } from 'react';
import { useDailyContent } from './hooks/useDailyContent.ts';

const App: React.FC = () => {
  const { displayQuotes, loadMore, hasMore } = useDailyContent();

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [bookmarkedIndex, setBookmarkedIndex] = useState<number | null>(null);
  const [todayLoaded, setTodayLoaded] = useState(false);

  const currentIndex = useRef(0);
  const lastIndex = useRef(0);
  const isAutoScrolling = useRef(false);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* -----------------------------
     Bookmark Storage
  ----------------------------- */

  const saveBookmark = (index: number) => {
    const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');

    if (!saved.includes(index)) {
      const updated = [...saved, index];
      localStorage.setItem('bookmarks', JSON.stringify(updated));
    }

    setBookmarkedIndex(index);

    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }

    setTimeout(() => setBookmarkedIndex(null), 1200);
  };

  /* -----------------------------
     Long Press Handler
  ----------------------------- */

  const handlePressStart = (index: number) => {
    longPressTimer.current = setTimeout(() => {
      saveBookmark(index);
    }, 500);
  };

  const handlePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  /* -----------------------------
     Background Scale Animation
  ----------------------------- */

  useEffect(() => {
    sectionRefs.current.forEach((section) => {
      if (!section) return;

      const bg = section.querySelector('.bg-layer') as HTMLElement;
      if (!bg) return;

      bg.animate(
        [
          { transform: 'scale(1.05)' },
          { transform: 'scale(1.0)' }
        ],
        {
          duration: 6000,
          easing: 'ease-out',
          fill: 'forwards'
        }
      );
    });
  }, [displayQuotes]);

  /* -----------------------------
     Today Anchor Animation
  ----------------------------- */

  useEffect(() => {
    if (todayLoaded) return;

    const first = sectionRefs.current[0];
    if (!first) return;

    const content = first.querySelector('.quote-content');

    content?.animate(
      [
        { opacity: 0, transform: 'translateY(30px)' },
        { opacity: 1, transform: 'translateY(0px)' }
      ],
      {
        duration: 1200,
        easing: 'ease-out',
        fill: 'forwards'
      }
    );

    setTodayLoaded(true);
  }, [displayQuotes, todayLoaded]);

  /* -----------------------------
     Intersection Observer
  ----------------------------- */

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isAutoScrolling.current) return;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = Number(
            (entry.target as HTMLElement).dataset.index
          );

          lastIndex.current = currentIndex.current;
          currentIndex.current = index;

          const scrollingUp =
            currentIndex.current < lastIndex.current;

          setShowBackToTop(
            scrollingUp && currentIndex.current > 1
          );

          if (
            hasMore &&
            currentIndex.current >= displayQuotes.length - 2
          ) {
            loadMore();
          }

          if ('vibrate' in navigator) {
            navigator.vibrate(10);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6
      }
    );

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [displayQuotes, hasMore, loadMore]);

  /* -----------------------------
     Scroll To Top
  ----------------------------- */

  const scrollToTop = () => {
    if (!containerRef.current) return;

    isAutoScrolling.current = true;
    setShowBackToTop(false);

    containerRef.current.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    const check = () => {
      if (!containerRef.current) return;

      if (containerRef.current.scrollTop === 0) {
        isAutoScrolling.current = false;
        return;
      }

      requestAnimationFrame(check);
    };

    requestAnimationFrame(check);
  };

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black scroll-smooth relative"
    >
      {/* Back To Top */}

      <div
        className={`fixed top-12 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-in-out ${
          showBackToTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToTop}
          className="px-6 py-2 bg-black/40 backdrop-blur-xl border border-white/20 text-white rounded-full text-[10px] font-['Funnel_Sans'] tracking-[0.3em] uppercase hover:bg-white/10 active:scale-95 transition-all shadow-2xl"
        >
          Back to Top
        </button>
      </div>

      {/* Quotes */}

      {displayQuotes.map((item, index) => (
        <section
          key={`${index}-${item.attribution}`}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          data-index={index}
          className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden"
          onMouseDown={() => handlePressStart(index)}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={() => handlePressStart(index)}
          onTouchEnd={handlePressEnd}
        >
          {/* Background Layer */}

          <div
            className="bg-layer absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${item.bg})`
            }}
          />

          <div className="absolute inset-0 bg-black/40" />

          {/* Bookmark Indicator */}

          {bookmarkedIndex === index && (
            <div className="absolute top-10 right-10 text-white text-3xl animate-ping">
              ❤️
            </div>
          )}

          {/* Quote Content */}

          <div className="quote-content relative z-10 px-8 text-center max-w-3xl text-white">
            <h1 className="text-4xl md:text-6xl font-['Jaldi'] leading-tight mb-8 drop-shadow-lg">
              "{item.quote || item.text}"
            </h1>

            <p className="text-lg md:text-2xl font-['Funnel_Sans'] font-light uppercase tracking-[0.2em] text-white/90">
              — {item.attribution}
            </p>
          </div>
        </section>
      ))}

      {/* Final Page */}

      {!hasMore && (
        <section
          ref={(el) => {
            sectionRefs.current[displayQuotes.length] = el;
          }}
          data-index={displayQuotes.length}
          className="h-screen w-full snap-start flex flex-col items-center justify-center bg-zinc-900 text-white p-6"
        >
          <p className="font-['Funnel_Sans'] tracking-[0.4em] uppercase text-[10px] text-white/40 mb-10">
            No more quotes
          </p>

          <button
            onClick={scrollToTop}
            className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-full text-xs font-['Funnel_Sans'] tracking-[0.3em] uppercase hover:bg-white/10 active:scale-95 transition-all"
          >
            Return to Start
          </button>
        </section>
      )}
    </div>
  );
};

export default App;