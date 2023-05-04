import React, { useState, useEffect } from "react";
import Input from "./Input";
import axios from "axios";
import * as icons from "./icons";
import "./Board.css";

const Board = (props) => {
  const [table, setTable] = useState(
    new Array(9).fill().map(() => {
      return new Array(9).fill(0);
    })
  );

  const [difficulty, setDifficulty] = useState("");
  const [status, setStatus] = useState("unsolved");

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

  const changeHandler = (e) => {
    if (e.target.value.length > 1) {
      e.target.value = +e.target.value.split("")[0];
      return;
    }
    const [row, col] = e.target.id.split("");
    setTable(()=>{
        return table.map((arr,i)=>{
            if(i !== +row){
                return [...arr]
            } else{
                return arr.map((el,j) => j === +col? +e.target.value : el)
            }
        })
    })
  };

  const clickHandler = (grade) => {
    let tTable = new Array(9).fill().map(() => {
      return new Array(9).fill(0);
    });
    if (grade === "clear") {
      setTable(tTable);
      return;
    }
    axios
      .get(
        `https://sugoku.onrender.com/board?difficulty=${grade}`
      )
      .then((res) => {
        setDifficulty(grade);
        setTable(()=>res.data.board);
        setStatus("unsolved");
      })
      .catch((err) => console.log(err));
  };

  const validsolveHandler = (type) => {
    const data = {
      board: table,
    };

    fetch(`https://sugoku.onrender.com/${type}`, {
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
            setTable( ()=> response.solution);
            setStatus(response.status);
          }
        }
      })
      .catch((err) => console.log(err));
  };


  useEffect(() => {
    axios
      .get("https://sugoku.onrender.com/board?difficulty=easy")
      .then((res) => {
        setDifficulty('easy')
        setTable(()=>res.data.board);
      })
      .catch((err) => console.log(err));
  }, []);

  const boardArr = table.map((row, i) => {
    return row.map((val, j) => {
      return (
        <Input
          changeHandler={changeHandler}
          tempTable={table}
          key={'outer'+i+j}
          i={i}
          j={j}
        />
      );
    });
  });

  const statusClass = `value-box status ${status === "unsolved" ? "" : status}`;

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
                onClick={() => clickHandler("easy")}
              >
                Easy
              </button>
              <button
                className="ui basic button"
                onClick={() => clickHandler("medium")}
              >
                Medium
              </button>
              <button
                className="ui basic button"
                onClick={() => clickHandler("hard")}
              >
                Hard
              </button>
              <button
                className="ui basic button clear"
                onClick={() => clickHandler("clear")}
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
              onClick={() => validsolveHandler("validate")}
            >
              <icons.checkIcon /> Validate
            </div>
            <a className={statusClass}>{status}</a>
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
            onClick={() => validsolveHandler("solve")}
          >
            Solve
          </button>
        </section>
      </div>
    </>
  );
}

export default Board;
