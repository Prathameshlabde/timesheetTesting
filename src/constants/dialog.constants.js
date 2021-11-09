export const CATEGORY_DIALOG_MSG = {
  detele: {
    success: "Category deleted successfully.",
    fail: "Category cannot be deleted.",
  },
  add: {
    success: "Category added successfully.",
    fail: "Fail to add category please try again.",
  },
  update: {
    success: "Category updated successfully.",
    fail: "Fail to update category please try again.",
  },
  duplicate: "This category name is already exist.",
};
export const PROJECT_DIALOG_MSG = {
  detele: {
    success: "Project deleted successfully.",
    fail:
      "Project cannot be deleted. Billing entries associated with this project.",
  },
  add: {
    success: "Project added successfully.",
    fail: "Fail to add project please try again.",
  },
  update: {
    success: "Project updated successfully.",
    fail: "Fail to update project please try again.",
  },
  duplicate: "This project name is already exist.",
};
export const SPRINT_DIALOG_MSG = {
  detele: {
    success: "Sprint deleted successfully.",
    fail: "Sprint cannot be deleted.",
  },
  add: {
    success: "Sprint added successfully.",
    fail: "Fail to add sprint please try again.",
  },
  update: {
    success: "Sprint updated successfully.",
    fail: "Fail to update sprint please try again.",
  },
  duplicate: "Reference number for this sprint is already exist.",
};
export const SUBTASK_DIALOG_MSG = {
  detele: {
    success: "Subtask deleted successfully.",
    fail: "Subtask cannot be deleted.",
  },
  add: {
    success: "Subtask added successfully.",
    fail: "Fail to add subtask please try again.",
  },
  update: {
    success: "Subtask updated successfully.",
    fail: "Fail to update subtask please try again.",
  },
  duplicate: {
    titleExist: "Title for this Project & Parent Task is already exist.",
    refNumber: "Reference No. for this Project & Parent Task is already exist.",
    bothExist:
      "Title & Reference No. for this Project & Parent Task is already exist.",
  },
};
export const TASK_DIALOG_MSG = {
  detele: {
    success: "Task deleted successfully.",
    fail: "Task cannot be deleted.",
  },
  add: {
    success: "Task added successfully.",
    fail: "Fail to add task please try again.",
  },
  update: {
    success: "Task updated successfully.",
    fail: "Fail to update task please try again.",
  },
  duplicate: "Reference number for this project is already exist.",
};
export const RECORD_DIALOG_MSG = {
  detele: {
    success: "Record deleted successfully.",
    fail: "Record cannot be deleted.",
  },
  add: {
    success: "Record added successfully.",
    fail: "Fail to add record please try again.",
  },
  update: {
    success: "Record updated successfully.",
    fail: "Fail to update record please try again.",
  },
};
export const USER_DIALOG_MSG = {
  detele: {
    success: "User deleted successfully.",
    fail: "User cannot be deleted.",
  },
  add: {
    success: "User added successfully.",
    fail: "Fail to add user please try again.",
  },
  update: {
    success: "User updated successfully.",
    fail: "Fail to update user please try again.",
  },
  switch: {
    success: "User inactiveted successfully.",
    fail: "User can not be inactive.",
  },
  duplicate: "Username is already exist.",
  duplicateEmailId: "Email ID is already exist.",
};
export const HOLIDAY_DIALOG_MSG = {
  detele: {
    success: "Holiday deleted successfully.",
    fail: "Holiday cannot be deleted.",
  },
  add: {
    success: "Holiday added successfully.",
    fail: "Fail to add holiday please try again.",
  },
  update: {
    success: "Holiday updated successfully.",
    fail: "Fail to update holiday please try again.",
  },
  duplicate: "Holiday for this date is already exist.",
};
export const CLIENT_DIALOG_MSG = {
  detele: {
    success: "Client deleted successfully.",
    fail: "Client cannot be deleted.",
  },
  add: {
    success: "Client added successfully.",
    fail: "Fail to add client please try again.",
  },
  update: {
    success: "Client updated successfully.",
    fail: "Fail to update client please try again.",
  },
  duplicate: "Client username is already exist.",
};

export const LEAVE_DIALOG_MSG = {
  detele: {
    success: "Leave deleted successfully.",
    fail: "Leave cannot be deleted.",
  },
  add: {
    success: "Leave added successfully.",
    fail: "Fail to add Leave please try again.",
  },
  update: {
    success: "Leave updated successfully.",
    fail: "Fail to update Leave please try again.",
    partial: "Unable to update leave for ",
  },
  duplicate: "Leave for this date is already exist.",

  applicationSent: "Leave Application has been sent successfully.",
  applicationfail: "Sorry! unable to send leave application please try again.",
};

export const LEAVE_APPLICATION_DIALOG_MSG = {
  detele: {
    success: "Record deleted successfully.",
    fail: "Unable to delete record please try again.",
  },
  update: {
    success: "Status changed successfully.",
    fail: "Unable to change the status please try again.",
  },
};

export const TECHNOLOGIES_DIALOG_MSG = {
  detele: {
    success: "Technology deleted successfully.",
    fail: "Technology cannot be deleted.",
  },
  add: {
    success: "Technology added successfully.",
    fail: "Fail to add technology please try again.",
  },
  update: {
    success: "Technology updated successfully.",
    fail: "Fail to update technology please try again.",
  },
  duplicate: "Technology is already exist.",
  validation: "Please enter technology name.",
  validation_char_limit: "Technology name should be less than 60 characters.",
};

export const TEAMS_DIALOG_MSG = {
  detele: {
    success: "Team deleted successfully.",
    fail: "Team cannot be deleted.",
  },
  add: {
    success: "Team added successfully.",
    fail: "Fail to add team please try again.",
  },
  update: {
    success: "Team updated successfully.",
    fail: "Fail to update team please try again.",
  },
  duplicate: "Team is already exist.",
  validation: "Please enter team name.",
  validationemp: "Please select employees.",
  validation_char_limit: "Team name should be less than 60 characters.",
};

export const COMMON_REPORT_DLGS = {
  createTeamEmpProj: "Please create teams, projects, employees.",
};

export const TEAM_REPORT_DIALOGS = {
  validationTeam: "Please select a team.",
  validationpro: "Please select projects.",
  validationemp: "Please select employees.",
  validationproemp: "Please select projects and employees.",
  note: "Note: Inactive Projects and Employees are in red.",
};

export const CUSTOM_REPORT_NEW_DIALOGS = {
  validationTeam: "Please select a team.",
  validationpro: "Please select projects.",
  validationemp: "Please select employees.",
  validationproemp: "Please select projects and employees.",
  note: "Note: Inactive Projects and Employees are in red.",
};

export const MONTHLY_ROLLING_REPORT_DIALOGS = {
  validationTeam: "Please select a team.",
  validationemp: "Please select employees.",
  note: "Note: Inactive Employees are in red.",
};

export const LOGIN_DIALOGS = {
  invalidFRGTDetails: "Details are invalid.",
  problemSendingEmail: "There is problem sending email, please contact admin.",
  emailSuccess:
    "An email has been sent with temporary password. Kindly check your inbox.",
  fillDetailsFRGT: "Please fill the details properly.",
  accountDeactivate:
    "Your account has been deactivated,please contact administrator.",
  invalidLoginDetails: "Please enter valid login details.",
  //aditya 13 july
  blankUserName: "Please enter username.",
  blankPassword: "Please enter password.",
  blankCompanyID: "Please enter company ID.",
  blankEmailID: "Please enter email ID.",
  loginFailed: "Login failed!",
};
export const USER_PROFILE_DIALOGS = {
  imageTypeNotSupported: "Image type not supported.",
  failedToUpload: "Fail to upload image.",
  unknownError: "Something went wrong.",
  failedToDelete: "Fail to delete profile picture.",
  deleteConfirmation: "Are you sure you want to delete profile picture ?",
  changeConfirmation: "Are you sure you want to change profile picture ?",
};

export const COMPANY_PROFILE_DIALOGS = {
  ///// ajay 19 june
  imageTypeNotSupported: "Image type not supported.",
  failedToUpload: "Fail to upload image.",
  unknownError: "Something went wrong.",
  failedToDelete: "Fail to delete company profile picture.",
  deleteConfirmation: "Are you sure you want to delete company logo?",
  changeConfirmation: "Are you sure you want to change company logo?",
};

export const NEW_ENTRY_DLGS = {
  validationDate: "Please select date properly.",
  validationStrtFinishTime: "Please select correct start and finish time.",
  validationStrtTime: "Please enter correct start time (hh:mm AM/PM format)",
  validationFinishTime: "Please enter correct Finish time (hh:mm AM/PM format)",
  validationBillDuration:
    "Billable hours should be less than or equal to Duration hours.",
  validationBillable: "Please enter Billable hours properly ex.(02:50).",
  validationProject: "Please select a project.",
  validationSprint: "Please select a Sprint.",
  validationTask: "Please select a task.",
  validationLock: "Entries for the selected date are locked.",
  timeOverlap: "Time is overlapping for this entry.",
};
export const DASHBOARD_DIALOGS = {
  validationDateRange: "Date range should not exceed 31 days",
  validationEndDate: "End Date should be greater than Start Date.",
};

export const PRODUCT_VALIDATION_DLGS = {
  daysexpired1: "7 days expired",
  daysexpired2: "Demo version expired.",
  completelyExpired: "tenant completely expired",
  fetchfailed: "tenant fetch failed",
  reachedMaximumLimit:
    "You have reached maximum limit of 14days. Please buy the product.",
  notAuthorised: "You are not authorised user, please contact us.",
};

export const SUBTITLE_INFO_DLGS = {
  userEntries: "User can see his/her project entries.",
  reviewEntries: "Review your and your employee's project entries.",
  customReport: "Customized report of employees and projects.",
  detailedTeamReport: "Detailed team report of employees and projects.",
  summaryTeamReport: "Summarized team report of employees and projects.",
  monthlyRollingReport:
    "Month to month project and employee's report analysis.",
  summaryReport: "Summarized report of employees and projects.",
  referenceReport: "Reference wise report of employees and projects.",
  managementReport: "Billable and non-billable analysis.",
  defaulterList: "Day to day hours analysis with reminder.",
  taskReport: "Task wise report of employees and projects.",
};

export const API_DIALOGS = {
  validationSession: "Your session has expired.",
  validationNetwork: "Network connection error,please try again later."
};
