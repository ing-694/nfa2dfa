import React, { useEffect, useState } from 'react';
import { NFA, DFA } from './nfa2dfa';

interface NFAInputProps {
    initNfa: NFA | null;
    setNfa: (nfa: NFA) => void;
}

export const NFAInput: React.FC<NFAInputProps> = ({ initNfa, setNfa }) => {
    const [states, setStates] = useState('');
    const [alphabet, setAlphabet] = useState('');
    const [transitions, setTransitions] = useState('');
    const [startState, setStartState] = useState('');
    const [acceptStates, setAcceptStates] = useState('');

    const [warning, setWarning] = useState("");

    const handleSubmit = () => {
        // 进行格式检查
        if (!states || !alphabet || !transitions || !startState || !acceptStates) {
            return;
        }

        // 判断是否有重复的状态
        const stateSet = new Set(states.split(','));
        if (stateSet.size !== states.split(',').length) {
            setWarning("There are duplicate states!");
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

    useEffect(() => {
        if (initNfa) {
            setStates(Array.from(initNfa.states).join(','));
            setAlphabet(Array.from(initNfa.alphabet).join(','));
            setTransitions(initNfa.transitions.map(t => `${t.state},${t.symbol},${t.nextState}`).join('\n'));
            setStartState(initNfa.startState);
            setAcceptStates(Array.from(initNfa.acceptStates).join(','));
        }
    }, [initNfa]);

    return (
        <div className="w-[40%] p-4">
            <div className="flex flex-col space-y-6 bg-gray-200 p-8 rounded text-black text-left">
                <div className='font-black text-5xl'>NFA</div>
                <div className="flex flex-col space-y-2 items-start">
                    <label className="text-lg font-bold">States:</label>
                    <input className="p-2 rounded border border-gray-300 bg-white w-full"
                        placeholder="State1,State2,... (Use the English comma to split)"
                        value={states}
                        onChange={e => setStates(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-2 items-start">
                    <label className="text-lg font-bold">Alphabet:</label>
                    <input className="p-2 rounded border border-gray-300 bg-white w-full"
                        placeholder="Symbol1,Symbol2,..."
                        value={alphabet}
                        onChange={e => setAlphabet(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-2 items-start">
                    <label className="text-lg font-bold">Transitions (one per line) (Here is a "ε" to copy):</label>
                    <textarea className="p-2 rounded border border-gray-300 bg-white w-full h-[135px]"
                        placeholder="State1,Symbol1,State2&#13;&#10;State1,Symbol2,State2&#13;&#10;...&#13;&#10;(When multiple states can be obtained from a single state, please write them in multiple separate lines)"
                        value={transitions}
                        onChange={e => setTransitions(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-2 items-start">
                    <label className="text-lg font-bold">Start state:</label>
                    <input className="p-2 rounded border border-gray-300 bg-white w-full"
                        placeholder="StartState"
                        value={startState}
                        onChange={e => setStartState(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-2 items-start">
                    <label className="text-lg font-bold">Accept states:</label>
                    <input className="p-2 rounded border border-gray-300 bg-white w-full"
                        placeholder="AcceptState1,AcceptState2,..."
                        value={acceptStates}
                        onChange={e => setAcceptStates(e.target.value)} />
                </div>
                <div className='text-red'>{warning}</div>
            </div>
        </div>
    );
};

interface DFAOutputProps {
    dfa: DFA;
}

export const DFAOutput: React.FC<DFAOutputProps> = ({ dfa }) => {
    return (
        <div className="w-[40%] max-h-[90vh]  p-4">
            <div className="flex flex-col space-y-6 bg-gray-200 p-8 rounded overflow-y-scroll overflow-x-hidden text-black text-left">
                <div className='font-black text-5xl'>DFA</div>
                <div className="flex flex-col space-y-2 min-h-full items-start">
                    <h3 className="text-lg font-bold">States:</h3>
                    <ul className="list-disc list-inside text-left">
                        {dfa ? Array.from(dfa.states).map(state => <li key={state}>{state}</li>) : ""}
                    </ul>
                </div>
                <div className="flex flex-col space-y-2 text-left">
                    <h3 className="text-lg font-bold">Alphabet:</h3>
                    <ul className="list-disc list-inside items-start">
                        {dfa ? Array.from(dfa.alphabet).map(symbol => <li key={symbol}>{symbol}</li>) : ""}
                    </ul>
                </div>
                <div className="flex flex-col space-y-2 text-left">
                    <h3 className="text-lg font-bold">Transitions:</h3>
                    <ul className="flex flex-col justify-center items-start">
                        {dfa ? Array.from(dfa.transitions).map(({ state, symbol, nextState }) =>
                            <li key={Array.from(state).join(",") + symbol + Array.from(nextState)}>
                                {Array.from(state).join(",")} -{symbol}{"->"} {Array.from(nextState).join(",")}
                            </li>) : ""}
                    </ul>
                </div>
                <div className="flex flex-col space-y-2 text-left">
                    <h3 className="text-lg font-bold">Start State:</h3>
                    <p>{dfa ? dfa.startState : ""}</p>
                </div>
                <div className="flex flex-col space-y-2 text-left">
                    <h3 className="text-lg font-bold">Accept States:</h3>
                    <ul className="list-disc list-inside">
                        {dfa ? Array.from(dfa.acceptStates).map(state => <li key={state}>{state}</li>) : ""}
                    </ul>
                </div>
            </div>
        </div>
    );
};
