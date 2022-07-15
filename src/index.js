import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css"
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import PlayView from "./pages/PlayView"
import ScoreReport from "./pages/ScoreReport";
import NoPage from "./pages/NoPage";


export default function App() {
  return (
    <div className="base">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<PlayView type="default"/>} />
          <Route path="about" element={<Home/>} />
          <Route path="freeplay" element={<PlayView type="freeplay"/>} />
          <Route path="ScoreReport" element={<ScoreReport/>} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
    
  );
}

ReactDOM.render(<App />, document.getElementById("root"));