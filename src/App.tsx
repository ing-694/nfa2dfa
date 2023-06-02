import React, { useEffect, useState } from 'react';
import { NFA, DFA, nfaToDfa } from './nfa2dfa';
import { NFAInput, DFAOutput } from './io';
import './App.css';

export const App: React.FC = () => {
  const [nfa, setNfa] = useState(null as null | NFA);
  const [dfa, setDfa] = useState(null as null | DFA);

  // 调用转换函数
  const convert = () => {
    setDfa(nfaToDfa(nfa!));
  };

  let defaultNfa: NFA = {
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

  useEffect(() => {
    console.log(nfa);
    setNfa(defaultNfa);
  }, []);

  return (
    <div className="flex flex-row w-full h-full justify-center items-center">
      <NFAInput setNfa={setNfa} />
      <button className='m-3' onClick={convert}>转化</button>
      <DFAOutput dfa={dfa!} />
    </div>
  );
};
