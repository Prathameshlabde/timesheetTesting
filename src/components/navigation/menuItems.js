import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Map } from "immutable";
import {
  clearComponentState,
  updateComponentState,
  deleteComponentState,
} from "../../actions/component.actions.js";
import {
  APP_TITLE_SUBTITLE,
  TITLE_SUBTITLE_ID,
  BUILD_PATH,
} from "../../constants/app.constants";
import "./navigationBar.css";
import "../pageContent/Reports/reports.css";
import { Link } from "react-router";
import { getDataFromCookie } from "../utils/CheckLoginDetails";
import main_menu from "../json/MenuAndSubmenu/menu_main.json";
import projects_submenu from "../json/MenuAndSubmenu/Submenu/submenu_project.json";
import reports_submenu from "../json/MenuAndSubmenu/Submenu/submenu_report.json";
import submenu_leave from "../json/MenuAndSubmenu/Submenu/submenu_leave.json";
import Icon from "../widgets/Icon";
import { menuStyles } from "./menuItems.utils.js";
import { isEmpty } from "../utils/common.utils.js";
import { getReportInfo } from "../pageHeader/pageHeader.utils.js";

class MenuItems extends Component {
  static propTypes = {
    id: PropTypes.string,
    componentState: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      userRole: "employee",
      selectedItem: "",
      selectedpage: "",
      hidesubmenu: "",
      hoverReports: "",
      hoverProjects: "",
      hoverLeave: "",

      hoverDashboard: "",
      hoverMyEntries: "",
      hoverClients: "",
      hoverUsers: "",
      hoverHolidays: "",
    };
  }

  componentWillReceiveProps(nextProps) {
    const selectedpage = nextProps.appState.get(APP_TITLE_SUBTITLE, false);
    this.setState({ selectedpage });
  }

  getSubMenuList = (menuItems) => {
    const listItems = menuItems.subMenu.map((item) => (
      <Link
        id={item.subMenuName}
        key={item.subMenuName}
        to={"/" + BUILD_PATH + item.linkTo}
        style={{ textDecoration: "none" }}
      >
        <li
          className="listClass-reports-subMenu"
          key={item.subMenuName}
          onClick={() => {
            this.setState({ hidesubmenu: " pr-hide-submenu" });
          }}
          title={
            getReportInfo(item.subMenuName).isReportInfo === true
              ? getReportInfo(item.subMenuName).info
              : null
          }
        >
          {item.subMenuName}
        </li>
      </Link>
    ));

    return listItems;
  };

  hoverOn = (e, menu) => {
    if (menu === "Reports" || menu === "Leave" || menu === "Projects") {
      this.setState({ ["hover" + menu]: " pr-active ", hidesubmenu: "" });
    } else {
      this.setState({ ["hover" + menu]: "", hidesubmenu: "" });
    }
  };

  hoverOff = (e, menu) => {
    if (menu === "Reports" || menu === "Leave" || menu === "Projects") {
      this.setState({ ["hover" + menu]: "" });
    } else {
      this.setState({ ["hover" + menu]: "", hidesubmenu: "" });
    }
  };

  subMenuDiv(className, menuName, jsonName, role) {
    return (
      <div
        className={className}
        onMouseEnter={(e) => this.hoverOn(e, menuName)}
        onMouseLeave={(e) => this.hoverOff(e, menuName)}
      >
        {this.getSubMenuList(jsonName[role])}
      </div>
    );
  }

  addSubMenuList(menuName, role) {
    const { hidesubmenu } = this.state;
    let repMenuStyle = "";
    let commonClassName = " submenu " + "report-menu";
    if (menuName === "Reports") {
      if (getDataFromCookie() && getDataFromCookie().role === "employee") {
        repMenuStyle = " repEmpSubMenu ";
      }
      commonClassName += " " + repMenuStyle + hidesubmenu;
      return this.subMenuDiv(commonClassName, menuName, reports_submenu, role);
    } else if (menuName === "Projects") {
      commonClassName += "-projects" + hidesubmenu;
      return this.subMenuDiv(commonClassName, menuName, projects_submenu, role);
    } else if (menuName === "Leave") {
      commonClassName += "-leave" + hidesubmenu;
      return this.subMenuDiv(commonClassName, menuName, submenu_leave, role);
    }
  }

  getClassname = (name, selected) => {
    if (name === "Reports") {
      return "listClass " + this.state.hoverReports + selected;
    } else if (name === "Projects") {
      return "listClass " + this.state.hoverProjects + selected;
    } else if (name === "Leave") {
      return "listClass " + this.state.hoverLeave + selected;
    } else {
      return "listClass " + this.state["hover" + name] + selected;
    }
  };

  render() {
    const { selectedpage } = this.state;
    let LoggedInUser = "employee";

    if (getDataFromCookie() && getDataFromCookie().role) {
      LoggedInUser = getDataFromCookie().role; //from redux state
    }

    let menuItems = main_menu[LoggedInUser].menuList;

    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].name === selectedpage.title) {
        menuItems[i]["selected"] = "pr-active highlightIcon";
      } else {
        menuItems[i]["selected"] = "";
      }
    }

    const listItems = menuItems.map((item) => (
      <Link
        key={item.name}
        to={!isEmpty(item.linkTo) ? "/" + BUILD_PATH + item.linkTo : ""}
        style={{ textDecoration: "none" }}
      >
        <li
          id={item.name}
          onMouseEnter={(e) => this.hoverOn(e, item.name)}
          onMouseLeave={(e) => this.hoverOff(e, item.name)}
          className={this.getClassname(item.name, item.selected)}
          key={item.name}
        >
          <div style={menuStyles.menuDivStyle}>
            <div
              style={{ width: "20%", display: "flex", alignItems: "center" }}
            >
              {/* {/ ajay css /} */}
              <Icon style={menuStyles.menuIconStyle} icon={item.iconName} />
            </div>
            <div style={{ width: "65%", paddingLeft: "6px" }}>{item.name}</div>
            {/* {/ ajay css /} */}
            <div>
              {item.name === "Reports" ||
              item.name === "Projects" ||
              item.name === "Leave" ? (
                <Icon icon="arrow_right" className="submenu-arrow-icon" />
              ) : null}
            </div>
          </div>
        </li>

        {this.addSubMenuList(item.name, LoggedInUser)}
      </Link>
    ));

    return <div id="pr-menu">{listItems}</div>;
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    componentState: state.component.get(ownProps.id, Map()),
    appState: state.component.get(TITLE_SUBTITLE_ID, Map()),
  };
}

export default connect(
  mapStateToProps,
  {
    clearComponentState,
    updateComponentState,
    deleteComponentState,
  }
)(MenuItems);
