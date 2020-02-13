import React from 'react';
import styled from "styled-components";
import configGame from "./configGame";

import Interface from "./Interface";
import Api from "../common/api";
import GameLayer from "./GameLayer";

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isGame: false,
            idPlayer: null,
            idRoom: null,
        };

        this.connectGame = this.connectGame.bind(this);
    }

    componentDidMount() {
        Api.socketConnect((id) => {
            this.setState({
                idPlayer: id,
            });
        });
    }

    connectGame(idRoom) {
        Api.connectRoom(idRoom, this.state.idPlayer).then(() => {
            this.setState({
                isGame: true,
                idRoom: idRoom,
            });
        });
    }

    render() {
        return (
            <Root>
                {!this.state.isGame && <Interface connectGame={this.connectGame} />}
                {this.state.isGame && <GameLayer idRoom={this.state.idRoom} />}
            </Root>
        );
    }
}

const Root = styled.div`
    height: 100vh;
    width: 100%;
    background-color: darkslategray;
`;

const Button = styled.button`
    border: none;
    border-radius: 8px;
    display: block;
    outline: none;
    font-size: 60px;
    background-color: blue;
    margin-top: 50px;
    margin-left: 50px;
    cursor: pointer;
    padding: 16px;
`;

const Canvas = styled.canvas`
    width: ${configGame.canvas.width}px;
    height: ${configGame.canvas.height}px;
    background-color: #fff;
    margin-top: 100px;
    margin-left: 100px;
    border: 3px solid #000;
`;
