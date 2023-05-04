
const Input = ({ tempTable, changeHandler, i, j }) => {

  const handler = (e) => {
    changeHandler(e);
    console.log()
  };

  return (
    <input
      type="number"
      id={`${i}${j}`}
      key={`${i}${j}`}
      min="1"
      max="9"
      step="1"
      className={`row${i} col${j}`}
      value={tempTable[i][j] ? tempTable[i][j] : ""}
      onChange={handler}
      onWheel={(e) => e.target.blur()}
    />
  );
};

export default Input;
