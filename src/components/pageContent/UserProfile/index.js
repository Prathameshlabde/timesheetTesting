import {
  APP_TITLE_SUBTITLE,
  TITLE_SUBTITLE_ID,
  APP_BASE_URL,
  PROFILE_CHANGED_ID,
  PROFILE_URL,
  LOADER_ID,
  LOADER_SHOW,
  COMPANY_PROFILE_URL,
  COMPANY_PROFILE_CHANGED_ID,
} from "../../../constants/app.constants.js";
import {
  setDefaultProjectsfromUtils,
  fetchDefaultProjectsFromUtils,
} from "./userProfile.utils";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import { updateComponentState } from "../../../actions/component.actions.js";
import { requestData } from "../../../actions/data.actions.js";
import { fetchProjectsDashboard } from "../../../actions/projects.actions.js";
import { getDataFromCookie } from "../../utils/CheckLoginDetails";
import {
  createCookie,
  readCookie,
  isMetaProduct,
} from "../../utils/common.utils";
import { browserHistory } from "react-router";
import Icon from "../../widgets/Icon";
import Button from "../../widgets/Button";
import TextField from "../../widgets/TextField";
import SpanLabel from "../../widgets/SpanLabel";
import Snackbar from "../../widgets/Snackbar";
import DiaglogBox from "../../widgets/AlertBox.js";
import MultiSelect from "../../widgets/MultiSelect.js";
import "./userProfile.css";
import {
  USER_PROFILE_DIALOGS,
  COMPANY_PROFILE_DIALOGS,
} from "../../../constants/dialog.constants.js";
import ProfileForm from "./ProfileForm";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Colors from "../../common/colors/index.js";

class UserProfile extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  state = {
    userName: "",
    profileImage: null,
    empId: "",
    validationMsg: "",
    imageUrl: "",

    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    errorMsg: "",
    snackIsOpen: false,
    snackMessage: "",
    showDialog: false,
    dialogMessage: "",
    multipleSelectedIds: [],
    specialCase: false,
    backgroundImageURL: "",
    tabValue: 0,
    componyLogoUrl: "", /// ajay 19 june
    companyLogoImage: null, /// ajay 19 june
  };

  setValidationMsg(validationMsg) {
    this.setState({ validationMsg });
  }

  setDialogMessage(dialogMessage) {
    // console.log(this.state.dialogMessage);
    this.setState({ dialogMessage });
  }

  componentWillMount() {
    const { updateComponentState, id, fetchProjectsDashboard } = this.props;
    if (
      (getDataFromCookie().empID && getDataFromCookie().uname,
      getDataFromCookie().userName)
    ) {
      this.setState(
        {
          empId: getDataFromCookie().empID,
          userId: getDataFromCookie().uname,
          userName: getDataFromCookie().userName,
        },
        () => {
          this.webServiceToGetDefaultProjects();
          if (
            this.state.empId === "182" ||
            this.state.empId === "193" ||
            this.state.empId === "186"
          ) {
            this.setState({
              specialCase: true,
            });
          }
        }
      );
    }

    if (readCookie("imgurl")) {
      this.setState({
        imageUrl: readCookie("imgurl"),
      });
    }
    if (readCookie("companyImgurl")) {
      this.setState({
        componyLogoUrl: readCookie("companyImgurl"),
      });
    }

    let titleSub = {
      title: "User Profile",
      subtitle: "",
    };
    updateComponentState(TITLE_SUBTITLE_ID, APP_TITLE_SUBTITLE, titleSub);

    const projectParameters = {
      id,
      from: "",
    };

    fetchProjectsDashboard(projectParameters);
  }

  handleChange = (e, val) => {
    this.setState({
      tabValue: val,
    });

    if (val === 2) {
      this.webServiceToGetDefaultProjects();
    }
  };

  webServiceToGetDefaultProjects() {
    const { id, requestData } = this.props;

    fetchDefaultProjectsFromUtils({ id, requestData }, this.state.empId).then(
      (response) => {
        if (response && response !== false) {
          this.setState({
            multipleSelectedIds: response,
          });
        }
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.projectsDataState &&
      nextProps.projectsDataState !== this.props.projectsDataState &&
      nextProps.projectsDataState.apiData
    ) {
      this.setState({ projectsData: nextProps.projectsDataState.apiData });
    }
  }

  uploadfile(e) {
    let imagetypeArray = ["image/jpeg", "image/png", "image/gif", "image/bmp"];
    // console.log("uploadfile");
    var file = e.target.files[0];
    if (file) {
      if (imagetypeArray.includes(file.type)) {
        this.setState(
          {
            profileImage: file,
            validationMsg: "",
          },
          () => {
            this.setState({
              showDialog: true,
              dialogMessage: USER_PROFILE_DIALOGS.changeConfirmation,
            });
            // console.log(USER_PROFILE_DIALOGS.changeConfirmation);
          }
        );
      } else {
        this.setValidationMsg(USER_PROFILE_DIALOGS.imageTypeNotSupported);
        // console.log(USER_PROFILE_DIALOGS.imageTypeNotSupported);
      }
    }
  }

  uploadfileCompany(e) {
    const imagetypeArray = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
    ];

    const file = e.target.files[0];
    if (file) {
      if (imagetypeArray.includes(file.type)) {
        this.setState(
          {
            companyLogoImage: file,
            validationMsg: "",
          },
          () => {
            this.setState({
              showDialog: true,
              dialogMessage: COMPANY_PROFILE_DIALOGS.changeConfirmation,
            });
            // console.log(COMPANY_PROFILE_DIALOGS.changeConfirmation);
          }
        );
      } else {
        this.setValidationMsg(COMPANY_PROFILE_DIALOGS.imageTypeNotSupported);
        // console.log(COMPANY_PROFILE_DIALOGS.imageTypeNotSupported);
      }
    }
  }

  setSnackIsOpenAndMsg(snackIsOpen, snackMessage, funcCall) {
    this.setState({
      snackIsOpen,
      snackMessage,
    });
  }

  uploadImage(image, empid, userId, imageUrlOld) {
    // console.log("uploadImage");

    const { updateComponentState } = this.props;

    if (image && empid) {
      let addDataParamters = new FormData();
      const { id, requestData } = this.props;

      const payload = {
        emp_id: empid,
        user_id: userId,
        imageUrlOld: imageUrlOld,
      };
      addDataParamters.append("params", JSON.stringify(payload));
      addDataParamters.append("type", "addData");
      addDataParamters.append("fileImg", image);
      addDataParamters.append("command", "addProfilePic");

      const newEntryParams = {
        id,
        api: {
          body: addDataParamters,
        },
      };

      requestData(newEntryParams).then((response) => {
        if (response.apiData && response.apiData.apiData) {
          let finalresponse = response.apiData.apiData;

          if (finalresponse.taskOver === true) {
            this.setState(
              {
                imageUrl: finalresponse.url,
              },
              () => {
                createCookie("imgurl", finalresponse.url, 1);

                this.setState(
                  {
                    snackIsOpen: true,
                    snackMessage: "New profile picture added successfully.",
                  },

                  () => {
                    updateComponentState(
                      PROFILE_CHANGED_ID,
                      PROFILE_URL,
                      finalresponse.url
                    );

                    this.fileInput.value = "";
                  }
                );
              }
            );
          } else {
            this.setValidationMsg(USER_PROFILE_DIALOGS.failedToUpload);
            // console.log(USER_PROFILE_DIALOGS.failedToUpload);
          }
        }
      });
    } else {
      this.setValidationMsg(USER_PROFILE_DIALOGS.unknownError);
      // console.log(USER_PROFILE_DIALOGS.unknownError);
    }
  }

  uploadCompanyImage(image, empid, userId, imageUrlOld) {
    // console.log("uploadCompanyImage");
    const { updateComponentState } = this.props;
    if (image) {
      let addDataParamters = new FormData();
      const { requestData } = this.props;

      const payload = {
        imageUrlOld: image,
      };

      addDataParamters.append("params", JSON.stringify(payload));
      addDataParamters.append("type", "addData");
      addDataParamters.append("fileImg", image);
      addDataParamters.append("command", "addCompanyProfilePic");

      const newEntryParams = {
        id: "Company_profile",
        api: {
          body: addDataParamters,
        },
      };

      requestData(newEntryParams).then((response) => {
        if (response.apiData && response.apiData.apiData) {
          let finalresponse = response.apiData.apiData;
          if (finalresponse.taskOver === true) {
            this.setState(
              {
                componyLogoUrl: finalresponse.url,
              },
              () => {
                createCookie("companyImgurl", finalresponse.url, 1);

                this.setState(
                  {
                    snackIsOpen: true,
                    snackMessage: "New company logo added successfully.",
                  },
                  () => {
                    updateComponentState(
                      COMPANY_PROFILE_CHANGED_ID,
                      COMPANY_PROFILE_URL,
                      finalresponse.url
                    );

                    this.companyFileInput.value = "";
                  }
                );
              }
            );
          } else {
            this.setValidationMsg(COMPANY_PROFILE_DIALOGS.failedToUpload);
            // console.log(this.state.dialogMessage);
          }
        }
      });
    } else {
      this.setValidationMsg(COMPANY_PROFILE_DIALOGS.unknownError);
      // console.log(this.state.dialogMessage);
    }
  }

  submitPassword = () => {
    const { id, requestData } = this.props;
    const { oldPassword, newPassword, confirmPassword } = this.state;

    if (
      oldPassword.trim() === "" ||
      newPassword.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      this.setState({
        errorMsg: "Please enter required fields properly.",
      });
    } else if (newPassword.trim().length < 5) {
      this.setState({
        errorMsg: "Please enter password of min 5 character.",
      });
    } else if (newPassword !== confirmPassword) {
      this.setState({
        errorMsg: "New Password does not match with Confirm Password.",
      });
    } else {
      this.setState({
        errorMsg: "",
      });
      let addDataParamters = new FormData();

      const payload = {
        oldPassword,
        newPassword,
        confirmPassword,
      };

      addDataParamters.append("params", JSON.stringify(payload));
      addDataParamters.append("type", "updateData");
      addDataParamters.append("command", "updatePassword");

      const newEntryParams = {
        id,
        api: {
          body: addDataParamters,
        },
      };
      requestData(newEntryParams).then((response) => {
        if (response.apiData && response.apiData.apiData) {
          let finalresponse = response.apiData.apiData;
          if (finalresponse === "notMatch") {
            this.setState({
              errorMsg: "Current Password is incorrect.",
            });
          } else if (finalresponse === true) {
            this.setState(
              {
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
              },
              () => {
                this.setSnackIsOpenAndMsg(
                  true,
                  "Passwod changed successfully."
                );
              }
            );
          } else {
            this.setSnackIsOpenAndMsg(
              true,
              "Unable to change password please try again later."
            );
          }
        }
      });
    }
  };

  submitDefaultProjects = () => {
    const { id, requestData, updateComponentState } = this.props;
    const { multipleSelectedIds } = this.state;

    updateComponentState(LOADER_ID, LOADER_SHOW, {
      showLoader: true,
    });

    if (multipleSelectedIds) {
      this.setState(
        {
          errorMsg: "",
        },
        () => {
          setDefaultProjectsfromUtils(multipleSelectedIds, {
            id,
            requestData,
          }).then((response) => {
            updateComponentState(LOADER_ID, LOADER_SHOW, {
              showLoader: false,
            });

            if (response === true) {
              // this.webServiceToGetDefaultProjects();
              this.setSnackIsOpenAndMsg(
                true,
                "Default projects has been set successfully."
              );
            } else {
              this.setSnackIsOpenAndMsg(
                true,
                "Unable to set Default projects."
              );
            }
          });
        }
      );
    }
  };

  removeCompanyProfileImage(imageUrlOld) {
    // console.log("removeCompanyProfileImage");
    const { updateComponentState } = this.props;
    if (imageUrlOld) {
      let addDataParamters = new FormData();
      const { requestData } = this.props;

      const payload = {
        imageUrlOld,
      };

      addDataParamters.append("params", JSON.stringify(payload));
      addDataParamters.append("type", "removeData");
      addDataParamters.append("command", "removeCompanyProfilePic");

      const newEntryParams = {
        id: "Company_profile",
        api: {
          body: addDataParamters,
        },
      };
      requestData(newEntryParams).then((response) => {
        if (response.apiData && response.apiData.apiData) {
          let finalresponse = response.apiData.apiData;
          if (finalresponse.taskOver === true) {
            this.setState(
              {
                componyLogoUrl: finalresponse.url,
              },
              () => {
                createCookie("companyImgurl", finalresponse.url, 1);

                this.setState(
                  {
                    snackIsOpen: true,
                    snackMessage: "Company logo deleted successfully.",
                  },
                  () => {
                    updateComponentState(
                      COMPANY_PROFILE_CHANGED_ID,
                      COMPANY_PROFILE_URL,
                      null
                    );

                    this.companyFileInput.value = "";
                  }
                );
              }
            );
          } else {
            this.setValidationMsg(COMPANY_PROFILE_DIALOGS.failedToDelete);
            // console.log(this.state.dialogMessage);
          }
        } else {
          this.setValidationMsg(COMPANY_PROFILE_DIALOGS.failedToDelete);
          // console.log(this.state.dialogMessage);
        }
      });
    } else {
      this.setValidationMsg(COMPANY_PROFILE_DIALOGS.unknownError);
      // console.log(this.state.dialogMessage);
    }
  }

  removeProfileImage(empid, userId, imageUrlOld) {
    // console.log("removeProfileImage");
    const { updateComponentState } = this.props;
    if (empid) {
      let addDataParamters = new FormData();
      const { id, requestData } = this.props;
      // const { imageUrl, profileImage, empId, userId } = this.state;
      const payload = {
        emp_id: empid,
        user_id: userId,
        imageUrlOld: imageUrlOld,
      };

      addDataParamters.append("params", JSON.stringify(payload));
      addDataParamters.append("type", "removeData");
      addDataParamters.append("command", "removeProfilePic");

      const newEntryParams = {
        id,
        api: {
          body: addDataParamters,
        },
      };
      requestData(newEntryParams).then((response) => {
        if (response.apiData && response.apiData.apiData) {
          let finalresponse = response.apiData.apiData;
          if (finalresponse.taskOver === true) {
            this.setState(
              {
                imageUrl: finalresponse.url,
              },
              () => {
                createCookie("imgurl", finalresponse.url, 1);

                this.setState(
                  {
                    snackIsOpen: true,
                    snackMessage: "Profile picture deleted successfully.",
                  },
                  () => {
                    updateComponentState(
                      PROFILE_CHANGED_ID,
                      PROFILE_URL,
                      finalresponse.url
                    );

                    this.fileInput.value = "";
                  }
                );
              }
            );
          } else {
            this.setValidationMsg(USER_PROFILE_DIALOGS.failedToDelete);
            // console.log(this.state.dialogMessage);
          }
        } else {
          this.setValidationMsg(USER_PROFILE_DIALOGS.failedToDelete);
          // console.log(this.state.dialogMessage);
        }
      });
    } else {
      this.setValidationMsg(USER_PROFILE_DIALOGS.unknownError);
      // console.log(this.state.dialogMessage);
    }
  }
  onSnackClose() {
    this.setState({
      snackIsOpen: false,
    });
  }

  onClickcancelToDialog = () => {
    // console.log("onClickcancelToDialog");
    this.setState(
      {
        showDialog: false,
        dialogMessage: "",
        validationMsg: "",
      },
      () => {
        this.fileInput.value = "";
      }
    );
  };

  onClickcancelToDialogCompany = () => {
    // console.log("onClickcancelToDialogCompany");

    this.setState(
      {
        showDialog: false,
        dialogMessage: "",
        validationMsg: "",
      },
      () => {
        this.companyFileInput.value = "";
      }
    );
  };
  onClickOkToDialog = () => {
    // console.log("onClickOkToDialog");

    this.setState(
      {
        showDialog: false,
      },
      () => {
        const { imageUrl, profileImage, empId, userId } = this.state;
        if (
          this.state.dialogMessage ===
          "Are you sure you want to delete profile picture?"
        ) {
          this.removeProfileImage(empId, userId, imageUrl);
          this.setDialogMessage("");
        } else {
          this.uploadImage(profileImage, empId, userId, imageUrl);
          this.setDialogMessage("");
        }
      }
    );
  };
  onClickOkToDialogCompany = () => {
    //////ajay 19 june
    // console.log("onClickOkToDialogCompany");
    this.setState(
      {
        showDialog: false,
      },
      () => {
        const { componyLogoUrl, empid, userId, companyLogoImage } = this.state;

        if (
          this.state.dialogMessage ===
          "Are you sure you want to delete company logo?"
        ) {
          this.removeCompanyProfileImage(componyLogoUrl);
          this.setDialogMessage("");
        } else {
          this.uploadCompanyImage(
            companyLogoImage,
            empid,
            userId,
            componyLogoUrl
          );

          this.setDialogMessage("");
        }
      }
    );
  };

  removeProfilePicture = () => {
    // console.log("removeProfilePicture");
    this.setState(
      {
        dialogMessage: USER_PROFILE_DIALOGS.deleteConfirmation,
      },
      () => {
        this.setState({
          showDialog: true,
        });
      }
    );
  };

  removeCompanyPicture = () => {
    // console.log("removeCompanyPicture");

    this.setState(
      {
        dialogMessage: COMPANY_PROFILE_DIALOGS.deleteConfirmation,
      },
      () => {
        this.setState({
          showDialog: true,
        });
      }
    );
  };

  onCancel = () => {
    browserHistory.goBack();
  };

  onChangeFieldValues = (id, updatedValue, updatedValue2, updatedValue3) => {
    this.setState({
      [id]: updatedValue,
    });
  };

  setWallPaper(backgroundImageURL) {
    if (backgroundImageURL !== "") {
      createCookie("backgroundImageURL", backgroundImageURL.toString(), 60);
    }
  }

  getTextField(id, fieldType) {
    return (
      <TextField
        classNames="pr-txtfield-lg"
        id={id}
        data={this.state[id]}
        onChange={this.onChangeFieldValues}
        fieldType={fieldType}
      />
    );
  }

  onChangeMultiSelect = (id, updatedValue, updatedValue2, updatedValue3) => {
    this.setState({
      [id]: updatedValue,
    });

    let dataSelected = [];
    if (id && id !== true && id !== false) {
      id.map((obj) => {
        dataSelected.push(obj.value);
        //aditya 24/07/2019
        return null;
      });
    }

    this.setState({
      multipleSelectedIds: dataSelected,
    });
  };

  getChangePasswordBlock() {
    return (
      <div className="pr-col-4 profile-form">
        <div className={"changes-pass-form"} style={{ marginBottom: "15px" }}>
          <div className="pr-top-level-section1-profile">
            <SpanLabel data="Current Password" isRequired={true} />
            {this.getTextField("oldPassword", "password")}
          </div>
          <div className="pr-top-level-section1-profile">
            <SpanLabel data="New Password" isRequired={true} />
            {this.getTextField("newPassword", "password")}
          </div>
          <div className="pr-top-level-section1-profile">
            <SpanLabel data="Confirm Password" isRequired={true} />
            {this.getTextField("confirmPassword", "password")}
          </div>
          <div className="pr-top-level-section1-profile">
            <Button
              id="btn"
              data="Change Password"
              //aditya 24/07/2019
              // className="button-submitEntry"
              onClick={this.submitPassword}
              className="button-submitEntry-profile"
            />
            <Button
              style={{ marginLeft: "1%" }}
              onClick={() => this.onCancel()}
              className="clear-button-holiday"
              data="Cancel"
            />
          </div>

          {this.state.specialCase === true ? (
            <div className="pr-top-level-section1-profile">
              <SpanLabel data="Background Image" isRequired={false} />
              {this.getTextField("backgroundImageURL", "")}

              <Button
                style={{ marginLeft: "1%" }}
                onClick={() => this.setWallPaper(this.state.backgroundImageURL)}
                className="default-projects-button"
                data="Set"
              />
            </div>
          ) : null}
          {this.state.errorMsg !== "" ? (
            <div className="error-right-div" id="UsererrDiv">
              <span style={{ color: "#FF0000" }}>{this.state.errorMsg}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  render() {
    const { dialogMessage } = this.state;
    return (
      <div className="page-content-userprofile">
        <div className="pr-container">
          <div className="pr-row">
            <DiaglogBox
              open={this.state.showDialog}
              title="Alert"
              onCancel={this.onClickcancelToDialog}
              onConfirm={
                dialogMessage === USER_PROFILE_DIALOGS.changeConfirmation ||
                dialogMessage === USER_PROFILE_DIALOGS.deleteConfirmation
                  ? this.onClickOkToDialog
                  : dialogMessage ===
                      COMPANY_PROFILE_DIALOGS.changeConfirmation ||
                    dialogMessage === COMPANY_PROFILE_DIALOGS.deleteConfirmation
                    ? this.onClickOkToDialogCompany
                    : null
              }
              button1={"Cancel"}
              button2={"Ok"}
              alertMsg={dialogMessage}
            />
            <div className="pr-col-2" style={{ minWidth: "240px" }}>
              <div className="pr-top-level-section1-profile-pic">
                <div className="profile-image-div">
                  {this.state.imageUrl !== "" ? (
                    <img
                      src={APP_BASE_URL + this.state.imageUrl}
                      style={{ width: "207px", height: "202px" }}
                      alt={""}
                    />
                  ) : (
                    <img
                      src={APP_BASE_URL + "media/account.png"}
                      style={{ width: "206px", height: "202px" }}
                      alt={""}
                    />
                  )}
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "95%" }}>
                      <input
                        type="file"
                        name="docupload"
                        id="file"
                        onChange={(e) => this.uploadfile(e)}
                        ref={(ref) => (this.fileInput = ref)}
                        style={{ width: "177px" }}
                      />
                    </div>
                    {this.state.imageUrl !== "" ? (
                      <div>
                        <Icon
                          icon="delete"
                          style={{
                            fontSize: "20px",
                            cursor: "pointer",
                            paddingTop: "2px",
                            color: "#aaaaaa",
                          }}
                          title="Delete profile picture."
                          onClick={() => this.removeProfilePicture()}
                        />
                      </div>
                    ) : null}
                  </div>

                  {this.state.validationMsg !== "" ? (
                    <div className="error-right-div" id="UsererrDiv1">
                      <span style={{ color: "#FF0000" }}>
                        {this.state.validationMsg}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="pr-col-4">
              <div className="pr-top-level-section1-profile">
                <span className="profile-name">{this.state.userName}</span>
              </div>
            </div>
          </div>

          <div className="pr-row mobilePasswordChange">
            {this.getChangePasswordBlock()}
          </div>

          <div className="pr-userProfileTabs">
            <AppBar color="default" position="static">
              <Tabs
                TabIndicatorProps={{
                  style: { background: "#054770", color: Colors.textColor },
                }}
                value={this.state.tabValue}
                onChange={(e, val) => this.handleChange(e, val)}
              >
                <Tab label="Update Profile" />
                <Tab label="Change Password" />
                <Tab label="Set Default Projects" />
                {readCookie("role") === "superadmin" && isMetaProduct() ? (
                  <Tab label="Company Profile" />
                ) : null}
              </Tabs>
            </AppBar>
            {this.state.tabValue === 0 && (
              //user profile details
              //user profile details
              <div className="pr-row userProfileRow">
                <div className="pr-col-9 profile-form">
                  <div
                    className={"update-profile-details"}
                    style={{ marginBottom: "15px" }}
                  >
                    <ProfileForm id="USER_PROFILE_INFO_ID" viewOnly={false} />
                  </div>
                </div>
              </div>
            )}
            {this.state.tabValue === 1 && (
              //change password section

              <div className="pr-row userProfileRow">
                {this.getChangePasswordBlock()}
              </div>
            )}

            {this.state.tabValue === 2 && (
              //set default projects section
              <div className="pr-row userProfileRow">
                <div
                  className="pr-col-4"
                  style={{ padding: "5px", marginBottom: "10px" }}
                >
                  <div className="defaultProjectsMainDiv">
                    <div>
                      <MultiSelect
                        id={"defaultProjects"}
                        data={this.state.projectsData}
                        onChange={this.onChangeMultiSelect}
                        multipleSelectedId={this.state.multipleSelectedIds}
                        isSearchDropdown={true}
                      />
                      <Button
                        style={{ marginLeft: "1%" }}
                        onClick={this.submitDefaultProjects}
                        className="default-projects-button"
                        data="Set Default Projects"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {this.state.tabValue === 3 && (
              //set ompany details
              <div className="pr-row userProfileRow">
                <div style={{ padding: "5px", marginBottom: "10px" }}>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: 15,
                    }}
                  >
                    <div style={{}}>
                      <SpanLabel
                        data={"Company Logo:"}
                        style={{ color: Colors.darkBlueColor, fontWeight: 400 }}
                      />
                      <div style={{ width: "170px", height: 170 }}>
                        {this.state.componyLogoUrl !== "" ? (
                          <img
                            src={APP_BASE_URL + this.state.componyLogoUrl}
                            style={{ width: "170px", height: "170px" }}
                            alt={""}
                          />
                        ) : (
                          <img
                            src={APP_BASE_URL + "media/account.png"}
                            style={{ width: "170px", height: "170px" }}
                            alt={""}
                          />
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div style={{ width: "95%" }}>
                        <input
                          type="file"
                          name="docupload"
                          id="file"
                          onChange={(e) => this.uploadfileCompany(e)}
                          ref={(ref) => (this.companyFileInput = ref)}
                          style={{ width: "177px" }}
                        />
                      </div>
                      {this.state.componyLogoUrl !== "" ? (
                        <div>
                          <Icon
                            icon="delete"
                            style={{
                              fontSize: "20px",
                              cursor: "pointer",
                              paddingTop: "2px",
                              color: "#aaaaaa",
                            }}
                            title="Delete company profile picture."
                            onClick={() => this.removeCompanyPicture()}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pr-row">
            <div className="pr-col-9">
              <div className="pr-col-3">
                <Snackbar
                  snackIsOpen={this.state.snackIsOpen}
                  snackMessage={this.state.snackMessage}
                  onSnackClose={() => this.onSnackClose()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { component, projects } = state;
  const id = ownProps.id;
  return {
    componentState: component.get(id, Map()),
    projectsDataState: projects.getIn([id, "apiData"], null),
  };
}

export default connect(
  mapStateToProps,
  {
    updateComponentState,
    fetchProjectsDashboard,
    requestData,
  }
)(UserProfile);
