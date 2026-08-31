// src/hooks/useDailyContent.ts
import { useState, useEffect, useCallback } from 'react';
// Corrected import: No 'src/' prefix, just relative path
import quotesData from '../data/quotes.json'; 

const BATCH_SIZE = 5;

export const useDailyContent = () => {
  const [displayQuotes, setDisplayQuotes] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 1. Generate date-based seed
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // 2. Find starting index based on the seed
    const startIndex = dateSeed % quotesData.length;
    
    // 3. Load the first batch
    const initialBatch = quotesData.slice(startIndex, startIndex + BATCH_SIZE).map((q, i) => ({
      ...q,
      // Use the index + seed to ensure a unique but "locked" image for the day
      bg: `https://picsum.photos/seed/${dateSeed + i}/1920/1080`
    }));

    setDisplayQuotes(initialBatch);
    setCurrentIndex(startIndex + BATCH_SIZE);
  }, []);

  const loadMore = useCallback(() => {
    // If we reach the end of the JSON, we stop
    if (currentIndex >= quotesData.length) return;

    const nextBatch = quotesData.slice(currentIndex, currentIndex + BATCH_SIZE).map((q, i) => ({
      ...q,
      // Use timestamp for unique backgrounds for new "scrolled" quotes
      bg: `https://picsum.photos/seed/${Date.now() + i}/1920/1080`
    }));

    setDisplayQuotes(prev => [...prev, ...nextBatch]);
    setCurrentIndex(prev => prev + BATCH_SIZE);
  }, [currentIndex]);

  return { displayQuotes, loadMore, hasMore: currentIndex < quotesData.length };
};