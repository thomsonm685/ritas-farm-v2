import { useEffect, useState } from "react";
import { AiFillCloseCircle, AiFillCheckCircle } from "react-icons/ai";
import {
  IoArrowUndoCircle,
  IoPlaySkipForwardCircleSharp,
} from "react-icons/io5";

const QuantityInput = ({
  qty,
  weightUnit,
  classes,
  checkIfChecked,
  item,
  preCheck,
  noSkip,
  noWeight,
  name,
}) => {
  const [checkmark, setCheckmark] = useState("none");
  const [qtyInput, setQtyInput] = useState(0);
  const [finishQty, setFinishQty] = useState(false);
  const [skipOrCheck, packedAction] = useState(null);
  const [clickedClasses, setClickedClasses] = useState("");

  const increment = (e) => {
    if (e.target.classList.contains("stepUp")) {
      if (qtyInput === qty) return;
      if (qtyInput + 1 === qty) setCheckmark("inline-block");
      setQtyInput(qtyInput + 1);
    } else {
      setCheckmark("none");
      if (qtyInput === 0) return;
      setQtyInput(qtyInput - 1);
    }
  };

  const onX = (e) => {
    setClickedClasses("checkedProduct removedProduct");
    setFinishQty(true);
    setCheckmark("none");
    packedAction("remove");
    // hide inrement buttons
  };

  const onSkip = (e) => {
    setClickedClasses("checkedProduct skippedProduct");
    setFinishQty(true);
    setCheckmark("none");
    packedAction("skip");
  };

  const onCheck = (e) => {
    setClickedClasses("checkedProduct");
    setFinishQty(true);
    setCheckmark("none");
    packedAction("check");
  };

  const undo = (e) => {
    setFinishQty(false);
    if (qtyInput === qty) setCheckmark("inline-block");
    setClickedClasses("");
  };

  useEffect(() => {
    checkIfChecked();
  });

  if (preCheck === true) return <div></div>;

  return (
    <div
      className={classes + " " + clickedClasses}
      data-qty={qty}
      data-item={item}
      style={{
        alignSelf: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        maxWidth: "274px",
        width: "38%",
        maxHeight: "457px",
        height: "75vh",
        marginRight: "2%",
      }}
    >
      <div className="qtyInputContainer">
        <button
          style={{ display: finishQty ? "none" : "inline-block" }}
          type="button"
          className="inc"
          onClick={increment}
        >
          -
        </button>
        <input
          type="number"
          name="qty"
          className="qtyInput"
          value={qtyInput}
        ></input>
        <button
          style={{ display: finishQty ? "none" : "inline-block" }}
          onClick={increment}
          type="button"
          className="stepUp inc"
        >
          +
        </button>
      </div>

      {/* <div style={{background:'#38b6ff', width:'50%', padding:'5px 3px', height:'23%'}}> */}
      {!noWeight ? (
        <div className="weightContainer" data-name={name}>
          <span style={{ fontSize: "5rem" }}>{weightUnit}:</span>
          <input type="number" className="weightInput" />
        </div>
      ) : (
        ""
      )}
      {/* </div> */}

      <div className="qtyBtnsContainer">
        <button
          onClick={onX}
          className="qtyRemove qtyButton"
          style={{ display: finishQty ? "none" : "inline-block" }}
        >
          <AiFillCloseCircle size={77} color="#ff4848" />
        </button>
        {!noSkip ? (
          <button
            onClick={onSkip}
            className="qtySkip qtyButton"
            style={{ display: finishQty ? "none" : "inline-block" }}
          >
            <IoPlaySkipForwardCircleSharp size={84} color="#fbc220" />
          </button>
        ) : (
          ""
        )}
        <button
          onClick={onCheck}
          className="qtyCheck qtyButton"
          style={{ display: checkmark }}
        >
          <AiFillCheckCircle size={77} color="#71d663" />{" "}
        </button>
        <button
          onClick={undo}
          style={{ display: finishQty ? "inline-block" : "none" }}
          className="qtyUndo qtyButton"
        >
          {skipOrCheck === "remove" ? (
            <>
              <IoArrowUndoCircle size={77} color="#ff4848" />
              <p style={{ fontSize: "20px" }}>Removed</p>
            </>
          ) : skipOrCheck === "skip" ? (
            <>
              <IoPlaySkipForwardCircleSharp size={84} color="#fbc220" />
              <p style={{ fontSize: "20px" }}>Skipped</p>
            </>
          ) : (
            <>
              <IoArrowUndoCircle size={77} color="#71d663" />
              <p style={{ fontSize: "20px" }}>Packed</p>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuantityInput;
