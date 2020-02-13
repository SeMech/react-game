import React from 'react';
import styled from "styled-components";
import Api from "../common/api";

export default class Popup extends React.Component {
    constructor(props) {
        super(props);

        this.field = React.createRef();
        this.handleCreateRoom = this.handleCreateRoom.bind(this);
    }

    handleCreateRoom() {
        console.log(this.field.current);
        const name = this.field.current.value;
        Api.createRoom(name).then((response) => {
            this.props.closePopup();
        });
    }

    render() {
        return (
            <Root>
                <ContentPopup>
                    <ClosePopup onClick={this.props.closePopup} />
                    <TitlePopup>
                        Настройки комнаты
                    </TitlePopup>
                    <FiledName ref={this.field} />
                    <CreateButton onClick={this.handleCreateRoom}>Создать комнату</CreateButton>
                </ContentPopup>
            </Root>
        );
    }
}

const Root = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
`;

const ContentPopup = styled.div`
    position: relative;
    align-self: center;
    width: 600px;
    height: 500px;
    background-color: #fff;
    border-radius: 8px;
`;

const TitlePopup = styled.div`
    margin-top: 20px;
    margin-left: 50px;
    font-size: 38px;
`;

const FiledName = styled.input`
    outline: none;
    padding: 10px;
    margin-top: 20px;
    margin-left: 50px;
    font-size: 32px;
    border-radius: 8px;
    background-color: #fff;
    border-color: blue;
`;

const CreateButton = styled.button`
    border: none;
    border-radius: 8px;
    font-size: 24px;
    background-color: darkgreen;
    outline: none;
    color: #fff;
    padding: 20px;
    cursor: pointer;
    position: absolute;
    bottom: 20px;
    left: 50px;
`;

const ClosePopup = styled.i`
    display: block;
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    width: 30px;
    height: 30px;
    ::after {
        content: '';
        position: absolute;
        top: 0;
        right: 15px;
        width: 3px;
        height: 30px;
        background-color: #000;
        transform: rotate(45deg);
    }
    ::before {
        content: '';
        position: absolute;
        top: 0;
        right: 15px;
        width: 3px;
        height: 30px;
        background-color: #000;
        transform: rotate(-45deg);
    }
`;
