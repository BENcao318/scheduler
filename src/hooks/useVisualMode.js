import { useState } from 'react'; 

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (mode, replace = false) => {
    if(replace) {
      setHistory(prev => [...prev.slice(0, prev.length - 1), mode]);   //Make sure to use prev for ensuring that the prev state is called on time. For asyncchronous callback, this is important to not let the state grow stale. 
    } else {
      setHistory(prev => [...prev, mode]);    //Make sure to use prev for ensure that the prev state is called on time. For asyncchronous callback, this is important to not let the state grow stale. 
    }

    setMode(mode);
  };
  
  const back = () => {
    const newHis = history.filter((_, index) => index !== history.length - 1);  //Use filter instead of Array.pop() or Array.splice() to avoid mutating the state directly.
    setHistory(newHis);
    setMode(newHis[newHis.length - 1]);
  };

  return {
    mode,
    transition,
    back,
  }
}