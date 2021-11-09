import Colors from "../common/colors";

export const menuStyles = {
  menuIconStyle: {
    cursor: "default",
    fontSize: "20px",
    paddingTop: "2px",
    color: Colors.whiteColor,
  },
  menuDivStyle: {
    display: "flex",
    alignItems: "center", ///// ajay css
    flexDirection: "row",
    width: "100%",
  },
};

export function fetchCompanyData(props) {
  const { requestData, company_id } = props;
  let paramters = new FormData();
  const payload = {
    company_id,
  };
  paramters.append("params", JSON.stringify(payload));
  paramters.append("type", "getTanentData");
  paramters.append("command", "getCompanyData");
  const params = {
    id: "PRODUCT_COMPANY_DATA_ID",
    api: {
      body: paramters,
    },
    // typeofQuery: "login",
  };

  requestData(params);
}
