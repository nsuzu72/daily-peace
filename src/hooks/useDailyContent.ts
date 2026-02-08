import quotesData from '../data/quotes.json';

export const useDailyContent = () => {
  // 1. Get today's date string (e.g., "2026-02-08") 
  const today = new Date().toISOString().split('T')[0];

  // 2. Simple hash function to turn the date string into a consistent number
  const dateHash = today.split('-').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // 3. Select a quote based on the date hash [cite: 20]
  const quote = quotesData[dateHash % quotesData.length];

  // 4. Use a curated set of Unsplash IDs [cite: 15]
  // You can expand this list with any Unsplash IDs you like
  const photoIds = [
    'photo-1464822759023-fed622ff2c3b', // Mountains
    'photo-1470770841072-f978cf4d019e', // Landscape
    'photo-1501854140801-50d01698950b', // Nature
    'photo-1441974231531-c6227db76b6e'  // Forest
  ];
  
  const photoId = photoIds[dateHash % photoIds.length];
  const backgroundImage = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1920&q=80`;

  return { quote, backgroundImage };
};
