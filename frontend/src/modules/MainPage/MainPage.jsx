import React from 'react';
import styled from 'styled-components';
import Game from "../Game";

export default class MainPage extends React.Component{
    render() {
        return (
            <Root>
                <Game />
            </Root>
        )
    }
}

const Root = styled.div``;
