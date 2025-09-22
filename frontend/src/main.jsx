@@ .. @@
 import { StrictMode } from 'react';
 import { createRoot } from 'react-dom/client';
+import { DataProvider } from './context/DataContext';
 import App from './App.jsx';
 import './index.css';

 createRoot(document.getElementById('root')!).render(
   <StrictMode>
-    <App />
+    <DataProvider>
+      <App />
+    </DataProvider>
   </StrictMode>
 );