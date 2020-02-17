import React from 'react';
import styled from "styled-components";
import Api from "./api";

import * as keyCodes from '../common/keysCode';

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);

        this.canvas = React.createRef();
        this.canvasContext = null;

        this.drawScene = this.drawScene.bind(this);
    }

    componentDidMount() {
        this.canvasContext = this.canvas.current.getContext('2d');
        this.handleMoving();
        Api.subscribeRerenderCanvas((room) => {
            const { setStatesRoom } = this.props;

            setStatesRoom(room, () => {
                this.drawScene();
            })
        })
    }

    movingFromType(type) {
        const y = this.props.handleMovePlayer(type);
        Api.movePlayer(y);
    }

    handleMoving() {
        window.addEventListener('keydown', (event) => {
            Object.keys(keyCodes).map((key) => {
                if (keyCodes[key].code === event.keyCode && keyCodes[key].isActive) {
                    this.movingFromType(keyCodes[key].type);
                }
            });
        })
    }

    drawRectangle (coords, sizes, enemy = false) {
        this.canvasContext.fillStyle = enemy ? 'red' : 'green';
        this.canvasContext.fillRect(
            coords.x,
            coords.y,
            sizes.width,
            sizes.height,
        );
    }

    drawCircle (x, y, radius) {
        this.canvasContext.fillStyle = 'blue';
        this.canvasContext.arc(
            x,
            y,
            radius,
            0,
            (2 * Math.PI),
        );
        this.canvasContext.fill();
    }

    drawPlayer() {
        if (this.props.player)
            this.drawRectangle(
                this.props.player.positions,
                this.props.player.sizes,
            );
        if (this.props.enemyPlayer)
            this.drawRectangle(
                this.props.enemyPlayer.positions,
                this.props.enemyPlayer.sizes,
                true,
            );
    }

    drawBall() {
        if (this.props.ball) {
            this.drawCircle(
                this.props.ball.x,
                this.props.ball.y,
                this.props.ball.radius,
            )
        }
    }

    drawHalfLine() {
        this.canvasContext.fillStyle = '#000';
        this.canvasContext.fillRect(
            (this.props.width / 2) - 2,
            0,
            4,
            this.props.height,
        );
    }

    drawScene() {
        this.canvasContext.clearRect(0, 0, this.props.width, this.props.height);
        this.canvasContext.beginPath();

        this.drawPlayer();
        this.drawHalfLine();
        this.drawBall();

        this.canvasContext.closePath();
    }

    render() {
        return (
            <RootCanvas
                ref={this.canvas}
                height={this.props.height}
                width={this.props.width}
            />
        );
    }
}

const RootCanvas = styled.canvas`
    background-color: #fff;
`;
