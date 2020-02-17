import React from 'react';
import styled from "styled-components";
import Api from "../common/api";

import Canvas from '../common/Canvas';

export default class GameLayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room: null,
            player: null,
            enemyPlayer: null,
            ball: null,
            isMeRenderBall: false,
            whatPlayerMy: null,
            whatPlayerEnemy: null,
        };

        this.handleMovePlayer = this.handleMovePlayer.bind(this);
        this.setStatesRoom = this.setStatesRoom.bind(this);
    }

    componentDidMount() {
        Api.startGame((room) => {
            this.setState({
                room: room,
                isMeRenderBall: room.idPlayerRenderBall === this.props.idPlayer,
                whatPlayerMy: room.dataGame.player1.id === this.props.idPlayer
                    ? 'player1' : 'player2',
                whatPlayerEnemy: room.dataGame.player1.id === this.props.idPlayer
                    ? 'player2' : 'player1',
            });
        });
        Api.onStopGame((room) => {
            this.setState({
                room: room,
            });
        });

        // Api.subscribeUpdateBall((ball) => {
        //     this.setState({
        //         ball: ball,
        //     });
        // });
        // Api.subscribeEnemyMoving((y) => {
        //     console.log('test on y', y);
        //     const { enemyPlayer } = this.state;
        //     enemyPlayer.positions.y = y;
        //     this.setState({
        //         enemyPlayer: enemyPlayer,
        //     });
        // });
    }

    setStatesRoom(room, callback) {
        this.setState({
            room: room,
            isMeRenderBall: room.idPlayerRenderBall === this.props.idPlayer,
        }, callback);
    }

    getIsCollisionCanvas(x, y, width, height) {
        if (
            x < 0 ||
            y < 0 ||
            y + height > this.state.room.dataGame.canvas.height ||
            x + width > this.state.room.dataGame.canvas.width
        ) {
            return false;
        }
        return true;
    }

    handleMovePlayer(type) {
        const player = this.state.room.dataGame[this.state.whatPlayerMy];
        let offsetYMove = player.positions.y;

        offsetYMove = type === 'up'
            ? player.positions.y - player.speed : type === 'down'
                ? player.positions.y + player.speed : player.positions.y;

        console.log(offsetYMove, 'offsetYMove');

        console.log(this.getIsCollisionCanvas(
            player.positions.x,
            offsetYMove,
            player.sizes.width,
            player.sizes.height,
        ));

        if (this.getIsCollisionCanvas(
            player.positions.x,
            offsetYMove,
            player.sizes.width,
            player.sizes.height,
        )) {
            player.positions.y = offsetYMove;
            return player.positions.y;
        }

        return player.positions.y;
    }

    render() {
        const dataGame = this.state.room && this.state.room.dataGame;
        return (
            <Root>
                {this.state.room && this.state.room.connectPlayer.length === 2
                && (
                    <>
                        <ScoreContainer>
                            <div>{this.state.room.dataGame.score.player1}</div>
                            <div>score</div>
                            <div>{this.state.room.dataGame.score.player2}</div>
                        </ScoreContainer>
                        <Canvas
                            setStatesRoom={this.setStatesRoom}
                            handleMovePlayer={this.handleMovePlayer}
                            width={dataGame.canvas.width}
                            height={dataGame.canvas.height}
                            idRoom={this.props.idRoom}
                            player={this.state.room.dataGame[this.state.whatPlayerMy]}
                            enemyPlayer={this.state.room.dataGame[this.state.whatPlayerEnemy]}
                            ball={this.state.room.dataGame.ball}
                            isMeRenderBall={this.state.isMeRenderBall}
                        />
                    </>
                )}
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
`;

const ScoreContainer = styled.div`
    width: 1024px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 32px;
    color: #fff;
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
