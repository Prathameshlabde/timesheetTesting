import { createGlobalStyle } from "styled-components";

// export const GlobalStyle = createGlobalStyle`
//  button{
//   background-color:  ${(props) => props.btnBackgroundColor};
//  }
// `;

const GlobalStyle = createGlobalStyle`
button {
    background-color: ${(props) => props.btnBackgroundColor};
  }
`;

export default GlobalStyle;
