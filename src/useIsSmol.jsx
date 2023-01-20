import { useState, useEffect } from "react";
export const smolBreakpoint = 768; //px
function getSmol() {
  const { innerWidth: width } = window;

  return width >= smolBreakpoint ? false : true;
}

export default function useIsSmol() {
  const [smol, setSmol] = useState(getSmol());

  useEffect(() => {
    function handleResize() {
      setSmol(getSmol());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return smol;
}
