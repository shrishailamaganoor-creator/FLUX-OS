import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import VoiceHud from './components/VoiceHud.tsx';
import './index.css';
import {ensureWritableFetch} from './utils/nexoraState';

ensureWritableFetch();

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <VoiceHud />
  </>,
);


