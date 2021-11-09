import Colors from "../../../common/colors";

export const defaultStyle = {
  styleTitle: {
    display: "flex",
    textTransform: "capitalize",
    fontWeight: "bold",
  },
  styleSubtitle: {
    display: "flex",
    fontSize: "18px",
  },
  styleBody: {
    display: "flex",
    fontSize: "12px",
  },
  table: {},
  tableHeaderRow: {},
  tableRow: {
    display: "flex",
    padding: "0px 2px",
    borderBottom: `1px solid #E6EBED`,
  },
  tableRowDescription: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: Colors.whiteColor,
    borderBottom: `1px solid #E6EBED`,
  },
  ColStyle: {
    display: "table-column",
    width: "7.5%",
    padding: "5px",
  },
  ColStyleDescription: {
    display: "table-column",
    width: "100%",
    padding: "6px 10px 6px 10px",
    // height: "50px",
    backgroundColor: Colors.headerSubColor,
    // borderRadius: "3%",
  },
  buttonDiv: {
    cursor: "pointer",
  },
  spanLabel: {
    display: "block",
  },
  spanLabelNote: {
    display: "block",
    color: Colors.blueColor,
    textDecoration: "underline",
    cursor: "pointer",
  },
  headerBoldLabel: {
    fontWeight: "bold",
  },
  descriptionBotom: {
    // fontWeight: "bold",
  },
};
