import React, { useEffect, useState } from 'react';
import { NFA, DFA, nfaToDfa } from './nfa2dfa';
import { NFAInput, DFAOutput } from './io';
import './App.css';

let exampleNfa: NFA = {
  states: new Set(["q0", "q1", "q2"]),
  alphabet: new Set(["0", "1", "ε"]),
  transitions: [
    { state: "q0", symbol: "ε", nextState: "q1" },
    { state: "q1", symbol: "0", nextState: "q1" },
    { state: "q1", symbol: "1", nextState: "q2" },
    { state: "q2", symbol: "0", nextState: "q2" }
  ],
  startState: "q0",
  acceptStates: new Set(["q2"])
};

export const App: React.FC = () => {
  const [nfa, setNfa] = useState(null as null | NFA);
  const [dfa, setDfa] = useState(null as null | DFA);
  const [defaultNfa, setDefaultNfa] = useState(null as null | NFA);

  // 调用转换函数
  const convert = () => {
    setDfa(nfaToDfa(nfa!));
  };

  useEffect(() => {
    // console.log(nfa);
    // setNfa(defaultNfa);
  }, []);

  return (
    <div className="flex flex-row w-full h-full justify-center items-center">
      <div className='fixed left-0 bottom-0 w-[100vw] p-3 text-md opacity-50 z-9999'>Made by LQY, HWX, HJZ & LDJ</div>
      <NFAInput initNfa={defaultNfa} setNfa={setNfa} />
      <div className='flex flex-col gap-2'>
        <button className='m-3' onClick={() => setDefaultNfa(exampleNfa)}>I need an example!!</button>
        <button className='m-3' onClick={convert}>Transform</button>
      </div>
      
      <DFAOutput dfa={dfa!} />
    </div>
  );
};
