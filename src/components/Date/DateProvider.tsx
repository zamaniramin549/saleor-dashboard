import React from "react";

import { Provider } from "./DateContext";

export const DateProvider: React.FC = ({ children }) => {
  const [date, setDate] = React.useState(Date.now());
  const intervalId = React.useRef<number>();

  React.useEffect(() => {
    intervalId.current = window.setInterval(() => setDate(Date.now()), 60_000);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, []);

  return <Provider value={date}>{children}</Provider>;
};
