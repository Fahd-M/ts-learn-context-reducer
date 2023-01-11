import { createContext, useReducer, ChangeEvent, ReactElement, useCallback, useContext } from "react";

type StateType = {
    count: number;
    text: string; 
}

export const initState: StateType = {count: 0, text: ''}

const enum REDUCER_ACTION_TYPE {
    INCREMENT,
    DECREMENT,
    NEW_INPUT
}

type ReducerAction = {
    type: REDUCER_ACTION_TYPE
    //need payload (getting input from user in text format)
    payload?: string,
}

const reducer = (state: StateType, action: ReducerAction): StateType => {
    switch (action.type) {
        case REDUCER_ACTION_TYPE.INCREMENT:
            return { ...state, count: state.count + 1}
        case REDUCER_ACTION_TYPE.DECREMENT:
            return {...state, count: state.count - 1}
        case REDUCER_ACTION_TYPE.NEW_INPUT:
            return {...state, text: action.payload ?? '' }        
        default:
            throw new Error()
    }
}


// this is a hook that will be used later to bring in counter 
const useCounterContext = (initState: StateType) => {
    const [state, dispatch] = useReducer(reducer, initState)

    // functions increment, decrement,handleTextInput do not change but they are RECREATED
    // wrap them in useCallback so that it always delivers same fx and doesn't necessarily cause component re-render

    const increment = useCallback(() => dispatch({ type: REDUCER_ACTION_TYPE.INCREMENT}), [])
    const decrement = useCallback(() => dispatch({ type: REDUCER_ACTION_TYPE.DECREMENT}), [])
  
    const handleTextInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      dispatch({ 
          type: REDUCER_ACTION_TYPE.NEW_INPUT, 
          payload: e.target.value,
      })
    }, [])
    return { state, increment, decrement, handleTextInput }
}

type UseCounterContextType = ReturnType<typeof useCounterContext> //ReturnType  utility 

// this will have values where we use initial state we defined
const initContextState: UseCounterContextType = {
    //  initial values for context 
    state: initState,
    increment: () => {}, //anonymous fx with void return type
    decrement: () => {},
    handleTextInput: (e: ChangeEvent<HTMLInputElement>) => {},
}


export const CounterContext = createContext<UseCounterContextType>(initContextState)
//can pass this in as you create context

// post react v18 you must define children (not done implicitly)
type ChildrenType = {
    children?: ReactElement | undefined
}

//NOTE: every context needs a provider where it can provide data and logic it contains to parts of app that need to receive it
export const CounterProvider = ({
    children, ...initState
    // NOTE: this uses rest parameters so must be in this order(children first,... is last)
}: ChildrenType & StateType): ReactElement => {
    // NOTE: ReactElement used instead of ReactNode
    return (
        // value we pass in: call the hook useCounterContext(bc it has everything we want to provide). Receives initital state 
        <CounterContext.Provider value={useCounterContext(initState)} > 
            {children}
        </CounterContext.Provider>
    )
}
//  the {} in the () is what gets received, in this case the children(children between opening and closing tags of component
//  then wrap provider around components that we want to receive the info from context


type UseCounterHookType = {
    count: number, 
    increment: () => void,
    decrement: () => void,
}

export const useCounter = (): UseCounterHookType => {
    //destructured 
    const { state: {count}, increment, decrement } = useContext(CounterContext)
    return { count, increment, decrement } 
    // only return relevant things to the counter (dont need text)
}

type UseCounterTextHookType = {
    text: string,
    handleTextInput: (e: ChangeEvent<HTMLInputElement>) => void,
}

// custom hook
export const useCounterText = (): UseCounterTextHookType => {
    const { state: { text }, handleTextInput } = useContext(CounterContext)
    return {text, handleTextInput}
}