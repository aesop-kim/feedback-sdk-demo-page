import { createRoot } from 'react-dom/client';
import '@lattice-im/design-system/styles/reset';
import '@lattice-im/design-system/tokens/css';
import { App } from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(<App />);
