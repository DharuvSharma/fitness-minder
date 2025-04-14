
import React, { useEffect, useState } from 'react';
import { quoteService, Quote } from '@/services/quoteService';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface DailyQuoteProps {
  className?: string;
}

const DailyQuote: React.FC<DailyQuoteProps> = ({ className = '' }) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setIsLoading(true);
        const dailyQuote = await quoteService.getDailyQuote();
        setQuote(dailyQuote);
      } catch (error) {
        console.error('Failed to fetch quote:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (isLoading) {
    return (
      <Card className={`${className} animate-pulse`}>
        <CardContent className="p-4 h-24 flex items-center justify-center">
          <p className="text-muted-foreground">Loading daily inspiration...</p>
        </CardContent>
      </Card>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-start">
          <Lightbulb className="h-5 w-5 mr-2 mt-1 text-yellow-500" />
          <div>
            <p className="italic text-sm md:text-base">"{quote.text}"</p>
            <p className="text-xs md:text-sm text-muted-foreground text-right mt-1">
              — {quote.author || 'Unknown'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyQuote;
