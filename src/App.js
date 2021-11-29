import { lazy, Suspense  } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Start from './components/Start';
import { ROUTE } from './Constant';
import EffectProvider from './context/EffectsContext';
import SudokuProvider from './context/SudokuContext';
const Board = lazy(() => import('./components/Board'));

function App() {
  return (
    <div className="main">
      <SudokuProvider>
        <EffectProvider>
        <BrowserRouter>
        <Switch>
        <Suspense fallback={<div />}>
          <Route path={ROUTE.BOARD} component={Board} />
          <Route path={ROUTE.START} component={Start} />
          <Redirect from={ROUTE.ROOT} to={ROUTE.START} />
          </Suspense>
          </Switch>
        </BrowserRouter>
        </EffectProvider>
      </SudokuProvider>
    </div>
  );
}

export default App;
