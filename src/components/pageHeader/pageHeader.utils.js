import { SUBTITLE_INFO_DLGS } from "../../constants/dialog.constants";
import {
  USER_ENTRIES,
  SUMMARY_TEAM_REPORT,
  DETAILED_TEAM_REPORT,
  MONTHLY_ROLLING_REPORT,
  CUSTOM_REPORT,
  REFERENCE_NO_REPORT,
  REVIEW_ENTRIES,
  TASK_REPO,
  DEFAULTER_LIST,
  MANAGEMENT_REPORT,
  SUMMARY_REPORT,
} from "../../constants/app.constants";

export function getReportInfo(subtitle) {
  // if(subtitle === USER_ENTRIES)
  switch (subtitle) {
    case USER_ENTRIES:
      return {
        isReportInfo: true,
        info: SUBTITLE_INFO_DLGS.userEntries,
      };
      break;

    case SUMMARY_TEAM_REPORT:
      return {
        isReportInfo: true,
        info: SUBTITLE_INFO_DLGS.summaryTeamReport,
      };
      break;

    case DETAILED_TEAM_REPORT:
      return {
        isReportInfo: true,
        info: SUBTITLE_INFO_DLGS.detailedTeamReport,
      };
      break;

    case MONTHLY_ROLLING_REPORT:
      return {
        isReportInfo: true,
        info: SUBTITLE_INFO_DLGS.monthlyRollingReport,
      };
      break;

    case CUSTOM_REPORT:
      return {
        isReportInfo: true,
        info: SUBTITLE_INFO_DLGS.customReport,
      };
      break;

    case REFERENCE_NO_REPORT:
      return {
        isReportInfo: true,
        info: SUBTITLE_INFO_DLGS.referenceReport,
      };
      break;

    case REVIEW_ENTRIES:
      return {
        isReportInfo: true,
        info: SUBTITLE_INFO_DLGS.reviewEntries,
      };
      break;

    case TASK_REPO:
      return {
        isReportInfo: true,
        info: SUBTITLE_INFO_DLGS.taskReport,
      };
      break;

    case DEFAULTER_LIST:
      return {
        isReportInfo: true,
        info: SUBTITLE_INFO_DLGS.defaulterList,
      };
      break;

    case MANAGEMENT_REPORT:
      return {
        isReportInfo: true,
        info: SUBTITLE_INFO_DLGS.managementReport,
      };
      break;

    case SUMMARY_REPORT:
      return {
        isReportInfo: true,
        info: SUBTITLE_INFO_DLGS.summaryReport,
      };
      break;

    default:
      return {
        isReportInfo: false,
        info: "",
      };
      break;
  }
}
