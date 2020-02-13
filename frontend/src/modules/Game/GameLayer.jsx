import React from 'react';
import styled from "styled-components";
import Api from "../common/api";

export default class GameLayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room: null,
        };

        this.canvas = React.createRef();
    }

    componentDidMount() {
        Api.startGame((room) => {
            this.setState({
                room: room,
            });
        });
    }

    render() {
        return (
            <Root>
                {this.state.room
                && <Canvas
                    width={this.state.room.dataGame.canvas.width}
                    height={this.state.room.dataGame.canvas.height}
                    ref={this.canvas}
                />}
                {this.state.room && this.state.room.connectPlayer.length < 2 && (
                    <AbsoluteError>
                        <div>Ожидание подключение последнего игрока..</div>
                    </AbsoluteError>
                )}
            </Root>
        );
    }
}

const Root = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
`;

const Canvas = styled.canvas`
    background-color: #fff;
`;

const AbsoluteError = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    div {
        color: red;
        font-size: 32px;
    }
`;
