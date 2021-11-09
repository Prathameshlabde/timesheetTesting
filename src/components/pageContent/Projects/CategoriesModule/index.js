import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
} from "../../../../actions/component.actions.js";

import {
  CATEGORIES_MODULE_ID,
  UPDATE_CATEGORIES_MODULE,
  CATEGORIES_MODULE_SHOULD_UPDATE,
  CATEGORIES_MODULE_ID_2,
  APP_TITLE_SUBTITLE,
  TITLE_SUBTITLE_ID,
  NO_RECORDS_FOUND,
} from "../../../../constants/app.constants.js";

import { CATEGORY_DIALOG_MSG } from "../../../../constants/dialog.constants";

import "../../Dashboard/dashboard.css";
import "../../pageContent.css";

import categories_module_json from "../../../json/projects/categories_module_table.json";
import { dataAbstraction } from "../../../utils/dataAbstraction.utils.js";

import TableView from "../../../widgets/TableView/TableView.js";
import Snackbar from "../../../widgets/Snackbar";
import {
  fetchAllCategories,
  addCateroies,
  fetchCategories,
  updateCateroies,
  deleteCategories,
} from "../../../../actions/categories.actions.js";

import {
  updateData,
  requestData,
  deleteData,
} from "../../../../actions/data.actions";

import {
  fetchCategoriesFromUtils,
  deleteCategory,
  addNewCategory,
  fetchEntryDataFromUtils,
  updateCategory,
} from "./categoriesModule.utils.js";
import "../projects.css";

import SpanLabel from "../../../widgets/SpanLabel";
import TextField from "../../../widgets/TextField";
import CheckBox from "../../../widgets/CheckBox";
import Button from "../../../widgets/Button";
// import DiaglogBox from "../../../widgets/DialogBox.js";
import SearchModule from "../../../widgets/SearchModule";
import DiaglogBox from "../../../widgets/AlertBox.js";

import { getPageCount } from "../Projects.utils";

class CategoriesModule extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  state = {
    subMenuTitle: "Add New Category",
    category_name: "",
    for_task: false,
    for_sprint: false,
    buttonText: "Submit",
    isEdit: false,
    idToEdit: "",
    showdeleteDialog: false,
    validationMessage: "",
    dataLimit: 10,
    dataOffset: 0,
    totalRowsCount: 0,
    currentPage: 1,
    searchParameterKey: "",
    snackIsOpen: false,
    snackMessage: "",
    headText: "Add Category",
    sort: false,
    fieldNameToSort: "",
  };

  componentWillMount() {
    const { updateComponentState } = this.props;
    let titleSub = {
      title: "Projects",
      subtitle: "Categories",
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);

    fetchCategoriesFromUtils(this.props, this.state);
  }

  componentWillReceiveProps(nextProps) {
    const { categoriesDataState, categoriesModuleState } = nextProps;

    if (categoriesDataState !== this.props.categoriesDataState) {
      if (
        categoriesDataState &&
        categoriesDataState.apiData &&
        categoriesDataState.apiData !== true
      ) {
        const categoreisDashBoard = dataAbstraction(
          categoriesDataState.apiData.filteredData,
          categories_module_json
        );
        this.setState({
          categoryDashBoardData: categoreisDashBoard,
          totalRowsCount: parseInt(categoriesDataState.apiData.totalCount, 10),
          category_name: "",
          for_task: false,
          for_sprint: false,
          buttonText: "Submit",
          isEdit: false,
          idToEdit: "",
          subMenuTitle: "Add New Category",
          dataErrorMsg: "",
        });
      } else {
        this.setState({
          dataErrorMsg: NO_RECORDS_FOUND,
        });
      }
    }

    if (
      categoriesModuleState !== this.props.categoriesModuleState &&
      categoriesModuleState &&
      categoriesModuleState.apiData
    ) {
      let allData = categoriesModuleState.apiData;
      this.setState({
        category_name: allData.category_name,
        for_task: this.convertBinaryToBool(allData.for_task),
        for_sprint: this.convertBinaryToBool(allData.for_sprint),
        isEdit: true,
        buttonText: "Update",
        subMenuTitle: "Edit Category",
      });
    }
  }

  convertBinaryToBool(updatedValue) {
    // console.log("updatedValue :-", updatedValue);
    if (updatedValue === "0") {
      return false;
    } else {
      return true;
    }
  }

  onclickEdit = (idToEdit) => {
    this.setState({
      idToEdit: idToEdit,
      headText: "Edit Category",
    });
    fetchEntryDataFromUtils(idToEdit, this.props);
  };

  onclickDelete = (idToDelete) => {
    this.setState({
      showdeleteDialog: true,
      idToDelete: idToDelete,
    });
  };

  onClickcancelToDialog = () => {
    this.setState({
      showdeleteDialog: false,
      headText: "Add Category",
    });
  };

  onClickOkToDialog = (idToDelete) => {
    deleteCategory(idToDelete, this.props, this.state).then((response) => {
      if (response === true) {
        this.setState(
          {
            snackIsOpen: true,
            snackMessage: CATEGORY_DIALOG_MSG.detele.success,
            categoryDashBoardData: "",
          },
          () => {
            fetchCategoriesFromUtils(this.props, this.state);
          }
        );
      } else {
        this.setState({
          snackIsOpen: true,
          snackMessage: CATEGORY_DIALOG_MSG.detele.fail,
        });
      }
    });

    this.setState({
      showdeleteDialog: false,
      idToDelete: null,
    });
  };

  onChangeFieldValues = (id, updatedValue) => {
    this.setState({
      category_name: updatedValue,
    });
  };

  onClickCheckBox = (id, updatedValue) => {
    // console.log("Clicked on check Box id:-", id, "updatedValue", updatedValue);
    if (id === "task") {
      this.setState({
        for_task: updatedValue,
      });
    } else if (id === "sprint") {
      this.setState({
        for_sprint: updatedValue,
      });
    }
  };

  convertBoolToBinary(valueUpdated) {
    if (valueUpdated === true) {
      return 1;
    } else {
      return 0;
    }
  }

  submitNewEntry = () => {
    const { updateComponentState } = this.props;
    const { category_name, for_task, for_sprint, idToEdit } = this.state;

    // console.log("for_task :-", for_task, "for_sprint", for_sprint);
    // this.setState({
    //   snackIsOpen: true,
    //   snackMessage: "hello testing"
    // });

    if (this.state.category_name === "") {
      this.setState({
        validationMessage: "Please enter Category.",
      });
    } else if (this.state.category_name.length > 60) {
      this.setState({
        validationMessage: "Category name should be less than 60 characters.",
      });
    } else if (for_task === false && for_sprint === false) {
      this.setState({
        validationMessage: "Please select category used for.",
      });
    } else {
      updateComponentState(
        UPDATE_CATEGORIES_MODULE,
        CATEGORIES_MODULE_SHOULD_UPDATE,
        "YES"
      );

      if (this.state.isEdit === false) {
        addNewCategory(
          category_name,
          this.convertBoolToBinary(for_task),
          this.convertBoolToBinary(for_sprint),
          this.props,
          this.state
        ).then((response) => {
          if (response === true) {
            this.setState({
              snackIsOpen: true,
              snackMessage: CATEGORY_DIALOG_MSG.add.success,
            });
          } else if (response === "duplicate") {
            this.setState({
              snackIsOpen: true,
              snackMessage: CATEGORY_DIALOG_MSG.duplicate,
            });
          } else {
            this.setState({
              snackIsOpen: true,
              snackMessage: CATEGORY_DIALOG_MSG.add.fail,
            });
          }
        });
      } else {
        updateCategory(
          idToEdit,
          category_name,
          this.convertBoolToBinary(for_task),
          this.convertBoolToBinary(for_sprint),
          this.props,
          this.state
        ).then((response) => {
          if (response === true) {
            this.setState({
              snackIsOpen: true,
              snackMessage: CATEGORY_DIALOG_MSG.update.success,
            });
          } else if (response === "duplicate") {
            this.setState({
              snackIsOpen: true,
              snackMessage: CATEGORY_DIALOG_MSG.duplicate,
            });
          } else {
            this.setState({
              snackIsOpen: true,
              snackMessage: CATEGORY_DIALOG_MSG.update.fail,
            });
          }
        });
      }
      this.setState({
        validationMessage: "",
      });
    }
  };
  clearData = () => {
    this.setState({
      category_name: "",
      for_task: false,
      for_sprint: false,
      buttonText: "Submit",
      isEdit: false,
      headText: "Add Category",
    });
  };

  onPageChangePagination = (selectedNumber) => {
    // console.log("selected page number is:-", selectedNumber);
    let tempNumber = selectedNumber - 1;

    this.setState(
      {
        dataOffset: tempNumber * this.state.dataLimit,
        currentPage: selectedNumber,
      },
      () => {
        const { sortBy, sortType } = this.state;
        fetchCategoriesFromUtils(this.props, this.state, sortBy, sortType);
      }
    );
  };

  onSearchSubmit() {
    this.setState(
      {
        categoryDashBoardData: "",
        dataLimit: 10,
        dataOffset: 0,
        totalRowsCount: 0,
        currentPage: 1,
      },
      () => {
        fetchCategoriesFromUtils(this.props, this.state);
      }
    );
  }

  textFieldSubmit(id, updatedValue) {
    // console.log("updatedValue is:-", id, "Value :-", updatedValue);
    this.setState({
      searchParameterKey: updatedValue,
    });
  }

  onSearchCancel() {
    this.setState(
      {
        searchParameterKey: "",
        dataLimit: 10,
        dataOffset: 0,
        totalRowsCount: 0,
        currentPage: 1,
      },
      () => {
        fetchCategoriesFromUtils(this.props, this.state);
      }
    );
  }
  onSnackClose() {
    this.setState({
      snackIsOpen: false,
    });
  }

  onSort(sortBy, sortType) {
    this.setState(
      {
        categoryDashBoardData: "",
        dataLimit: 10,
        dataOffset: 0,
        totalRowsCount: 0,
        currentPage: 1,
        sortBy,
        sortType,
      },
      () => {
        fetchCategoriesFromUtils(this.props, this.state, sortBy, sortType);
      }
    );
  }

  sortData(sortBy) {
    const { sort, fieldNameToSort } = this.state;

    if (sortBy !== fieldNameToSort) {
      this.setState(
        {
          sort: false,
        },
        () => {
          if (this.state.sort === true) {
            this.setState(
              {
                sort: false,
                fieldNameToSort: sortBy,
              },
              () => {
                this.onSort(sortBy, "asc");
              }
            );
          } else {
            this.setState(
              {
                sort: true,
                fieldNameToSort: sortBy,
              },
              () => {
                this.onSort(sortBy, "desc");
              }
            );
          }
        }
      );
    } else {
      if (sort === true) {
        this.setState(
          {
            sort: false,
            fieldNameToSort: sortBy,
          },
          () => {
            this.onSort(sortBy, "asc");
          }
        );
      } else {
        this.setState(
          {
            sort: true,
            fieldNameToSort: sortBy,
          },
          () => {
            this.onSort(sortBy, "desc");
          }
        );
      }
    }
  }

  render() {
    // console.log("in render :-", this.state.for_task);
    const { currentPage } = this.state;
    let paginationObject = {
      totalPage: getPageCount(this.state.totalRowsCount, this.state.dataLimit),
      currentPage: currentPage,
      maxNumbersOnLeftRight: 4,
      onChange: this.onPageChangePagination,
    };

    return (
      <div className="page-content-category-form">
        <div className="page-content-dashboard" id={this.props.id}>
          {/* <div className="project-subTitle">{this.state.subMenuTitle}</div> */}
          <DiaglogBox
            open={this.state.showdeleteDialog}
            title="Alert"
            onCancel={this.onClickcancelToDialog}
            onConfirm={() => this.onClickOkToDialog(this.state.idToDelete)}
            button1={"Cancel"}
            button2={"Ok"}
            alertMsg="Are you sure you want to delete?"
          />
          <div
            style={{ padding: "0px 2.8% 20px" }}
            className="pr-container"
            id="newEntry"
          >
            <div className="pr-row" style={{ padding: "0px" }}>
              <h4>{this.state.headText}</h4>
            </div>
            <div className="pr-row" style={{ padding: "0px" }}>
              <div className="pr-col-4">
                <div className="left-div-category">
                  <Snackbar
                    snackIsOpen={this.state.snackIsOpen}
                    snackMessage={this.state.snackMessage}
                    onSnackClose={() => this.onSnackClose()}
                  />
                  <SpanLabel
                    data="Category	 "
                    className="categogy-label"
                    id="categoryLabel"
                    isRequired={true}
                  />
                </div>
                <div className="">
                  <TextField
                    id="category"
                    data={this.state.category_name}
                    onChange={this.onChangeFieldValues}
                    classNames="pr-txtfield-lg"
                    style={{ width: "95%" }}
                  />
                  <div className="check-box-div">
                    <div className="check-box-div-left">
                      <SpanLabel
                        data="Task"
                        className="categogy-label-check-box"
                        id="categoryLabel"
                      />

                      <CheckBox
                        id="task"
                        isCheck={this.state.for_task}
                        className="task-check"
                        onClick={this.onClickCheckBox}
                      />
                    </div>
                    <div className="check-box-div-right">
                      <SpanLabel
                        data="Sprint"
                        className="categogy-label-check-box"
                        id="categoryLabel"
                      />

                      <CheckBox
                        id="sprint"
                        isCheck={this.state.for_sprint}
                        className="task-check"
                        onClick={this.onClickCheckBox}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={this.submitNewEntry}
                    className="submit-button-category"
                    data={this.state.buttonText}
                    style={{ marginLeft: "0px" }}
                  />
                  {this.state.validationMessage !== "" ? (
                    <div className="pr-col-9" style={{ padding: "5px 0" }}>
                      <span style={{ color: "#FF0000" }}>
                        {this.state.validationMessage}
                      </span>
                    </div>
                  ) : null}

                  {this.state.isEdit === true ? (
                    <Button
                      onClick={this.clearData}
                      className="clear-button-category"
                      data="Cancel"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div
            className="dashboard-section3"
            style={{ paddingLeft: "2.9%", paddingBottom: "10px" }}
          >
            <SearchModule
              id="searchModule"
              onSubmit={() => this.onSearchSubmit()}
              onTextChange={(e, f) => this.textFieldSubmit(e, f)}
              onCancel={() => this.onSearchCancel()}
              data={this.state.searchParameterKey}
            />
          </div>
          <div className="dashboard-section4">
            {this.state.categoryDashBoardData ? (
              <TableView
                {...this.state.categoryDashBoardData}
                onclickEdt={(e) => this.onclickEdit(e)}
                onClickDel={(e) => this.onclickDelete(e)}
                paginationData={paginationObject}
                sortData={(e) => this.sortData(e)}
                sortFlag={this.state.sort}
                fieldNameToSort={this.state.fieldNameToSort}
                totalRowCount={this.state.totalRowsCount}
              />
            ) : (
              this.state.dataErrorMsg
            )}
          </div>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { component, categories } = state;
  return {
    componentState: state.component.get(ownProps.id, Map()),
    updateDashboardState: component.get(UPDATE_CATEGORIES_MODULE, Map()),
    categoriesModuleState: categories.getIn(
      [CATEGORIES_MODULE_ID_2, "apiData"],
      null
    ),
    categoriesDataState: categories.getIn(
      [CATEGORIES_MODULE_ID, "apiData"],
      null
    ),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    fetchAllCategories,
    addCateroies,
    fetchCategories,
    updateCateroies,
    deleteCategories,
    updateData,
    requestData,
    deleteData,
  }
)(CategoriesModule);
