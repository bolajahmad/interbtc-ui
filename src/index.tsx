import './index.css';
// TODO: import only one theme
import '@/component-library/theme/theme.interlay.css';
import '@/component-library/theme/theme.kintsugi.css';

import * as React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

// ray test touch <
import SubstrateLoadingAndErrorHandlingWrapper from '@/substrate-lib/components/SubstrateLoadingAndErrorHandlingWrapper';
import { SubstrateProvider } from '@/substrate-lib/substrate-context';

// ray test touch >
import App from './App';
import reportWebVitals from './reportWebVitals';
import { persistor, store } from './store';

// ray test touch <<
const DeveloperConsole = React.lazy(
  () => import(/* webpackChunkName: 'developer-console' */ '@/substrate-lib/components/DeveloperConsole')
);
// ray test touch >>

window.isFetchingActive = false;

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              {/* ray test touch < */}
              <SubstrateProvider>
                <SubstrateLoadingAndErrorHandlingWrapper>
                  <App />
                </SubstrateLoadingAndErrorHandlingWrapper>
                <DeveloperConsole />
              </SubstrateProvider>
              {/* ray test touch > */}
            </PersistGate>
          </Provider>
        </HelmetProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
