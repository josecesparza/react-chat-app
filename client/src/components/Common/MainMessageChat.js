import React, { useContext, useEffect, useState } from 'react'
import ChatHeader from './ChatHeader';
import ResponseMessage from './ResponseMessage';
import Message from './Message';
import { useForm } from '../hooks/formHook';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import io from 'socket.io-client';

const MainMessageChat = (props) => {
    const auth = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [lastChatId, setLastChatId] = useState(null);
    const [loading, setLoading] = useState(false);
    //process.env.ENDPOINT || 
    const socket = io('http://localhost:5000', {
        transports: ['websocket']
    });

    const socketStart = () => {
        setLoading(true);
        socket.on('get-messages', messages => {
            console.log("Getting messages")
            console.log(messages)
            getMessages();
        });
        auth.socketStarted = true;
        setLoading(false);
    }
    

    const sendMessage = (event) => {
        event.preventDefault();
        setLoading(true);
        
        const data = {
            content: document.getElementById("message").value,
            author: {
                id: auth.currUser._id,
                username: auth.currUser.username
            }
        }

        const chatId = props.chat._id;
        const packet = {
            data: data,
            chatId: chatId
        }
        socket.emit("send-message", packet);

        console.log('outside');

        getMessages();

        document.getElementById("message").value = "";
    }

    const getMessages = () => {
        setLoading(true);

        setLastChatId(props.chat._id);

        axios.get('/api/chats/' + props.chat._id + '/messages')
            .then((newMessages) => {
                setMessages(newMessages.data.messages);
            }).then(() => {
                setLoading(false);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        if(loading === false){
            if (lastChatId !== props.chat._id) {
                getMessages();
                setLoading(true);
                return;
            } else {
                if (props.chat.messages.length > 0 && messages.length > 0) {
                    if (props.chat.messages[0].id !== messages[0]._id && props.chat.messages.length !== messages.length) {
                        getMessages();
                        setLoading(true);
                        return;
                    }
                }
            }
            if(auth.socketStarted !== true){
                socketStart()
            }
        }

        const chatContainer = document.getElementById('scrollable-div');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });


    if (props.chat !== null && typeof props.chat !== 'undefined') {
        let name;
        let userId;
        let namesArray = [];

        // Set chat name based on usernames 
        if (props.chat.members.length > 2) {
            props.chat.members.forEach((member) => {
                if (member.username !== auth.currUser.username) {
                    namesArray.push(member.username);

                    let names = namesArray.join(', ');

                    name = names;
                    userId = member.user;
                }
            });
        } else {
            props.chat.members.forEach((member) => {
                if (member.username !== auth.currUser.username) {
                    name = member.username;
                    userId = member.user;
                }
            });
        }


        return (
            <div className="col main-message-chat absolute-center-pin full-height">
                <ChatHeader name={name} userId={userId} chatId={props.chat._id} unselectChat={props.unselectChat} getMessages={getMessages} />
                <div className="row padding-16 scrollable" id="scrollable-div">
                    {
                        messages.length > 0 ?
                            messages.map((msg, index) => {
                                let text;
                                msg.author.id === auth.currUser._id ?
                                    text = (<Message text={msg.content} key={index} />) :
                                    text = (<ResponseMessage text={msg.content} username={msg.author.username} key={index} />)
                                return text;
                            }) : null
                    }
                </div>
                <form className="padding-16 chat-input-field-position" onSubmit={sendMessage}>
                    <input type="message" id="message" className="chat-input-field" placeholder="Type your message..." />
                </form>
            </div>
        );
    } else {
        return (
            <div></div>
        );
    }

}

export default MainMessageChat;
