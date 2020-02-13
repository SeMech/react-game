import React from 'react';
import GlobalStyles from './GlobalStyles';
import MainPage from "../MainPage";

export default class App extends React.Component {
    render() {
        return (
            <>
                <GlobalStyles />
                <MainPage />
            </>
        );
    }
}
