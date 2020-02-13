import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`

    body {

        margin: 0;
    }
    html {
        box-sizing: border-box;
    }
    
    *, *:before, *:after {
        box-sizing: inherit;
    }
`;

export default GlobalStyles;
