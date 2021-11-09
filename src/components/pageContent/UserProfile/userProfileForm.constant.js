import {getDataFromCookie} from "../../utils/CheckLoginDetails";
const userName =getDataFromCookie().userName

export const profilePersonalData = [
  {
    title: "Name:",
    key: "fullname",
    value: userName,    //prathamesh 21-10-2021
    type: "text",
    isFullWidth: true, // ajay 19 june 2020
    isDisable: false,
    isError: false,
    isRequired: false,
    validationRegex: "",
    validationMessage: "Please enter name properly."
  },
  {
    title: "BirthDate (mm/dd/yyyy):",
    key: "birth_date",
    value: "",
    type: "date",
    isError: false,
    isRequired: true
    // validationRegex: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
    // validationMessage: "Please enter date of birth properly."
  },
  {
    title: "Father Name:",
    key: "father_name",
    value: "",
    type: "text",
    isRequired: false,
    isError: false,
    validationRegex: "",
    validationMessage: "Please enter father name properly."
  },
  {
    title: "Spouse Name:",
    key: "spouse_name",
    value: "",
    type: "text",
    isError: false,
    isRequired: false,
    validationRegex: "",
    validationMessage: "Please enter spouse name properly."
  },
  {
    title: "Permanent Address:",
    key: "perm_address",
    value: "",
    type: "text",
    isFullWidth: true,
    isError: false,
    isRequired: true,
    validationRegex: "",
    validationMessage: "Please enter permanent address properly."
  },
  {
    title: "Local Address:",
    key: "local_address",
    value: "",
    type: "text",
    isFullWidth: true,
    isError: false,
    isRequired: true,
    validationRegex: "",
    validationMessage: "Please enter local address properly."
  },
  {
    title: "Permanent Contact No:",
    key: "perm_contact",
    value: "",
    type: "text",
    isError: false,
    isRequired: true,
    validationRegex: /^\d{10}$/,
    validationMessage: "Please enter contact number properly."
  },
  {
    title: "Mobile No:",
    key: "mobile_number",
    value: "",
    type: "text",
    isError: false,
    isRequired: true,
    validationRegex: /^\d{10}$/,
    validationMessage: "Please enter 10 digit phone number properly."
  },
  {
    title: "Personal Email Id:",
    key: "pers_email_id",
    value: "",
    type: "text",
    isError: false,
    isRequired: true,
    validationRegex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    validationMessage: "Please enter personal email address properly."
  },
  {
    title: "Blood Group:",
    key: "blood_group",
    value: "",
    type: "text",
    isError: false,
    isRequired: true,
    validationRegex: "",
    validationMessage: "Please enter blood group properly."
  },
  {
    title: "PAN No:",
    key: "pan_no",
    value: "",
    type: "text",
    isError: false,
    isRequired: false,
    validationRegex: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
    validationMessage: "Please enter PAN number properly."
  },
  {
    title: "UAN No. (PF Related):",
    key: "uan_no",
    value: "",
    type: "text",
    isError: false,
    isRequired: false,
    validationRegex: /^\d*$/,
    validationMessage: "Please enter UAN number properly."
  }
];

export const profileEmergencyData = [
  {
    title: "Name:",
    key: "emer_name",
    value: "",
    type: "text",
    isError: false,
    isRequired: true,
    validationRegex: /^[a-zA-Z ]*$/,
    validationMessage: "Please enter name properly."
  },
  {
    title: "Relation:",
    key: "emer_relation",
    value: "",
    type: "text",
    isError: false,
    isRequired: true,
    validationRegex: /^[a-zA-Z]*$/,
    validationMessage: "Please enter relation properly."
  },
  {
    title: "Contact No:",
    key: "emer_contact",
    value: "",
    type: "text",
    isError: false,
    isRequired: true,
    validationRegex: /^\d{10}$/,
    validationMessage: "Please enter contact number properly."
  }
];

export const profileEmergencyDatas = [
  {
    title: "Name:",
    key: "emer_name",
    value: "",
    type: "text",
    isError: false,
    isRequired: false,
    validationRegex: /^[a-zA-Z ]*$/,
    validationMessage: "Please enter name properly."
  },
  {
    title: "Relation:",
    key: "emer_relation",
    value: "",
    type: "text",
    isError: false,
    isRequired: false,
    validationRegex: /^[a-zA-Z]*$/,
    validationMessage: "Please enter relation properly."
  },
  {
    title: "Contact No:",
    key: "emer_contact",
    value: "",
    type: "text",
    isError: false,
    isRequired: false,
    validationRegex: /^\d{10}$/,
    validationMessage: "Please enter contact number properly."
  }
];

export const profileEducationCompulsory = [
  {
    title: "Qualification:",
    key: "qualification",
    value: "",
    type: "area",
    isError: false,
    isRequired: true,
    // validationRegex: /^[a-zA-Z ]*$/,
    // validationMessage: "Please enter qualification properly.",
    width: "15%",
    rows: "2"
  },
  {
    title: "Board / University:",
    key: "board_uni",
    value: "",
    type: "area",
    isError: false,
    isRequired: true,
    validationRegex: /^.+$/,
    validationMessage: "Please enter Board / University properly.",
    width: "40%",
    rows: "2"
  },
  {
    title: "Grade / Percentage:",
    key: "grade_perc",
    value: "",
    type: "area",
    isError: false,
    isRequired: true,
    // validationRegex: /^([a-zA-Z]{1}|\d{2}(\%|\s\bpercent\b))$/,
    // validationMessage: "Please enter Grade/ Percentage properly.",
    width: "15%",
    rows: "2"
  },
  {
    title: "Year of Passing:",
    key: "passing_year",
    value: "",
    type: "area",
    isError: false,
    isRequired: true,
    validationRegex: /^\d{4}$/,
    validationMessage: "Please enter passing year properly.",
    width: "15%",
    rows: "2"
  }
];

export const profileEducationData = [
  {
    title: "",
    key: "qualification",
    value: "",
    type: "area",
    isError: false,
    isRequired: false,
    // validationRegex: /^.+$/,
    // validationMessage: "Please enter Board / University properly.",
    width: "15%",
    rows: "2"
  },
  {
    title: "",
    key: "board_uni",
    value: "",
    type: "area",
    isError: false,
    isRequired: false,
    validationRegex: /^.+$/,
    validationMessage: "Please enter Board / University properly.",
    width: "40%",
    rows: "2"
  },
  {
    title: "",
    key: "grade_perc",
    value: "",
    type: "area",
    isError: false,
    isRequired: false,
    // validationRegex: /^([a-zA-Z]{1}|\d{2}(\%|\s\bpercent\b))$/,
    // validationMessage: "Please enter Grade/ Percentage properly.",
    width: "15%",
    rows: "2"
  },
  {
    title: "",
    key: "passing_year",
    value: "",
    type: "area",
    isError: false,
    isRequired: false,
    validationRegex: /^\d{4}$/,
    validationMessage: "Please enter passing year properly.",
    width: "15%",
    rows: "2"
  }
];

export const profileOfficeData = [
  {
    title: "Date of Joining:",
    key: "join_date",
    value: "",
    type: "date",
    isDisable: false,
    isError: false,
    isRequired: false,
    validationRegex: "",
    validationMessage: ""
  },
  {
    title: "Aadhaar No:",
    key: "aadhar_no",
    value: "",
    type: "text",
    isError: false,
    isRequired: false,
    validationRegex: /^\d{12}$/,
    validationMessage: "Please enter AADHAR number properly"
  },
  {
    title: "HDFC Salary Account No:",
    key: "salary_account_no",
    value: "",
    type: "text",
    isError: false,
    isRequired: false,
    validationRegex: /^\d*$/,
    validationMessage: "Please enter account number properly."
  },
  {
    title: "Passport No:",
    key: "passport_no",
    value: "",
    type: "text",
    isError: false,
    isRequired: false,
    validationRegex: /^(?!^0+$)[a-zA-Z0-9]{3,20}$/,
    validationMessage: "Please enter passport number properly."
  }
];
