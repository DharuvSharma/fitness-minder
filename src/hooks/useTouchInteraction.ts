
import { useState, useEffect } from 'react';

export const useTouchInteraction = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    // Check if the device supports touch
    const hasTouchSupport = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;
    
    setIsTouchDevice(hasTouchSupport);
    
    // Add touch-specific class to the body for CSS targeting
    if (hasTouchSupport) {
      document.body.classList.add('touch-device');
    } else {
      document.body.classList.remove('touch-device');
    }
    
    return () => {
      document.body.classList.remove('touch-device');
    };
  }, []);
  
  // Apply larger touch targets for touch devices
  const touchFriendlyClass = isTouchDevice 
    ? 'min-h-[44px] min-w-[44px] p-3' 
    : '';
  
  return {
    isTouchDevice,
    touchFriendlyClass
  };
};
