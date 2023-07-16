import React, { Component} from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
            spotifyAuthenticated: false,
            song: {},
        };
        this.roomCode = this.props.match.params.roomCode;
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.updateShowsSettings = this.updateShowsSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.autenticateSpotify = this.autenticateSpotify.bind(this);
        this.getCurrentSong = this.getCurrentSong.bind(this);

        this.getRoomDetails();
    }

    componentDidMount(){
        this.interval = setInterval(this.getCurrentSong, 1000);
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    // Fetch the API data from GetRoom class in /api/views.py
    getRoomDetails(){
        fetch('/api/get-room' + '?code=' + this.roomCode)
            .then((response) => {
                if (!response.ok) {
                    this.props.leaveRoomCallback();
                    this.props.history.push("/");
                }
                return response.json();
            })
                .then((data) => {
            // Assign data
            this.setState({ 
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
            })

            if (this.state.isHost){
                this.autenticateSpotify();
            }
        });
    }

    autenticateSpotify(){
        fetch('/spotify/is-auth')
        .then((response) => response.json())
        .then((data) => {
            this.setState({authenticated: data.status});
            if (!data.status){
                fetch('/spotify/get-auth-url')
                    .then((response) => response.json())
                    .then((data) => {
                        window.location.replace(data.url);
                    })
            }
        })
    }

    getCurrentSong(){
        fetch("/spotify/current-song")
          .then((response) => {
            if(!response.ok){
                return {};
            }
            else {
                return response.json();
            }
        }).then((data) => {
            this.setState({ song: data});
        });
    }

    leaveButtonPressed(){
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/api/leave-room", requestOptions).then((_response) => {
            this.props.leaveRoomCallback();
            this.props.history.push("/");
        });
    }

    updateShowsSettings(value){
        this.setState({
            showSettings: value,
        })
    }

    renderSettingsButton(){
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => this.updateShowsSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    }

    render(){
        if (this.state.showSettings){
            return this.renderSettings();
        }

        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Room Code: {this.roomCode}
                    </Typography>
                </Grid>
                <MusicPlayer {...this.state.song}/>
                {this.state.isHost ? this.renderSettingsButton(): null}
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={this.leaveButtonPressed} >
                        Leave Room
                    </Button>
                </Grid>
            </Grid>);
    }

    renderSettings(){
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage 
                    update={true} 
                    votesToSkip={this.state.votesToSkip} 
                    guestCanPause={this.state.guestCanPause} 
                    roomCode={this.roomCode}
                    updateCallback={this.getRoomDetails}/>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={() => this.updateShowsSettings(false)} >
                        Back
                    </Button>
                </Grid>
            </Grid>)
    }

    _checkPause(value){
        if (value == true){
            return 'Yes'
        }
        else return 'No'
    }
}

