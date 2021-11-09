import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import GroupDropdownList from "../widgets/GroupDropDownList";
import {
  clearComponentState,
  updateComponentState,
  deleteComponentState,
} from "../../actions/component.actions";
import {
  fetchProjectsDashboard,
  clearProjects,
} from "../../actions/projects.actions";
import {
  fetchReport
} from "../../actions/report.actions.js";
import {
  APP_ID,
  APP_EDIT_ENTRY_ID,
  APP_DUPLICATE_ENTRY_ID,
  DASHBOARD_WEEK_DATE,
  UPDATE_DASHBOARD,
  DASHBOARD_SHOULD_UPDATE,
  APP_NEW_ENTRY,
  SNACKBAR_ID,
  SNACKBAR_SHOW,
  MIN_WINDOW,
  CLOSE_WINDOW,
  DEFAULT_OPTION,
  DATE_FORMAT,
  ERROR_STR,
} from "../../constants/app.constants";
import {
  fetchSprintsAndTasksList,
  fetchSubTasksList,
  fetchEntryDataFromUtils,
  get_time_diff,
  capIT,
  addNewEntry,
  updateEntry,
  errorMessageStyle,
  getnewEntryStr,
  validateTimePicker,
  validateTimeBillableHrs,
  getAllPropsForComponent,
  fetchProjectList,
} from "./newEntry.utils";
import { getMomemt24hTime } from "../utils/calender.utils";
import { fetchSprints, clearSprints } from "../../actions/sprints.actions";
import { fetchTasks, clearTasks } from "../../actions/tasks.actions";
import { fetchSubTasks, clearSubTasks } from "../../actions/subTasks.actions";
import { updateData, requestData, clearData } from "../../actions/data.actions";
import { dateFormatter } from "../utils/calender.utils";
import TextField from "../widgets/TextField";
import DropdownList from "../widgets/DropdownList";
import DatePicker from "../widgets/DatePicker";
import Button from "../widgets/Button";
import TextArea from "../widgets/TextArea";
import SpanLabel from "../widgets/SpanLabel";
import Snackbar from "../widgets/Snackbar";
import Icon from "../widgets/Icon";
import {
  RECORD_DIALOG_MSG,
  NEW_ENTRY_DLGS,
} from "../../constants/dialog.constants";
import "./newEntry-div.css";
import {
  minimizeIcon,
  maximizeIcon,
  closeIconNewEntry,
  getNewEntryHeader,
} from "../utils/ui.utils";
import { isEmpty } from "../utils/common.utils";
import Colors from "../common/colors";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { fetchReportDashboard } from "../pageContent/MyEntries/MyEntries.utils";
const moment = extendMoment(Moment);

class NewEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minClassName: "",
      maximizeClass: " pr-hide ",
      minimizeClass: "",
      description: "",
      start_time: moment().format("hh:mm A"),
      end_time: "06:00 PM",
      estimated_hrs: "0.00",
      bilable_hrs: "0.00",
      ref_no: "",
      sub_ref_no: "",
      pro_id: "",
      billing_date: dateFormatter(moment(), "yyyy-MM-dd"),
      task_id: "",
      sub_task_id: "",
      sprint_id: "",
      sprint_ref_no: "",
      projectsData: "",
      sprintsData: "",
      tasksData: "",
      subTasksData: "",
      selectedProject: "",
      selectedSprint: "",
      selectedTask: "",
      selectedSubTask: "",
      isDatePickerOpen: false,
      errorMessage: "",

      isEditEntry: false,
      isDuplicateEntry: false,
      isTaskMandate: "0",
      isSprintMandate: "0",
      snackIsOpen: false,
      snackMessage: "",
      isToFormClose: true,
      isBillableTocalculate: true,
      isBillableProject: "",
      newEntryStr: "",
      isDisable_billable: false,
      lock_date: "",
    };

    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }
  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus();
  }

  componentWillMount() {
    const {
      id,
      requestData,
      updateComponentState,
      appState,
      fetchProjectsDashboard,
    } = this.props;
    updateComponentState(UPDATE_DASHBOARD, DASHBOARD_SHOULD_UPDATE, "NO");

    const selectedDate = appState.get(DASHBOARD_WEEK_DATE, ERROR_STR);

    if (selectedDate !== ERROR_STR) {
      this.setState({
        billing_date: selectedDate,
        newEntryStr: getnewEntryStr(selectedDate),
      });
    }

    const billingID = appState.get(
      APP_EDIT_ENTRY_ID,
      APP_DUPLICATE_ENTRY_ID,
      ""
    );

    if (billingID) {
      this.setState(
        {
          selectedSprint: "",
          selectedTask: "",
          selectedSubTask: "",
        },
        () => {
          fetchProjectList({ id, fetchProjectsDashboard });
          fetchEntryDataFromUtils({ id, requestData, billingID });
        }
      );
    } else {
      fetchProjectList({ id, fetchProjectsDashboard });
      let dataGetTime = get_time_diff(
        this.state.start_time,
        this.state.end_time
      );

      this.setState({ estimated_hrs: dataGetTime.estimated_hrs.toFixed(2) });
    }
  }

  componentWillUnmount() {
    const {
      id,
      clearData,
      clearProjects,
      clearSprints,
      clearTasks,
      clearSubTasks,
    } = this.props;
    clearData({ id });
    clearProjects({ id });
    clearSprints({ id });
    clearTasks({ id });
    clearSubTasks({ id });
  }

  componentWillReceiveProps(nextProps) {
    const { appState } = this.props;
    const {
      tasksDataState,
      projectsDataState,
      entryDataState,
      sprintsDataState,
      subTasksDataState,
    } = nextProps;

    const billingID = appState.get(APP_EDIT_ENTRY_ID, "");
    const isDuplicate = appState.get(APP_DUPLICATE_ENTRY_ID, false);
    let stateNameForNewEntry = "isEditEntry";
    if (isDuplicate === true) {
      stateNameForNewEntry = "isDuplicateEntry";
    }

    const close_window = nextProps.appState.get(CLOSE_WINDOW, ERROR_STR);
    if (close_window === true) {
      this.closeNewEntry(false);
    }

    if (billingID) {
      if (this.props.entryDataState !== entryDataState) {
        const apiData = entryDataState.apiData;
        const momentObj = moment(apiData.billing_date);
        this.setState({
          newEntryStr: getnewEntryStr(momentObj),
          description: apiData.description,
          start_time: apiData.start_time,
          end_time: apiData.end_time,
          estimated_hrs: apiData.estimated_hrs,
          bilable_hrs: apiData.bilable_hrs,
          ref_no: apiData.ref_no,
          sub_ref_no: apiData.sub_ref_no,
          pro_id: apiData.pro_id,
          billing_date: momentObj,
          task_id: apiData.task_id,
          sub_task_id: apiData.sub_task_id,
          sprint_id: apiData.sprint_id,
          sprint_ref_no: apiData.sprint_ref_no,
          isBillableProject: apiData.is_billable,
          isDisable_billable: apiData.is_billable === "0" ? true : false,
          selectedProject: apiData.pro_id,
          lock_date: apiData.lock_date,
          selectedSprint: apiData.sprint_id,
          selectedTask: apiData.task_id,
          selectedSubTask: apiData.sub_task_id,
          isTaskMandate: apiData.is_task_mandate,
          isSprintMandate: apiData.is_sprint_mandate,
          projectsData: projectsDataState,
          isDatePickerOpen: false,
          [stateNameForNewEntry]: true,
          sprintsData: apiData[1],
          tasksData: apiData[0],
          subTasksData: apiData[2],
        });
      }
    }

    if (this.props.projectsDataState !== projectsDataState) {
      this.setState(
        {
          projectsData: projectsDataState,
        },
        () => {
          if(projectsDataState.apiData){
            projectsDataState.apiData.forEach((element) => {
              if (this.state.selectedProject === element.id) {
                this.setState({
                  isTaskMandate: element.is_task_mandate,
                  isSprintMandate: element.is_sprint_mandate,
                });
              }
            });
          }

        }
      );
    }

    if (this.props.sprintsDataState !== sprintsDataState) {
      this.setState({ sprintsData: sprintsDataState });
    }

    if (this.props.tasksDataState !== tasksDataState) {
      this.setState({ tasksData: tasksDataState });
    }

    if (this.props.subTasksDataState !== subTasksDataState) {
      this.setState({ subTasksData: subTasksDataState });
    }
  }




  submitNewEntry = () => {
    if (isEmpty(this.state.bilable_hrs)) {
      this.setState({ bilable_hrs: 0 }, () => {
        this.newEntry();
      });
    } else this.newEntry();
  };

  getDataForDate()
  {
    const { fetchReport, updateComponentState, newEntryProps } = this.props;

    const fetchProps = {
      id: "NewEntryData",
      fetchReport,
      updateComponentState
    }

    const reportProps = {
      ...newEntryProps,
      selectedStartDateDashBoard: this.state.billing_date
    }

   return fetchReportDashboard(fetchProps,reportProps).then((response)=>{
    
    if(response && response.apiData)
    {
      return response.apiData;
    }else
    {
      return null;
    } 
  })
  }

  checkTimeOverlap(
    startTime,
    endTime,
    currentTableData,
    billingID,
    currentBillingDate
  ) {
    const beforeTime = getMomemt24hTime(startTime);
    const afterTime = getMomemt24hTime(endTime);

    const currentRange = moment.range([beforeTime, afterTime]);


    if (
      currentTableData &&
      this.props.mainPage &&
      this.props.mainPage === "Reports"
    ) {
      let isOverLap = false
      currentTableData.forEach((row) => {
        if (
          row.billing_date &&
          moment(row.billing_date, "YYYY-MM-DD").isSame(currentBillingDate)
        ) {
          const enteredBeforeTime = getMomemt24hTime(row.start_time);
          const enteredAfterTime = getMomemt24hTime(row.end_time);
          var rowRange = moment.range([enteredBeforeTime, enteredAfterTime]);
          if (currentRange.overlaps(rowRange) && billingID !== row.bill_id) {
            isOverLap = true
              return;
          }
        }
      });
      if(isOverLap)
          {
            this.setState({ errorMessage: NEW_ENTRY_DLGS.timeOverlap });
          }else
          {
            this.validateNSubmit()
          }
    } else {
    this.getDataForDate().then((response)=>{
      if(response && response.apiData && response.apiData.ogData)
      {
        const dataByDate = response.apiData.ogData;
        let isOverLap = false
          dataByDate.forEach((row) => {
            const enteredBeforeTime = getMomemt24hTime(row.start_time);
            const enteredAfterTime = getMomemt24hTime(row.end_time);
            var rowRange = moment.range([enteredBeforeTime, enteredAfterTime]);
            if (currentRange.overlaps(rowRange) && billingID !== row.bill_id) {
              isOverLap = true
              return;
            }
          });
          if(isOverLap)
          {
            this.setState({ errorMessage: NEW_ENTRY_DLGS.timeOverlap });
          }else
          {
            this.validateNSubmit()
          }
          
      }else if(response && response.apiData === null){
        this.validateNSubmit()
      }
     })
    }
  }

  newEntry() {
    const { appState, currentTableData } = this.props;
    const startTime = this.state.start_time.toString().trim();
    const endTime = this.state.end_time.toString().trim();
    let billingID = appState.get(APP_EDIT_ENTRY_ID, "");
    if (billingID && appState.get(APP_DUPLICATE_ENTRY_ID) === true) {
      billingID = "";
    }

      this.checkTimeOverlap(
        startTime,
        endTime,
        currentTableData,
        billingID,
        this.state.billing_date
      );
  }

  validateNSubmit() {
    const { pro_id, sprint_id, task_id } = this.state;
    const { appState, updateComponentState, currentTableData } = this.props;

    const startTime = this.state.start_time.toString().trim();
    const endTime = this.state.end_time.toString().trim();

    let billingID = appState.get(APP_EDIT_ENTRY_ID, "");
    if (billingID && appState.get(APP_DUPLICATE_ENTRY_ID) === true) {
      billingID = "";
    }

    const billDate = this.state.billing_date.format(DATE_FORMAT);
    const lockDate = moment(this.state.lock_date).format(DATE_FORMAT);

    if (moment(billDate, DATE_FORMAT) <= moment(lockDate, DATE_FORMAT)) {
      this.setState({ errorMessage: NEW_ENTRY_DLGS.validationLock });
    } else if (validateTimePicker(startTime) === false) {
      this.setState({ errorMessage: NEW_ENTRY_DLGS.validationStrtTime });
    } else if (validateTimePicker(endTime) === false) {
      this.setState({ errorMessage: NEW_ENTRY_DLGS.validationFinishTime });
    } else if (
      parseFloat(this.state.bilable_hrs) > parseFloat(this.state.estimated_hrs)
    ) {
      this.setState({ errorMessage: NEW_ENTRY_DLGS.validationBillDuration });
    } else if (
      validateTimeBillableHrs(this.state.bilable_hrs.toString().trim()) ===
      false
    ) {
      this.setState({ errorMessage: NEW_ENTRY_DLGS.validationBillable });
    } else if (
      parseFloat(this.state.bilable_hrs) > 12 ||
      parseFloat(this.state.estimated_hrs) > 12
    ) {
      this.setState({ errorMessage: NEW_ENTRY_DLGS.validationStrtFinishTime });
    } else if (
      this.state.isSprintMandate === "1" &&
      (sprint_id === DEFAULT_OPTION || isEmpty(sprint_id) || sprint_id === "0")
    ) {
      this.setState({ errorMessage: NEW_ENTRY_DLGS.validationSprint });
    } else if (
      this.state.isTaskMandate === "1" &&
      (task_id === DEFAULT_OPTION || isEmpty(task_id) || task_id === "0")
    ) {
      this.setState({ errorMessage: NEW_ENTRY_DLGS.validationTask });
    } else {
      if (!isEmpty(pro_id) && pro_id !== DEFAULT_OPTION) {
        if (billingID) {
          updateEntry(
            billingID,
            this.props,
            this.state,
            this.props.mainPage
          ).then((response) => {
            if (response === true) {
              updateComponentState(SNACKBAR_ID, SNACKBAR_SHOW, {
                showSnackBar: true,
                snackMessage: RECORD_DIALOG_MSG.update.success,
              });
              this.updateStateAndRedux();
            } else {
              this.setState({
                snackIsOpen: true,
                snackMessage: RECORD_DIALOG_MSG.update.fail,
                isToFormClose: false,
              });
            }
          });
        } else {
          addNewEntry(this.props, this.state, this.props.mainPage).then(
            (response) => {
              // console.log("response", response);
              if (response === true) {
                updateComponentState(SNACKBAR_ID, SNACKBAR_SHOW, {
                  showSnackBar: true,
                  snackMessage: RECORD_DIALOG_MSG.add.success,
                });
                this.updateStateAndRedux();
              } else {
                this.setState({
                  snackIsOpen: true,
                  snackMessage: RECORD_DIALOG_MSG.add.fail,
                  isToFormClose: false,
                });
              }
            }
          );
        }
      } else {
        this.setState({ errorMessage: NEW_ENTRY_DLGS.validationProject });
      }
    }
  }

  updateStateAndRedux() {
    const { isToFormClose } = this.state;
    if (isToFormClose === true) {
      this.closeNewEntry(false);
    }
  }

  onClickTimeFields = (id) => {
    this.setState({ [id]: moment().format("hh:mm A") }, () => {
      if (
        id === "start_time" &&
        validateTimePicker(this.state.start_time.toString().trim()) === false
      ) {
        this.setState({ errorMessage: NEW_ENTRY_DLGS.validationStrtTime });
      } else if (
        id === "end_time" &&
        validateTimePicker(this.state.end_time.toString().trim()) === false
      ) {
        this.setState({ errorMessage: NEW_ENTRY_DLGS.validationFinishTime });
      } else if (
        validateTimePicker(this.state.start_time.toString().trim()) === true &&
        validateTimePicker(this.state.end_time.toString().trim()) === true
      ) {
        let dataGetTime = get_time_diff(
          this.state.start_time,
          this.state.end_time
        );
        this.setState({
          estimated_hrs: dataGetTime.estimated_hrs.toFixed(2),
          bilable_hrs: dataGetTime.billable_hrs.toFixed(2),
          errorMessage: "",
        });
      }
    });
  };

  callForSprintAndTasks() {
    this.setState(
      {
        sprint_id: "",
        task_id: "",
        sub_task_id: "",
        sprintsData: "",
        tasksData: "",
        subTasksData: "",
        selectedSprint: "",
        selectedTask: "",
        selectedSubTask: "",
      },
      () => {
        const { pro_id, sprint_id } = this.state;
        const { id, fetchSprints, fetchTasks } = this.props;
        if (pro_id !== DEFAULT_OPTION) {
          fetchSprintsAndTasksList(pro_id, sprint_id, {
            id,
            fetchSprints,
            fetchTasks,
          });
        }
      }
    );
  }

  callForTasksOnly() {
    const { pro_id, sprint_id } = this.state;
    const { id, fetchSprints, fetchTasks } = this.props;
    if (sprint_id !== DEFAULT_OPTION) {
      this.setState(
        {
          task_id: "",
          sub_task_id: "",
          tasksData: "",
          subTasksData: "",
          selectedTask: "",
          selectedSubTask: "",
        },
        () => {
          fetchSprintsAndTasksList(pro_id, sprint_id, {
            id,
            fetchSprints,
            fetchTasks,
          });
        }
      );
    }
  }

  callForSubTasks() {
    const { task_id } = this.state;
    const { id, fetchSubTasks } = this.props;
    if (task_id !== DEFAULT_OPTION) {
      fetchSubTasksList(task_id, { id, fetchSubTasks });
    } else {
      this.setState({
        sub_task_id: "",
        subTasksData: "",
        selectedSubTask: "",
      });
    }
  }

  setProInfo(
    bilable_hrs,
    isBillableTocalculate,
    isDisable_billable,
    allDataObject
  ) {
    this.setState(
      {
        bilable_hrs,
        isBillableTocalculate,
        errorMessage: "",
        isDisable_billable,
      },
      () => {
        if (!isEmpty(allDataObject)) {
          this.setState(
            {
              isTaskMandate: allDataObject.is_task_mandate,
              isSprintMandate: allDataObject.is_sprint_mandate,
              lock_date: allDataObject.lock_date,
            },
            () => {
              this.callForSprintAndTasks();
            }
          );
        } else {
          this.callForSprintAndTasks();
        }
      }
    );
  }

  setSprintInfo(sprint_ref_no) {
    this.setState(
      {
        ref_no: "",
        sub_ref_no: "",
        sprint_ref_no,
      },
      () => {
        this.callForTasksOnly();
      }
    );
  }

  setTaskInfo(ref_no) {
    this.setState({ ref_no, sub_ref_no: "" }, () => {
      this.callForSubTasks();
    });
  }

  onChangeFieldValues = (
    id,
    updatedValue,
    updatedBillable,
    updatedName,
    allDataObject
  ) => {
    if (id === "billing_date") {
      this.setState({ isDatePickerOpen: false });
      const selectedDate = updatedValue;
      this.setState({ newEntryStr: getnewEntryStr(selectedDate) });
    }

    if (id === "pro_id") {
      this.setState(
        {
          ref_no: "",
          sprint_ref_no: "",
          sub_ref_no: "",
          isBillableProject: "",
          [id]: updatedValue,
        },
        () => {
          if (updatedBillable && updatedBillable === "0") {
            this.setProInfo("0.00", false, true, allDataObject);
          } else if (updatedBillable && updatedBillable === "1") {
            const bilHrs = this.state.estimated_hrs.toString().trim();
            this.setProInfo(bilHrs, true, false, allDataObject);
          } else if (updatedValue === DEFAULT_OPTION) {
            this.setState(
              {
                bilable_hrs: "0.00",
                isBillableTocalculate: false,
                errorMessage: "",
                isTaskMandate: "0",
                isSprintMandate: "0",
              },
              () => {
                this.callForSprintAndTasks();
              }
            );
          }
        }
      );
    }

    if (id === "task_id") {
      this.setState({ [id]: updatedValue }, () => {
        if (allDataObject) {
          this.setTaskInfo(allDataObject.task_ref_no);
        } else {
          this.setTaskInfo("");
        }
      });
    } else if (id === "sprint_id") {
      this.setState({ [id]: updatedValue }, () => {
        if (allDataObject) {
          this.setSprintInfo(allDataObject.sprint_ref_no);
        } else {
          this.setSprintInfo("");
        }
      });
    } else if (id === "sub_task_id") {
      this.setState({ [id]: updatedValue }, () => {
        if (allDataObject) {
          this.setState({ sub_ref_no: allDataObject.task_ref_no });
        } else {
          this.setState({ sub_ref_no: "" });
        }
      });
    }

    if (id === "start_time" || id === "end_time") {
      this.setState({ [id]: updatedValue.toUpperCase() });
    } else {
      this.setState({ [id]: updatedValue });
    }
  };

  onBlurFieldValues = (id, updatedValue) => {
    if (this.state.billing_date > moment()) {
      this.setState({ errorMessage: NEW_ENTRY_DLGS.validationDate });
    } else if (
      id === "start_time" &&
      validateTimePicker(this.state.start_time.trim()) === false
    ) {
      this.setState({ errorMessage: NEW_ENTRY_DLGS.validationStrtTime });
    } else if (
      id === "end_time" &&
      validateTimePicker(this.state.end_time.trim()) === false
    ) {
      this.setState({ errorMessage: NEW_ENTRY_DLGS.validationFinishTime });
    } else {
      this.setState({ errorMessage: "" });

      if (id === "start_time" || id === "end_time") {
        let trimFirst = this.state.start_time.trim();
        let trimSecond = this.state.end_time.trim();
        let time_diff_obj;
        if (trimFirst.length === 7 || trimFirst.length === 8) {
          if (trimSecond.length === 7 || trimSecond.length === 8) {
            let capitlObj = capIT(trimFirst, trimSecond);
            if (capitlObj && capitlObj.update === true) {
              time_diff_obj = get_time_diff(
                capitlObj.new_start_time,
                capitlObj.new_end_time
              );
              if (time_diff_obj) {
                this.setState({
                  bilable_hrs: time_diff_obj.billable_hrs.toFixed(2),
                  estimated_hrs: time_diff_obj.estimated_hrs.toFixed(2),
                });
              }
            } else if (capitlObj && capitlObj.update === false) {
              time_diff_obj = get_time_diff(
                this.state.start_time,
                this.state.end_time
              );
              if (time_diff_obj) {
                if (
                  time_diff_obj.billable_hrs < 0 ||
                  time_diff_obj.billable_hrs > 12
                ) {
                  this.setState({
                    errorMessage: NEW_ENTRY_DLGS.validationStrtFinishTime,
                    bilable_hrs: time_diff_obj.billable_hrs.toFixed(2),
                    estimated_hrs: time_diff_obj.estimated_hrs.toFixed(2),
                  });
                } else {
                  this.setState({
                    bilable_hrs: time_diff_obj.billable_hrs.toFixed(2),
                    estimated_hrs: time_diff_obj.estimated_hrs.toFixed(2),
                  });
                }
              }
            }
          }
        }

        const { isBillableTocalculate, isBillableProject } = this.state;
        if (isBillableTocalculate === false || isBillableProject === "0") {
          this.setState({ bilable_hrs: "0.00" });
        }
      }
    }
  };

  onDatePickerIconClick = () => {
    this.setState({ isDatePickerOpen: !this.state.isDatePickerOpen });
  };

  callMiniMaximize(isMinimize) {
    this.setState({
      minClassName: isMinimize ? "pr-minWindow" : "",
      maximizeClass: isMinimize ? "" : " pr-hide ",
      minimizeClass: isMinimize ? " pr-hide " : "",
    });
    const { updateComponentState } = this.props;
    updateComponentState(APP_ID, MIN_WINDOW, isMinimize ? true : false);
  }

  closeNewEntry() {
    this.setState({
      description: "",
      start_time: "",
      end_time: "",
      estimated_hrs: "0.00",
      bilable_hrs: "0.00",
      ref_no: "",
      sub_ref_no: "",
      pro_id: "",
      billing_date: "",
      task_id: "",
      sub_task_id: "",
      sprint_id: "",
      sprint_ref_no: "",
      projectsData: "",
      sprintsData: "",
      tasksData: "",
      subTasksData: "",
      selectedProject: "",
      selectedSprint: "",
      selectedTask: "",
      selectedSubTask: "",
      isDatePickerOpen: false,
    });

    const { updateComponentState, deleteComponentState } = this.props;
    updateComponentState(APP_ID, APP_NEW_ENTRY, false);
    deleteComponentState(APP_ID);
  }

  onSnackClose() {
    this.setState({ snackIsOpen: false }, () => {
      this.updateStateAndRedux();
    });
  }

  render() {
    const props = getAllPropsForComponent();
    const {
      minClassName,
      isDuplicateEntry,
      isEditEntry,
      newEntryStr,
    } = this.state;

    const onClickMaximize = () => this.callMiniMaximize(false);
    return (
      <div className={minClassName + "main-container"}>
        <div className={minClassName + " pr-inner-div pr-center"}>
          <div className="header-level">
            {getNewEntryHeader({
              minClassName,
              isDuplicateEntry,
              isEditEntry,
              newEntryStr,
              onClickMaximize,
            })}

            <div
              className="col-inner-div-header-right"
              style={{
                paddingTop: "4px",
                textAlign: "right",
                display: "inline-flex",
              }}
            >
              {minimizeIcon(this.state.minimizeClass, () =>
                this.callMiniMaximize(true)
              )}
              {maximizeIcon(this.state.maximizeClass, () =>
                this.callMiniMaximize(false)
              )}

              {closeIconNewEntry(() => this.closeNewEntry())}

              <Snackbar
                snackIsOpen={this.state.snackIsOpen}
                snackMessage={this.state.snackMessage}
                onSnackClose={() => this.onSnackClose()}
              />
            </div>
          </div>
          <div
            className={"pr-container " + this.state.minimizeClass}
            id="newEntry"
          >
            {!isEmpty(this.state.errorMessage) ? (
              <div className="error-right-div" id="errDiv">
                <span style={{ color: "#FF0000" }}>
                  {this.state.errorMessage}
                </span>
              </div>
            ) : null}
            <div className="pr-row">
              <div className="pr-col-3">
                <div className="pr-top-level-section1-comp">
                  <SpanLabel {...props.spanLabel} data="Date" />
                  <div className="date-pcker-field-div">
                    <DatePicker
                      value={this.state.billing_date}
                      isOpen={this.state.isDatePickerOpen}
                      id="billing_date"
                      onChange={this.onChangeFieldValues}
                      className="date-picker"
                      isEnablePastDates={true}
                    />
                  </div>
                </div>
              </div>

              <div className="pr-col-3">
                <div className="pr-top-level-section1-comp">
                  <SpanLabel {...props.spanLabel} data="Start" />
                  <TextField
                    id="start_time"
                    data={this.state.start_time}
                    onChange={this.onChangeFieldValues}
                    onBlur={this.onBlurFieldValues}
                    classNames="pr-txtfield-sm"
                    ref={this.textInput}
                  />

                  <div className="time-picker-div">
                    <Icon
                      icon="schedule"
                      style={{
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                      title="Start Time"
                      onClick={(e) => this.onClickTimeFields("start_time")}
                    />
                  </div>
                </div>

                <div className="pr-top-level-section1-comp">
                  <SpanLabel {...props.spanLabel} data="Finish" />
                  <TextField
                    classNames="pr-txtfield-sm"
                    id="end_time"
                    data={this.state.end_time}
                    onBlur={this.onBlurFieldValues}
                    onChange={this.onChangeFieldValues}
                  />

                  <div className="time-picker-div">
                    <Icon
                      icon="schedule"
                      style={{
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                      title="Start Time"
                      onClick={(e) => this.onClickTimeFields("end_time")}
                    />
                  </div>
                </div>
              </div>

              <div className="pr-col-3">
                <div className="pr-top-level-section1-comp">
                  <SpanLabel {...props.spanLabel} data="Duration" />
                  <TextField
                    classNames="pr-txtfield-lg"
                    id="estimated_hrs"
                    data={this.state.estimated_hrs}
                    onChange={this.onChangeFieldValues}
                    isDisable={true}
                  />
                </div>

                <div className="pr-top-level-section1-comp">
                  <SpanLabel {...props.spanLabel} data="Billable" />
                  <TextField
                    id="bilable_hrs"
                    data={this.state.bilable_hrs}
                    onChange={this.onChangeFieldValues}
                    classNames="pr-txtfield-lg"
                    isDisable={this.state.isDisable_billable} //////////13 jan 2020 ///////////////////
                  />
                </div>
              </div>
            </div>

            <div className="pr-row">
              <div className="pr-col-6">
                <div className="pr-top-level-section1-comp">
                  <SpanLabel
                    {...props.spanLabel}
                    isRequired={true}
                    data="Project"
                  />
                  <GroupDropdownList
                    id="pro_id"
                    dropDownData={this.state.projectsData}
                    onChange={this.onChangeFieldValues}
                    defaultOption="Select Project"
                    selectedID={this.state.selectedProject}
                  />
                </div>
              </div>
              <div className="pr-col-3" />
            </div>

            <div className="pr-row">
              <div className="pr-col-6">
                <div className="pr-top-level-section1-comp">
                  <SpanLabel {...props.spanLabel} data="Sprint" />
                  <DropdownList
                    id="sprint_id"
                    dropDownData={this.state.sprintsData}
                    onChange={this.onChangeFieldValues}
                    defaultOption="Select Sprint"
                    selectedID={this.state.selectedSprint}
                  />
                </div>

                <div className="pr-top-level-section1-comp">
                  <SpanLabel {...props.spanLabel} data="Task" />
                  <DropdownList
                    id="task_id"
                    dropDownData={this.state.tasksData}
                    onChange={this.onChangeFieldValues}
                    defaultOption="Select Task"
                    selectedID={this.state.selectedTask}
                  />
                </div>

                <div className="pr-top-level-section1-comp">
                  <SpanLabel {...props.spanLabel} data="Sub Task" />
                  <DropdownList
                    id="sub_task_id"
                    dropDownData={this.state.subTasksData}
                    onChange={this.onChangeFieldValues}
                    defaultOption="Select Sub Task"
                    selectedID={this.state.selectedSubTask}
                  />
                </div>
              </div>
              <div className="pr-col-3">
                <div className="pr-top-level-section1-comp">
                  <SpanLabel
                    {...props.spanLabel}
                    data="Sprint Task Reference No."
                  />
                  <TextField
                    id="sprint_ref_no"
                    data={this.state.sprint_ref_no}
                    onChange={this.onChangeFieldValues}
                    classNames="pr-txtfield-lg"
                  />
                </div>

                <div className="pr-top-level-section1-comp">
                  <SpanLabel
                    {...props.spanLabel}
                    data="Main Task Reference No."
                  />
                  <TextField
                    id="ref_no"
                    data={this.state.ref_no}
                    onChange={this.onChangeFieldValues}
                    classNames="pr-txtfield-lg"
                  />
                </div>

                <div className="pr-top-level-section1-comp">
                  <SpanLabel
                    {...props.spanLabel}
                    data="Sub Task Reference No."
                  />
                  <TextField
                    id="sub_ref_no"
                    data={this.state.sub_ref_no}
                    onChange={this.onChangeFieldValues}
                    classNames="pr-txtfield-lg"
                  />
                </div>
              </div>
            </div>

            <div className="pr-row pr-table">
              <div className="pr-col-8 pr-table-cell">
                <div className="pr-top-level-section1-comp">
                  <SpanLabel {...props.spanLabel} data="Description:" />
                  <TextArea
                    id="description"
                    {...props.textArea}
                    data={this.state.description}
                    onChange={this.onChangeFieldValues}
                    onBlur={this.onChangeFieldValues}
                    style={{ borderColor: Colors.newBgColor }}
                  />
                </div>
              </div>

              <div className="pr-col-3 pr-table-cell">
                <div
                  className="pr-top-level-section1-comp"
                  style={{ textAlign: "right" }}
                >
                  <span style={errorMessageStyle} />
                  <br />
                  <Button
                    {...props.closeButton}
                    onClick={() => this.closeNewEntry()}
                  />
                  <Button
                    className="button-submit"
                    {...props.submitButton}
                    onClick={this.submitNewEntry}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { component, projects, sprints, tasks, subTasks, data } = state;
  const id = ownProps.id;
  return {
    componentState: component.get(id, Map()),
    appState: component.get(APP_ID, Map()),

    projectsDataState: projects.getIn([id, "apiData"], null),
    sprintsDataState: sprints.getIn([id, "apiData"], null),
    tasksDataState: tasks.getIn([id, "apiData"], null),
    subTasksDataState: subTasks.getIn([id, "apiData"], null),

    isFetching: projects.getIn([id, "isFetching"], false),
    isError: projects.getIn([id, "isError"], false),
    errorData: projects.getIn([id, "errorData"], null),
    entryDataState: data.getIn([id, "apiData"], null),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    deleteComponentState,
    updateData,
    requestData,
    clearData,
    fetchProjectsDashboard,
    fetchSprints,
    fetchReport,
    fetchTasks,
    fetchSubTasks,
    clearProjects,
    clearSprints,
    clearTasks,
    clearSubTasks,
  }
)(NewEntry);
