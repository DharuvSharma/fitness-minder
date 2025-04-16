
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopNavigation from './navigation/DesktopNavigation';
import MobileNavigation from './navigation/MobileNavigation';

export const Navigation = () => {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileNavigation /> : <DesktopNavigation />;
};

export default Navigation;
