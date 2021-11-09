export function getPageCount(totalRecords, dataLimit) {
  if (totalRecords) {
    let totalCountPage = 0;
    let tempCount = totalRecords / dataLimit;
    if (tempCount < 0) {
      totalCountPage = 1;
      return totalCountPage;
    } else {
      totalCountPage = Math.ceil(tempCount);
      return totalCountPage;
    }
  }
}

export function fetchProjectFromUtils(props) {
  const { id, fetchProjects } = props;
  const projectParameters = {
    id,
    from: "allActiveInactive"
  };
  fetchProjects(projectParameters);
}
