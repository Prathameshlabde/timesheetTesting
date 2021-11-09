import { LOADER_ID, LOADER_SHOW } from "../../../../constants/app.constants";

export function fetchLeaveApplicationsFromUtils(props, team_name) {
  const { id, requestData, updateComponentState } = props;
  updateComponentState(LOADER_ID, LOADER_SHOW, {
    showLoader: true,
  });

  let BodyParams = new FormData();

  let tempTeamName = team_name;
  if (team_name === "All") {
    tempTeamName = "";
  }
  const Payload = {
    team_name: tempTeamName,
  };

  BodyParams.append("params", JSON.stringify(Payload));
  BodyParams.append("type", "getLeaveManagement");
  BodyParams.append("command", "getAppliedLeaves"); /// ajaychawda24

  const Params = {
    id,
    api: {
      body: BodyParams,
    },
  };

  requestData(Params).then((response) => {
    console.log("response", response);
    if (response.apiData && response.apiData.isFetching === false) {
      updateComponentState(LOADER_ID, LOADER_SHOW, {
        showLoader: false,
      });
    }
  });
}
