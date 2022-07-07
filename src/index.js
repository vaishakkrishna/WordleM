import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css"
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Helper from "./pages/Helper"
import ScoreReport from "./pages/ScoreReport";
import NoPage from "./pages/NoPage";
import Freeplay from "./pages/Freeplay";

export default function App() {
  return (
    <div className="base">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Helper/>} />
          <Route path="about" element={<Home/>} />
          <Route path="freeplay" element={<Freeplay/>} />
          <Route path="ScoreReport" element={<ScoreReport/>} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
    
  );
}

ReactDOM.render(<App />, document.getElementById("root"));