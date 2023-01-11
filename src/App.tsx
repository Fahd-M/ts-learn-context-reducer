import Counter from './Counter'
import { CounterProvider } from './context/CounterContext'
import { initState } from './context/CounterContext'


function App() {
  return (
    <>
{/* NOTE: The provider only expects 1 child. wrap children in fragment OR
 change ChildrenType in context to ReactElement|ReactElement[]|undefined */}
      <CounterProvider count={initState.count} text={initState.text} > 
        <Counter> 
          {(num:number) => <> Current Count: {num} </>}
        </Counter>
      </CounterProvider>
    </>
  )
}
export default App

// TODO: Create a context, then provide it to the part of the app that would need it
// Wrap provider around component which needs to use the context 
// What we send in with provider is the count and text, which we provide through imported init state
// The initial state values we pass into provider are the initState.count/text.
