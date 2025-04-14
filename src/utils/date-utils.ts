
import { format, parseISO, isAfter, subDays } from 'date-fns';

export const formatDate = (dateString: string, formatString: string = 'MM/dd/yyyy') => {
  try {
    return format(parseISO(dateString), formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export const isDateAfter = (dateString: string, daysAgo: number) => {
  try {
    const date = parseISO(dateString);
    const threshold = subDays(new Date(), daysAgo);
    return isAfter(date, threshold);
  } catch (error) {
    console.error('Error comparing dates:', error);
    return false;
  }
};

export const getCurrentDateString = () => {
  return format(new Date(), 'yyyy-MM-dd');
};
