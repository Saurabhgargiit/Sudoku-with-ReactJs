import react from "react";
import "./App.css";
import Board from "./components/Board";
import "./components/Board.css";

function App() {
  return (
    <div className="App">
      <h3>suDOku</h3>
      <Board />
      <div className="footer">
        <u>
          {" "}
          <i>This is a trial page only</i>
        </u>
        <a
          className="right-float"
          href="https://github.com/Saurabhgargiit/Saurabhgargiit.github.io"
          target="_blank" rel="noreferrer"
        >
          check code src
        </a>
      </div>
    </div>
  );
}

export default App;
