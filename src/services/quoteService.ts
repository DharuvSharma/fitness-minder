import apiClient from './apiClient';
import { toast } from 'sonner';

export interface Quote {
  id: string;
  text: string;
  author: string;
  category?: string;
}

export const quoteService = {
  // Get a daily motivational quote
  getDailyQuote: async (): Promise<Quote | null> => {
    try {
      // Try to get from localStorage first (cache for a day)
      const cachedQuote = localStorage.getItem('dailyQuote');
      const cachedTimestamp = localStorage.getItem('dailyQuoteTimestamp');
      
      // If we have a cached quote and it's less than 24 hours old, use it
      if (cachedQuote && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        const now = new Date().getTime();
        
        // 24 hours in milliseconds
        if (now - timestamp < 24 * 60 * 60 * 1000) {
          return JSON.parse(cachedQuote);
        }
      }
      
      // Otherwise fetch a new quote
      const response = await apiClient.get('/quotes/random');
      const quote = response.data;
      
      // Cache the quote
      localStorage.setItem('dailyQuote', JSON.stringify(quote));
      localStorage.setItem('dailyQuoteTimestamp', new Date().getTime().toString());
      
      return quote;
    } catch (error) {
      console.error('Error fetching daily quote:', error);
      
      // Fallback to hardcoded quotes if API fails
      const fallbackQuotes = [
        { id: "1", text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
        { id: "2", text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
        { id: "3", text: "Your health is an investment, not an expense.", author: "Unknown" },
        { id: "4", text: "Strength does not come from the body. It comes from the will.", author: "Mahatma Gandhi" },
        { id: "5", text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" }
      ];
      
      // Get a random quote from the fallback list
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      
      // Cache it
      localStorage.setItem('dailyQuote', JSON.stringify(randomQuote));
      localStorage.setItem('dailyQuoteTimestamp', new Date().getTime().toString());
      
      return randomQuote;
    }
  },
  
  // Get a health tip
  getHealthTip: async (): Promise<string | null> => {
    try {
      const response = await apiClient.get('/health-tips/random');
      return response.data.tip;
    } catch (error) {
      console.error('Error fetching health tip:', error);
      
      // Fallback health tips
      const fallbackTips = [
        "Drink at least 8 glasses of water daily to stay hydrated.",
        "Include at least 30 minutes of moderate exercise in your daily routine.",
        "Eating a rainbow of colored fruits and vegetables ensures you get a variety of nutrients.",
        "Taking short breaks to stretch during long periods of sitting improves circulation.",
        "Sleep 7-9 hours per night to support muscle recovery and overall health."
      ];
      
      return fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
    }
  }
};

export default quoteService;
