import React from "react";
import Icon from "../widgets/Icon";
import { isEmpty } from "./common.utils";
import { Link } from "react-router";
import { spanStyleHeader, getHeaderText } from "../newEntry/newEntry.utils";

export function maximizeIcon(maximizeClass, onClickFunc) {
  return (
    <Icon
      className={maximizeClass}
      icon="crop_landscape"
      style={{
        fontSize: "28px",
        cursor: "pointer",
        color: "#192028",
      }}
      title="Maximize Window"
      onClick={onClickFunc}
    />
  );
}

export function minimizeIcon(minimizeClass, onClickFunc) {
  return (
    <Icon
      className={" minNewEntry " + minimizeClass}
      icon="minimize"
      style={{
        fontSize: "28px",
        cursor: "pointer",
        color: "#192028",
      }}
      title="Minimize Window"
      onClick={onClickFunc}
    />
  );
}

export function closeIconNewEntry(onClickFunc) {
  return (
    <Icon
      icon="close"
      style={{
        fontSize: "28px",
        cursor: "pointer",
        display: "inline-table",
        color: "#192028",
      }}
      title="Close"
      onClick={onClickFunc}
    />
  );
}

export function getNewEntryHeader(props) {
  const {
    minClassName,
    isDuplicateEntry,
    isEditEntry,
    newEntryStr,
    onClickMaximize,
  } = props;
  if (!isEmpty(minClassName)) {
    return (
      <Link
        style={{
          textDecoration: "none",
          cursor: "pointer",
          width: "100%",
        }}
        title="Maximize Window"
        onClick={onClickMaximize}
      >
        <div
          className="col-inner-div-header-left"
          style={{ paddingTop: "4px" }}
        >
          <span style={spanStyleHeader}>
            {getHeaderText({ isDuplicateEntry, isEditEntry })}
            <span className="newEntryHeaderDate">
              {" (" + newEntryStr + ")"}
            </span>
          </span>
        </div>
      </Link>
    );
  } else {
    return (
      <div className="col-inner-div-header-left" style={{ paddingTop: "4px" }}>
        <span style={spanStyleHeader}>
          {getHeaderText({ isDuplicateEntry, isEditEntry })}
          <span className="newEntryHeaderDate">{" (" + newEntryStr + ")"}</span>
        </span>
      </div>
    );
  }
}
