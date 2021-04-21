import { useLayoutEffect, useState } from 'react';

const useSize = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useLayoutEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);
  return [width, height];
};

export default useSize;
