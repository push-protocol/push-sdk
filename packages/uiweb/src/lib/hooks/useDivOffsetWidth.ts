import { useEffect, useRef, useState } from "react";

export const useDivOffsetWidth = (): [React.RefObject<HTMLDivElement>, number] => {
    const divRef = useRef<HTMLDivElement>(null);
    const [offsetWidth, setOffsetWidth] = useState(0);
       
    useEffect(() => {
        const handleResize = (): void => {
          if (divRef.current) {
            setOffsetWidth(divRef.current.offsetWidth);
          }
        };
    
        const timeoutId = setTimeout(() => {
          handleResize(); // Measure offsetWidth after delay
        }, 0);
    
        window.addEventListener('resize', handleResize);
    
        // Clean up the event listener and timeout on component unmount
        return () => {
          window.removeEventListener('resize', handleResize);
          clearTimeout(timeoutId);
        };
      }, []);
    
      return [divRef, offsetWidth];
}
  
 
  
  
  
  
  
  