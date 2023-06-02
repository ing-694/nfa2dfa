import React, { useEffect, useState } from 'react';
import { NFA, DFA } from './nfa2dfa';

interface NFAInputProps {
    setNfa: (nfa: NFA) => void;
}

export const NFAInput: React.FC<NFAInputProps> = ({ setNfa }) => {
    const [states, setStates] = useState('');
    const [alphabet, setAlphabet] = useState('');
    const [transitions, setTransitions] = useState('');
    const [startState, setStartState] = useState('');
    const [acceptStates, setAcceptStates] = useState('');

    const handleSubmit = () => {
        // 进行格式检查
        if (!states || !alphabet || !transitions || !startState || !acceptStates) {
            return;
        }

        const nfa: NFA = {
            states: new Set(states.split(',')),
            alphabet: new Set(alphabet.split(',')),
            transitions: transitions.split('\n').map(t => {
                const [state, symbol, nextState] = t.split(',');
                return { state, symbol, nextState };
            }),
            startState,
            acceptStates: new Set(acceptStates.split(',')),
        };

        setNfa(nfa);
    };

    useEffect(() => {
        handleSubmit();
    }, [states, alphabet, transitions, startState, acceptStates]);

    return (
        <div className="w-[40%] p-4">
            <div className="flex flex-col space-y-6 bg-gray-200 p-4 rounded text-black">
                <div className="flex flex-col space-y-2">
                    <label className="text-lg font-bold">States:</label>
                    <input className="p-2 rounded border border-gray-300 bg-white w-full" placeholder="State1,State2,..." value={states} onChange={e => setStates(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-lg font-bold">Alphabet:</label>
                    <input className="p-2 rounded border border-gray-300 bg-white w-full" placeholder="Symbol1,Symbol2,..." value={alphabet} onChange={e => setAlphabet(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-lg font-bold">Transitions (one per line):</label>
                    <textarea className="p-2 rounded border border-gray-300 bg-white w-full h-24" placeholder="State1,Symbol1,State2&#13;&#10;State1,Symbol2,State2&#13;&#10;..." value={transitions} onChange={e => setTransitions(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-lg font-bold">Start state:</label>
                    <input className="p-2 rounded border border-gray-300 bg-white w-full" placeholder="StartState" value={startState} onChange={e => setStartState(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-lg font-bold">Accept states:</label>
                    <input className="p-2 rounded border border-gray-300 bg-white w-full" placeholder="AcceptState1,AcceptState2,..." value={acceptStates} onChange={e => setAcceptStates(e.target.value)} />
                </div>
            </div>
        </div>
    );
};

interface DFAOutputProps {
    dfa: DFA;
}

export const DFAOutput: React.FC<DFAOutputProps> = ({ dfa }) => {
    return (
        <div className="w-[40%] max-h-[90vh] overflow-y-scroll overflow-x-hidden p-4">
            <div className="flex flex-col space-y-6 bg-gray-200 p-4 rounded text-black">
                <div className="flex flex-col space-y-2 min-h-full">
                    <h3 className="text-lg font-bold">States:</h3>
                    <ul className="list-disc list-inside">
                        {dfa ? Array.from(dfa.states).map(state => <li key={state}>{state}</li>) : ""}
                    </ul>
                </div>
                <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-bold">Alphabet:</h3>
                    <ul className="list-disc list-inside">
                        {dfa ? Array.from(dfa.alphabet).map(symbol => <li key={symbol}>{symbol}</li>) : ""}
                    </ul>
                </div>
                <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-bold">Transitions:</h3>
                    <ul className="flex flex-col justify-center items-center">
                        {dfa ? Array.from(dfa.transitions).map(([state, transitions]) => (
                            <li key={state} className="flex">
                            <span className="mr-2">{state}:</span>
                            <ul>
                              {Array.from(transitions).map(([symbol, nextState]) => (
                                <li key={symbol} className="ml-4">
                                  {symbol} -&gt; {nextState}
                                </li>
                              ))}
                            </ul>
                          </li>
                        )) : ""}
                    </ul>
                </div>
                <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-bold">Start State:</h3>
                    <p>{dfa ? dfa.startState : ""}</p>
                </div>
                <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-bold">Accept States:</h3>
                    <ul className="list-disc list-inside">
                        {dfa ? Array.from(dfa.acceptStates).map(state => <li key={state}>{state}</li>) : ""}
                    </ul>
                </div>
            </div>
        </div>
    );
};
