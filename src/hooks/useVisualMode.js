import { useState } from 'react'; 

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (mode, replace = false) => {
    if(replace) {
      setHistory([...history.slice(0, history.length - 1), mode]);
    } else {
      setHistory([...history, mode]);
    }

    setMode(mode);
  };
  
  const back = () => {
    history.pop();
    setMode(history[history.length - 1]);
  };

  return {
    mode,
    transition,
    back,
  }
}