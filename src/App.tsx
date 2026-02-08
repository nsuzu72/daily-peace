import React from 'react';
import QuoteDisplay from './components/QuoteDisplay';
import { useDailyContent } from './hooks/useDailyContent';

function App() {
  const { quote, backgroundImage } = useDailyContent();

  return (
    <main className="h-screen w-full bg-black">
      <QuoteDisplay 
        text={quote.text} 
        attribution={quote.attribution} 
        backgroundImage={backgroundImage} 
      />
    </main>
  );
}

export default App;
