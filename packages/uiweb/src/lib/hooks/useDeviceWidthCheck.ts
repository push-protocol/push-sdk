import { useEffect, useState } from 'react';

export function useDeviceWidthCheck(deviceWidth: number) {
    const [width, setWidth] = useState<number>(window.outerWidth);
   
    function handleWindowSizeChange() {
        setWidth(window.outerWidth);
    }
  
    useEffect(() => {
        function handleInitialWidth() {
            setWidth(window.outerWidth);
        }
      
        window.addEventListener('resize', handleWindowSizeChange);
        window.addEventListener('load', handleInitialWidth);
        
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
            window.removeEventListener('load', handleInitialWidth);
        }
    }, [deviceWidth]);
 
    return width <= deviceWidth;
} 
