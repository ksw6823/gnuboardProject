import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

if (process.env.NODE_ENV === 'development') {
  import('@stagewise/toolbar-react').then(({ StagewiseToolbar }) => {
    const stagewiseConfig = { plugins: [] };
    const toolbarRoot = document.createElement('div');
    document.body.appendChild(toolbarRoot);
    import('react-dom/client').then(({ createRoot }) => {
      createRoot(toolbarRoot).render(<StagewiseToolbar config={stagewiseConfig} />);
    });
  });
} 