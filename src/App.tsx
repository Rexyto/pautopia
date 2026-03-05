import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Lecturas from './pages/Lecturas';
import Creditos from './pages/Creditos';
import Frases from './pages/Frases';
import Apps from './pages/Apps';
import VigaCalc from './pages/VigaCalc';
import WaveCalc from './pages/WaveCalc';
import ConceptuandoHistoria from './pages/ConceptuandoHistoria';
import Ranking from './pages/Ranking';
import ApuntesIndex from './pages/apuntes/ApuntesIndex';
import Biologia from './pages/apuntes/Biologia';
import Tecnologia from './pages/apuntes/Tecnologia';
import Mates from './pages/apuntes/Mates';
import Filosofia from './pages/apuntes/Filosofia';
import Lengua from './pages/apuntes/Lengua';
import Ingles from './pages/apuntes/Ingles';
import Historia from './pages/apuntes/Historia';
import Fisica from './pages/apuntes/Fisica';
import Quimica from './pages/apuntes/Quimica';
import ExaminateIndex from './pages/examinate/ExaminateIndex';
import HistoriaExaminate from './pages/examinate/Historia';
import Conceptos from './pages/examinate/Conceptos';
import NotFound from './pages/NotFound';
import RLCCalc from './pages/rlccalc';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lecturas" element={<Lecturas />} />
          <Route path="/apuntes" element={<ApuntesIndex />} />
          <Route path="/apuntes/biologia" element={<Biologia />} />
          <Route path="/apuntes/tecnologia" element={<Tecnologia />} />
          <Route path="/apuntes/mates" element={<Mates />} />
          <Route path="/apuntes/filosofia" element={<Filosofia />} />
          <Route path="/apuntes/lengua" element={<Lengua />} />
          <Route path="/apuntes/ingles" element={<Ingles />} />
          <Route path="/apuntes/historia" element={<Historia />} />
          <Route path="/apuntes/fisica" element={<Fisica />} />
          <Route path="/apuntes/quimica" element={<Quimica />} />
          <Route path="/examinate" element={<ExaminateIndex />} />
          <Route path="/examinate/historia" element={<HistoriaExaminate />} />
          <Route path="/examinate/historia/conceptos" element={<Conceptos />} />
          <Route path="/frases" element={<Frases />} />
          <Route path="/creditos" element={<Creditos />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/apps/vigacalc" element={<VigaCalc />} />
          <Route path="/apps/wavecalc" element={<WaveCalc />} />
          <Route path="/apps/conceptuando-historia" element={<ConceptuandoHistoria />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/apps/rlccalc" element={<RLCCalc />} />

          {/* Ruta 404*/}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;