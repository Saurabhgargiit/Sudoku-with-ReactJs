import React, { useState, useEffect } from "react";
import Input from "./Input";
import axios from "axios";
import * as icons from "./icons";
import "./Board.css";

let difficulty = "";
let tempTable = new Array(9).fill().map(() => {
  return new Array(9).fill(0);
});

const encodeBoard = (board) =>
  board.reduce(
    (result, row, i) =>
      result +
      `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? "" : "%2C"}`,
    ""
  );
const encodeParams = (params) =>
  Object.keys(params)
    .map((key) => key + "=" + `%5B${encodeBoard(params[key])}%5D`)
    .join("&");

function Board(props) {
  const [table, setTable] = useState(
    new Array(9).fill().map(() => {
      return new Array(9).fill(0);
    })
  );
  const [status, setStatus] = useState("unsolved");

  const convert = (puzzle) => {
    for (const [key, value] of Object.entries(puzzle)) {
      const [rowName, col] = key.split("");
      if (rowName === "A") tempTable[0][+col - 1] = +value;
      else if (rowName === "B") tempTable[1][+col - 1] = +value;
      else if (rowName === "C") tempTable[2][+col - 1] = +value;
      else if (rowName === "D") tempTable[3][+col - 1] = +value;
      else if (rowName === "E") tempTable[4][+col - 1] = +value;
      else if (rowName === "F") tempTable[5][+col - 1] = +value;
      else if (rowName === "G") tempTable[6][+col - 1] = +value;
      else if (rowName === "H") tempTable[7][+col - 1] = +value;
      else if (rowName === "I") tempTable[8][+col - 1] = +value;
    }
  };

  const newTableGenerator = () => {
    const newTable = [].concat(
      tempTable.map((el) => {
        return el;
      })
    );
    return newTable;
  };

  const changeHandler = (e) => {
    if (e.target.value.length > 1) {
      e.target.value = +e.target.value.split("")[0];
      return;
    }
    const [row, col] = e.target.id.split("");
    tempTable[+row][+col] = +e.target.value;
  };

  const clickHandler = (grade) => {
    tempTable = new Array(9).fill().map(() => {
      return new Array(9).fill(0);
    });
    if (grade === "clear") {
      console.log(tempTable);
      setTable(newTableGenerator());
      return;
    }
    axios
      .get(
        `https://vast-chamber-17969.herokuapp.com/generate?difficulty=${grade}`
      )
      .then((res) => {
        difficulty = res.data.difficulty;
        convert(res.data.puzzle);
        setTable(newTableGenerator());
        setStatus("unsolved");
      })
      .catch((err) => console.log(err));
  };

  const validsolveHandler = (type) => {
    const data = {
      board: tempTable,
    };

    fetch(`https://sugoku.herokuapp.com/${type}`, {
      method: "POST",
      body: encodeParams(data),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => response.json())
      .then((response) => {
        if (type === "validate") setStatus(response.status);
        if (type === "solve") {
          if (response.status === "unsolvable") setStatus("unsolvable");
          else if (response.status === "solved") {
            tempTable = response.solution;
            setTable(newTableGenerator());
            setStatus(response.status);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get(" https://vast-chamber-17969.herokuapp.com/generate?difficulty=easy")
      .then((res) => {
        difficulty = res.data.difficulty;
        convert(res.data.puzzle);
        setTable(newTableGenerator());
      })
      .catch((err) => console.log(err));
  }, []);

  const boardArr = table.map((row, i) => {
    return row.map((val, j) => {
      return (
        <Input
          changeHandler={changeHandler}
          tempTable={[].concat(
            table.map((el) => {
              return el;
            })
          )}
          i={i}
          j={j}
        />
      );
    });
  });

  return (
    <>
      <div className="board">{boardArr}</div>
      <div className="control-panel">
        <section className="section-1">
          <h3> Generate: </h3>
          <div className="difficulty button right-float">
            <div className="ui buttons">
              <button
                className="ui basic button"
                onClick={clickHandler.bind(this, "easy")}
              >
                Easy
              </button>
              <button
                className="ui basic button"
                onClick={clickHandler.bind(this, "medium")}
              >
                Medium
              </button>
              <button
                className="ui basic button"
                onClick={clickHandler.bind(this, "hard")}
              >
                Hard
              </button>
              <button
                className="ui basic button clear"
                onClick={clickHandler.bind(this, "clear")}
              >
                Clear
              </button>
            </div>
          </div>
        </section>
        <section className="section-1 section-2">
          <div className="ui buttons" tabIndex="0">
            <div
              className="ui basic button clear validate"
              onClick={validsolveHandler.bind(this, "validate")}
            >
              <icons.checkIcon /> Validate
            </div>
            <a className="value-box status">{status}</a>
          </div>
          <div className="ui buttons" tabIndex="0">
            <a className="value-box grade">{difficulty}</a>
            <div className="ui basic button value-box">
              <icons.capIcon /> Difficulty
            </div>
          </div>
        </section>
        <section className="section-1">
          <button
            className="ui basic button clear solve"
            onClick={validsolveHandler.bind(this, "solve")}
          >
            Solve
          </button>
        </section>
      </div>
    </>
  );
}

export default Board;
