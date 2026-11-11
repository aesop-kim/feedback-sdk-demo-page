import { createRoot } from 'react-dom/client';
import '@lattice-im/design-system/styles/reset';
import '@lattice-im/design-system/styles/font';
import '@lattice-im/design-system/tokens/css';
import '../node_modules/@lattice-im/design-system/dist/styles/prix-theme.css';
import { App } from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(<App />);
