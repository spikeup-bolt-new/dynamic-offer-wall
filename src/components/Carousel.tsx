import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps<T> {
  items: T[];
  title: string;
  itemsToShow: number;
  renderItem: (item: T) => React.ReactNode;
}

export function Carousel<T>({ items, title, itemsToShow, renderItem }: CarouselProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalGroups = Math.ceil(items.length / itemsToShow);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + itemsToShow;
      return nextIndex >= items.length ? 0 : nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - itemsToShow;
      return nextIndex < 0 ? Math.max(0, items.length - itemsToShow) : nextIndex;
    });
  };

  if (!items.length) return null;

  const visibleItems = items.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div className="relative group">
      <div className="relative overflow-hidden rounded-lg">
        <div className="flex gap-1">
          {visibleItems.map((item, index) => (
            <div key={index} className="flex-shrink-0">
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
      
      {totalGroups > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}