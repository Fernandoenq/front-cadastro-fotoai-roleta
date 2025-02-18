import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CameraScreen from '../pages/CameraScreen'
import SelectImageScreen from '../pages/SelectImagesScreen';
import LoginScreen from '../pages/LoginScreen';
import RedirectScreen from '../pages/RedirectScreen';
import NfcScreen from '../pages/NfcScreen';
import CadastroRapido from '../pages/CadastroRapido';
import CadastroCompleto from '../pages/CadastroCompleto';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/loginpromotor" element={<LoginScreen />} />
        <Route path="/redirectscreen" element={<RedirectScreen />} />
        <Route path="/nfcscreen" element={<NfcScreen />} />
        <Route path="/cadastrocompleto" element={<CadastroCompleto />} />
        <Route path="/cadastrorapido" element={<CadastroRapido />} />
        <Route path="/camera" element={<CameraScreen />} />
        <Route path="/selectimages" element={<SelectImageScreen />} />
        
        
        
        
        
        
      </Routes>
    </Router>
  );
};

export default App;
