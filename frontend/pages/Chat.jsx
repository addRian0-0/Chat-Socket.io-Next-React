import React, { useState, useEffect } from "react";
import Head from "next/head";
import { io } from "socket.io-client";
import Alert from '@material-ui/lab/Alert';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import styles from "../styles/Chat.module.css";
const socket = io(`http://localhost:8000`, { transports: ['websocket'] });

export default function Chat() {

    const [username, setUsername] = useState('');

    const checkSession = () => {
        if (!sessionStorage.getItem("username")) {
            window.location = '/';
        } else {
            setUsername(sessionStorage.getItem("username"));
        }
    }

    const logOut = async () => {

        socket.emit("req-logout", username);
        sessionStorage.clear();
        checkSession();

    }
    
    useEffect(() => {
        checkSession();
    });

    return (
        <div>
            <Head>
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                    crossorigin="anonymous"
                    integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" />
            </Head>
            <navbar>
                <h1 className={styles.title}>Chat</h1>
                <button onClick={() => logOut()} type="button" className="btn btn-danger m-4">Log out</button>
            </navbar>

            <div className={styles.root}>
                <div className={styles.notification}>
                </div>
                <div className={styles.box}>
                    <div className={styles.chat}>
                        <List>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <AccountCircleIcon style={{ fontSize: 50 }} color="primary" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Username"
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="textPrimary"
                                            >
                                                {'12/12/12'}
                                            </Typography>
                                            {" — I'll be in your neighborhood doing errands this…"}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </List>
                    </div>
                    <div className={styles.messages} >
                        <h3>{username}</h3>
                        <div className="form-floating">
                            <textarea style={{ height: '120px' }} className="form-control"></textarea>
                            <label>Message</label>
                        </div>
                        <button type="button" className="btn btn-success m-2">Send message</button>
                    </div>
                </div>
            </div>

        </div>
    )
}