import { useEffect, useState } from 'react';

export function useDeviceWidthCheck(deviceWidth: number) {
    const [width, setWidth] = useState<number>(window.innerWidth);
  
    function handleWindowSizeChange() {
        setWidth(window.outerWidth);
    }
  
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);
  
    return width <= deviceWidth;
}
  