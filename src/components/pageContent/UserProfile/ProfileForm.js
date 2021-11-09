import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {AiFillEdit} from '@fortawesome/fontawesome-svg-core';
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  getSubmitButton,
  setUserDataFromWebService
} from "./userProfile.utils";
import {
  clearComponentState,
  updateComponentState
} from "../../../actions/component.actions.js";
import {
  updatePersonalInfoFromUtils,
  getPersonalInfoFromUtils
} from "./userProfile.utils";
import {
  profilePersonalData,
  profileEmergencyData,
  profileEmergencyDatas,
  profileEducationData,
  profileOfficeData,
  profileEducationCompulsory
} from "./userProfileForm.constant";
import { requestData } from "../../../actions/data.actions";
import "./userProfile.css";
import cloneDeep from "lodash/cloneDeep";
import isNull from "lodash/isNull";
import Button from "../../widgets/Button";
import SpanLabel from "../../widgets/SpanLabel";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MaterialTextField from "@material-ui/core/TextField";
import { LOADER_ID, LOADER_SHOW } from "../../../constants/app.constants";
import Snackbar from "../../widgets/Snackbar";
import Colors from "../../common/colors";
let totalErrorCount = 0;
const theme = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      root: {
        "&$focused": {
          color: Colors.blueColor,
          fontWeight: "bold"
        }
      },
      focused: {},
      asterisk: {
        color: "#db3131", //krishna * chges to red
        "&$error": {
          color: "#db3131",
        },
      },
    },
    MuiInput: {
      underline: {
        "&:before": {
          borderBottom: `1px solid ` + Colors.grayColorBorder
        },
        "&:after": {
          borderBottom: `2px solid ` + Colors.blueColor
        }
      }
    }
  }
});
class ProfileForm extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired
  };

  state = {
    snackIsOpen: false,
    snackMessage: "",
    allFormData: {
      personal: cloneDeep(profilePersonalData),
      emergency: [
        cloneDeep(profileEmergencyData),
        cloneDeep(profileEmergencyDatas)
      ],
      education: [
        cloneDeep(profileEducationCompulsory),
        cloneDeep(profileEducationData),
        cloneDeep(profileEducationData)
      ],
      profile: cloneDeep(profileOfficeData)
    }
  };

  componentWillMount() {
    this.getPersonalInfo(this.props.id);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.profileData &&
      nextProps.profileData !== this.props.profileData &&
      nextProps.profileData.apiData
    ) {
      let data = nextProps.profileData.apiData;
      let allFormData = setUserDataFromWebService(data, this.state.allFormData);
      this.setState({
        allFormData
      });
    }
  }

  setSnackIsOpenAndMsg(snackIsOpen, snackMessage, funcCall) {
    this.setState({
      snackIsOpen,
      snackMessage
    });
  }

  getPersonalInfo = () => {
    const { id, requestData } = this.props;
    getPersonalInfoFromUtils({ id, requestData });
  };

  updatePersonalInfo = () => {
    const { requestData, updateComponentState } = this.props;
    updatePersonalInfoFromUtils(this.state.allFormData, { requestData }).then(
      response => {
        if (response) {
          updateComponentState(LOADER_ID, LOADER_SHOW, {
            showLoader: false
          });

          if (response === true) {
            this.getPersonalInfo();
            this.setSnackIsOpenAndMsg(
              true,
              "Profile data has been set successfully."
            );
          } else {
            this.setSnackIsOpenAndMsg(true, "Unable to set profile data.");
          }
        } else {
          updateComponentState(LOADER_ID, LOADER_SHOW, {
            showLoader: false
          });
        }
      }
    );
  };

  setEnteredValue(e, obkejtKey, rowIndex, index) {
    const { allFormData } = this.state;
    let value = e.target.value;
    let tempFormData = cloneDeep(allFormData);
    if (e.target.value !== undefined) {
      if (rowIndex !== undefined) {
        tempFormData[obkejtKey][rowIndex][index].value = value;
        this.setState({ allFormData: tempFormData });
      } else {
        tempFormData[obkejtKey][index].value = value;
        this.setState({ allFormData: tempFormData });
      }
    } else {
      return false;
    }
  }

  getTextField(obkejtKey, rowIndex, dataSingle, index) {
    return (
      <MuiThemeProvider theme={theme}>
        <MaterialTextField
          id={dataSingle.title}
          classNames={"pr-txtfield-lg"} //prathamesh 21-10-2021
          variant="outlined"            //prathamesh 21-10-2021                                    
          size="small"                 //prathamesh 21-10-2021

          label={dataSingle.title}
          onChange={e => this.setEnteredValue(e, obkejtKey, rowIndex, index)}
          value={dataSingle.value}
          error={dataSingle.isError}
          fullWidth={dataSingle.isFullWidth ? true : false}
          required={dataSingle.isRequired}
          margin="normal"
          multiline={dataSingle.type === "area" ? true : false}
          rows={dataSingle.rows}
          disabled={dataSingle.isDisable === true ? true : false}
          style={
            dataSingle.isFullWidth
              ? {}
              : dataSingle.width
                ? { width: dataSingle.width, paddingRight: 15 }
                : { width: 200, paddingRight: 15 }
          }
          InputLabelProps={{
            shrink: true
          }}
          helperText={dataSingle.isError ? dataSingle.validationMessage : null}
          type={dataSingle.type}
        />
      </MuiThemeProvider>
    );
  }

  getPersonlDataForm(obkejtKey, rowIndex, data) {
    return data.map((dataSingle, index) => {
      return this.getTextField(obkejtKey, rowIndex, dataSingle, index);
    });
  }

  getEmergencyDataForm(obkejtKey, rowIndex, data) {
    return data.map((dataSingle, index) => {
      return this.getTextField(obkejtKey, rowIndex, dataSingle, index);
    });
  }

  getEducationDataForm(obkejtKey, rowIndex, data) {
    return data.map((dataSingle, index) => {
      return this.getTextField(obkejtKey, rowIndex, dataSingle, index, true);
    });
  }

  validatePersonalData(objectKey) {
    const { allFormData } = this.state;

    allFormData[objectKey].map((data, index) => {
      if (
        (data.value !== "" &&
          data.value !== null &&
          data.validationRegex !== "" &&
          isNull(data.value.match(data.validationRegex))) ||
        ((isNull(data.value) || data.value === "") && data.isRequired === true)
      ) {
        allFormData[objectKey][index].isError = true;
        totalErrorCount += 1;
      } else {
        allFormData[objectKey][index].isError = false;
      }
      //aditya 24/07/2019
      return null;
    });

    this.setState(
      {
        allFormData
      },
      () => {
        return totalErrorCount;
      }
    );
  }

  validateAdditionaldata(objectKey) {
    const { allFormData } = this.state;
    allFormData[objectKey].map((mainArray, indexMain) => {
      mainArray.map((data, index) => {
        if (
          (data.value !== "" &&
            data.value !== null &&
            data.validationRegex !== "" &&
            isNull(data.value.match(data.validationRegex))) ||
          (data.value === "" && data.isRequired === true)
        ) {
          allFormData[objectKey][indexMain][index].isError = true;
          totalErrorCount += 1;
        } else {
          allFormData[objectKey][indexMain][index].isError = false;
        }
        //aditya 24/07/2019
        return null;
      });
      //aditya 24/07/2019
      return null;
    });

    this.setState(
      {
        allFormData
      },
      () => {
        return totalErrorCount;
      }
    );
  }

  validateAllForm() {
    return new Promise((resolve, reject) => {
      totalErrorCount = 0;
      this.validatePersonalData("personal");
      this.validatePersonalData("profile");
      this.validateAdditionaldata("emergency");
      this.validateAdditionaldata("education");
      resolve();
    });
  }

  submitProfileForm() {
    const { updateComponentState } = this.props;
    this.validateAllForm().then(() => {
      if (totalErrorCount === 0) {
        updateComponentState(LOADER_ID, LOADER_SHOW, {
          showLoader: true
        });
        this.updatePersonalInfo();
      }
    });
  }

  render() {
    const { viewOnly } = this.props;
    const { allFormData } = this.state;
    let data = allFormData;
    let viewStyle = {};
    if (viewOnly === true) {
      viewStyle = { pointerEvents: "none" };
    }
    return (
      <div style={viewStyle}>
        <div className="pr-top-level-section1-updateProfile">
          <SpanLabel
            data={"Personal Details :"}
            style={{ color: Colors.darkBlueColor, fontWeight: 400 }}
          />
          {this.getPersonlDataForm("personal", undefined, data.personal)}
          <SpanLabel
            data={"Emergency Contact Details 1 :"}
            mainDivStyle={{ marginTop: "2%" }}
            style={{ color: Colors.darkBlueColor, fontWeight: 400 }}
          />
          {this.getEmergencyDataForm("emergency", 0, data.emergency[0])}
          <SpanLabel
            data={"Emergency Contact Details 2 :"}
            mainDivStyle={{ marginTop: "2%" }}
            style={{ color: Colors.darkBlueColor, fontWeight: 400 }}
          />
          {this.getEmergencyDataForm("emergency", 1, data.emergency[1])}
          <SpanLabel
            data={"Educational Qualification :"}
            mainDivStyle={{ marginTop: "2%" }}
            style={{ color: Colors.darkBlueColor, fontWeight: 400 }}
          />
          <div>
            {this.getEducationDataForm("education", 0, data.education[0])}
            {this.getEducationDataForm("education", 1, data.education[1])}
            {this.getEducationDataForm("education", 2, data.education[2])}
          </div>

          <SpanLabel
            data={"Other Details :"}
            mainDivStyle={{ marginTop: "2%" }}
            style={{ color: Colors.darkBlueColor, fontWeight: 400 }}
          />

          {this.getEducationDataForm("profile", undefined, data.profile)}
        </div>

        {viewOnly === false ? (
          <div className="pr-top-level-section1-profile">
            <Button
              {...getSubmitButton()}
              onClick={() => this.submitProfileForm()}
              className="set-profile-button"
            />
          </div>
        ) : null}

        <Snackbar
          snackIsOpen={this.state.snackIsOpen}
          snackMessage={this.state.snackMessage}
          onSnackClose={() => this.setSnackIsOpenAndMsg(false, "")}
        />
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { data } = state;
  return {
    componentState: state.component.get(ownProps.id, Map()),
    profileData: data.getIn([ownProps.id, "apiData"], null)
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    requestData
  }
)(ProfileForm);
