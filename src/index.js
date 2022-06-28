import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css"
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Helper from "./pages/Helper"
import Scorer from "./pages/Scorer";
import ScoreReport from "./pages/ScoreReport";
import Solver from "./pages/Solver"
import NoPage from "./pages/NoPage";


export default function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>} />
          <Route path="Solver" element={<Solver/>} />
          <Route path="Scorer" element={<Scorer/>} />
          <Route path="Helper" element={<Helper/>} />
          <Route path="ScoreReport" element={<ScoreReport/>} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
    
  );
}

ReactDOM.render(<App />, document.getElementById("root"));