type State = string;
type Symbol = string;

export interface Transition {
  state: State;
  symbol: Symbol;
  nextState: State;
}

export interface NFA {
  states: Set<State>;
  alphabet: Set<Symbol>;
  transitions: Array<Transition>;
  startState: State;
  acceptStates: Set<State>;
}

export interface DFA {
  states: Set<State>;
  alphabet: Set<Symbol>;
  transitions: Map<State, Map<Symbol, State>>;
  startState: State;
  acceptStates: Set<State>;
}

// ε-闭包计算函数，接收一个状态和转换列表，返回通过 ε-转换可以到达的所有状态
function epsilonClosure(state: State, transitions: Array<Transition>): Set<State> {
  // 用来保存已经找到的状态
  let closure = new Set<State>();
  // 使用一个栈来进行深度优先搜索
  let stack = [state];

  while (stack.length > 0) {
    // 从栈顶取出一个状态
    let s = stack.pop() as State;

    // 如果这个状态还没有被加入到闭包中
    if (!closure.has(s)) {
      // 那么将其加入到闭包中
      closure.add(s);

      // 然后将所有通过 ε-转换可以从这个状态到达的状态加入到栈中
      for (let t of transitions) {
        if (t.state === s && t.symbol === 'ε') {
          stack.push(t.nextState);
        }
      }
    }
  }

  // 返回计算出的 ε-闭包
  return closure;
}

// NFA 转 DFA 函数
export function nfaToDfa(nfa: NFA): DFA {
  // 初始化 DFA 的状态、转换和接受状态
  let dfaStates = new Set<State>();
  let dfaTransitions = new Map<State, Map<Symbol, State>>();
  let dfaAcceptStates = new Set<State>();

  // 计算 NFA 起始状态的 ε-闭包并将其作为 DFA 的起始状态
  // console.log(epsilonClosure(nfa.startState, nfa.transitions));
  let startState = Array.from(epsilonClosure(nfa.startState, nfa.transitions)).join(',');

  // 创建一个队列来保存未处理的 NFA 状态集，开始时只包含 DFA 的起始状态
  let queue: Array<Set<State>> = [new Set(startState.split(','))];

  while (queue.length > 0) {
    // 从队列中取出一个 NFA 状态集
    let nfaStateSet = queue.shift();

    // 如果队列为空则继续下一轮循环
    if (!nfaStateSet) {
      continue;
    }

    // 将 NFA 状态集转化为字符串形式作为 DFA 的一个状态
    let dfaState = Array.from(nfaStateSet).join(',');

    // 如果 NFA 状态集中包含 NFA 的接受状态，那么这个 DFA 状态也是接受状态
    if (Array.from(nfaStateSet).some(state => nfa.acceptStates.has(state))) {
      dfaAcceptStates.add(dfaState);
    }

    // 将新的 DFA 状态添加到 DFA 的状态集中
    dfaStates.add(dfaState);

    // 对于 NFA 的每一个输入符号
    for (let symbol of nfa.alphabet) {
      // 跳过 ε-转换，因为 ε-转换已经在计算 ε-闭包时处理
      if (symbol === 'ε') continue;

      // 初始化下一个 NFA 状态集
      let nextStateSet = new Set<State>();

      // 对于当前 NFA 状态集中的每一个状态
      for (let state of nfaStateSet) {
        // 找出所有通过当前符号可以从当前状态到达的状态
        let transitions = nfa.transitions.filter(t => t.state === state && t.symbol === symbol);

        // 对于每一个转换
        for (let transition of transitions) {
          // 计算转换目标状态的 ε-闭包，并将其中的所有状态加入到下一个 NFA 状态集中
          let epsilonStates = epsilonClosure(transition.nextState, nfa.transitions);
          epsilonStates.forEach(state => nextStateSet.add(state));
        }
      }

      // 将下一个 NFA 状态集转化为字符串形式作为 DFA 的一个状态
      let dfaNextState = Array.from(nextStateSet).join(',');

      // 如果这个新的 DFA 状态非空且还没有被处理过，那么将其加入到队列中
      if (dfaNextState !== '' && !dfaStates.has(dfaNextState)) {
        queue.push(nextStateSet);
      }

      // 添加从当前 DFA 状态出发，通过当前符号到达新的 DFA 状态的转移
      let dfaTransition = dfaTransitions.get(dfaState) || new Map<Symbol, State>();
      dfaTransition.set(symbol, dfaNextState);
      dfaTransitions.set(dfaState, dfaTransition);
    }
  }

  // 返回构建出的 DFA
  nfa.alphabet.delete('ε')
  return {
    states: dfaStates,
    alphabet: nfa.alphabet,
    transitions: dfaTransitions,
    startState: startState,
    acceptStates: dfaAcceptStates
  };
}
