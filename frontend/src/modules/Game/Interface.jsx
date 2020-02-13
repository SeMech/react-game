import React from 'react';
import styled from "styled-components";
import Api from "../common/api";
import Popup from "./Popup";

const roomsLimit = 5;

export default class Interface extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoadRooms: false,
            rooms: null,
            roomsLength: 0,
            currentPaginationIndex: 0,
            isShowPopup: false,
        };
        this.roomsOffset = 0;

        this.openPopupCreatingRoom = this.openPopupCreatingRoom.bind(this);
        this.closePopupCreatingRooms = this.closePopupCreatingRooms.bind(this);
        this.handleChangePageRoom = this.handleChangePageRoom.bind(this);
    }

    componentDidMount() {
        this.getRooms(roomsLimit, this.roomsOffset).then();
        Api.updateRooms(() => {
            this.getRooms(roomsLimit, this.roomsOffset).then();
        });
    }

    componentWillUnmount() {
        Api.unsubscribeUpdateRoom();
    }

    async getRooms(limit = 0, offset = 0) {
         await Api.getRooms(limit, offset).then((response) => {
            console.log(response);
            this.setState({
                rooms: response.data.rooms,
                roomsLength: response.data.length,
                isLoadRooms: true,
            });
        }).catch(() => {
            this.setState({
                rooms: null,
                isLoadRooms: true,
            });
        });
    }

    changeCurrentPageIndex(index) {
        this.setState({
            currentPaginationIndex: index,
        });
    }

    handleChangePageRoom(index) {
        this.roomsOffset = index * roomsLimit;
        this.getRooms(roomsLimit, this.roomsOffset).then(() => {
            this.changeCurrentPageIndex(index);
        });
    }

    openPopupCreatingRoom() {
        this.setState({
            isShowPopup: true,
        });
    }

    closePopupCreatingRooms() {
        this.setState({
            isShowPopup: false,
        });
    }

    render() {
        return (
            <Root>
                <Content>
                    <Rooms>
                        <RoomsTitle>Комнаты:</RoomsTitle>
                        <RoomsContent>
                            {this.state.isLoadRooms ? (
                                <>
                                    {this.state.rooms ? (
                                        <>
                                            <RoomsContentWrapper>
                                                {this.state.rooms.map((room, index) => (
                                                    <RoomItem key={index.toString()}>
                                                        <RoomTitle>{(index + this.roomsOffset + 1)}. {room.name}</RoomTitle>
                                                        <RoomPlayers> {room.connectPlayer.length}/{room.quantityPlayer} players</RoomPlayers>
                                                        <RoomButton
                                                            onClick={() => this.props.connectGame(room._id)}
                                                        >Присоедениться</RoomButton>
                                                    </RoomItem>
                                                ))}
                                            </RoomsContentWrapper>
                                            <PaginationRooms>
                                                {(() => {
                                                    const paginationArray = Array(Math.ceil(this.state.roomsLength / roomsLimit)).fill(0);
                                                    return paginationArray.map((_, index) => (
                                                        <PaginationNumber
                                                            onClick={() => this.handleChangePageRoom(index)}
                                                            key={index.toString()}
                                                            isActive={index === this.state.currentPaginationIndex}
                                                        >
                                                            {index + 1}
                                                        </PaginationNumber>
                                                    ))
                                                })()}
                                            </PaginationRooms>
                                        </>
                                    ) : (
                                        <RoomError>
                                            не найдено...
                                        </RoomError>
                                    )}
                                </>
                            ) : (
                                <RoomsLoader />
                            )}
                            <CreateRoomButton onClick={this.openPopupCreatingRoom}>
                                Создать комнату
                            </CreateRoomButton>
                        </RoomsContent>
                    </Rooms>
                </Content>
                {this.state.isShowPopup && <Popup closePopup={this.closePopupCreatingRooms} />}
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
`;

const Content = styled.div`
    width: 1024px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: #fff;
    padding-top: 40px;
`;

const Rooms = styled.div`
    width: 100%;
`;

const RoomsTitle = styled.div`
    font-size: 38px;
    width: 100%;
    text-align: center;
`;

const RoomsContent = styled.div`
    margin-top: 10px;
`;

const RoomsContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 340px;
`;

const RoomsLoader = styled.div`
    width: 100px;
    height: 100px;
    border-radius: 100%;
    border-bottom: 2px solid blue;
    margin: 20px auto;
    animation: loader 1.5s ease-out infinite;
    
    @keyframes loader {
        from { transform: rotate(0deg); border-width: 0.5px; }
        to { transform: rotate(360deg); border-width: 2px; }
        //100% { transform: rotate(0deg); }
    }
`;

const RoomItem = styled.div`
    width: 80%;
    align-self: center;
    margin-top: 15px;
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const RoomError = styled(RoomItem)`
    justify-content: center;
    text-align: center;
    font-size: 32px;
`;

const RoomTitle = styled.div`
    font-size: 20px;
    text-transform: uppercase;
`;

const RoomPlayers = styled.div`
    font-size: 16px;
    text-transform: uppercase;
`;

const RoomButton = styled.button`
    border: none;
    border-radius: 8px;
    font-size: 20px;
    background-color: green;
    outline: none;
    color: #fff;
    padding: 15px;
    cursor: pointer;
`;

const PaginationRooms = styled.div`
    width: 70%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
`;

const PaginationNumber = styled.button`
    outline: none;
    background-color: blue;
    color: #fff;
    width: 30px;
    height: 30px;
    font-size: 24px;
    border: 1px solid blue;
    cursor: pointer;
    :not(:last-child) {
        margin-right: 10px;
    }
    
    ${(props) => (props.isActive && `
        background-color: green;
        border: none;
    `)}
`;

const CreateRoomButton = styled.button`
    margin-left: 50px;
    margin-top: 50px;
    align-self: flex-start;
    border: none;
    border-radius: 8px;
    font-size: 24px;
    background-color: darkgreen;
    outline: none;
    color: #fff;
    padding: 20px;
    cursor: pointer;
`;
