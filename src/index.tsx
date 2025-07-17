import React from 'react'; 
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import App from './app/App.tsx';
import reportWebVitals from './reportWebVitals.ts';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import './css/index.css';
import theme from './app/MaterialTheme/index.ts';
import { BrowserRouter as Router } from 'react-router-dom';
import ContextProvider from './app/context/ContextProvider.tsx';


const container = document.getElementById("root")!;
 const root = createRoot(container)
root.render(
<React.StrictMode>
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Router>
        <ContextProvider>     {/* ✅ App endi context ichida */}
        <App />
        </ContextProvider>
        </Router>
    </ThemeProvider>
  </Provider>
</React.StrictMode>,
);


reportWebVitals();


  