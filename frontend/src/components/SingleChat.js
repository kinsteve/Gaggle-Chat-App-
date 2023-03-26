import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState} from 'react';
import { API_SERVICE } from '../config';
import { getSender, getSenderFull } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import ScrollabelChat from './ScrollabelChat';
import './styles.css';
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";


const ENDPOINT = "https://gaggle.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing , setTyping] = useState(false);
    const [isTyping , setIsTyping] = useState(false);
    const toast = useToast();


    const defaultOptions={
        loop:true,autoplay:true,
        animationData: animationData,
        rendererSettings:{
            preserveAspectRatio:"xMidyMid slice",
        },
    };

    const { user, selectedChat, setSelectedChat ,notification , setNotification } = ChatState();
    // if(selectedChat)
    //    console.log(selectedChat.chatName);
    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);
            const { data } = await axios.get(`${API_SERVICE}/api/message/${selectedChat._id}`, config);
            // console.log(messages);
            setMessages(data);
            setLoading(false);
            socket.emit('join chat', selectedChat._id);  // with the id of the selected chat we are going to create a new room so users can join that room
        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to Load the messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
        }
    };
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on('typing', ()=> setIsTyping(true));
        socket.on('stop typing', ()=> setIsTyping(false));
        }, [])

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {              //we are receiving the message over here
        socket.on('message received', (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id)  // it is checking if the selectedChatCompare is empty or the messagge we received is not of selectedChat but of some other chat 
            {
                 if(!notification.includes(newMessageReceived)){
                    setNotification([newMessageReceived , ...notification]);
                    setFetchAgain(!fetchAgain);
                 }
            } else {         // add it to the list of our messages
                setMessages([...messages, newMessageReceived]);
            }
        });
    });                //there is no brackets here bcuz we want to update this useEffect every time we chage the state

    

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing" , selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                }
                setNewMessage("");
                const { data } = await axios.post(
                    `${API_SERVICE}/api/message`,
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    }, config
                );
                // console.log(data);
                socket.emit('new message', data)  //the newMessage will contain the data that we received from API
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error Occured",
                    description: "Failed to send the message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                })
            }
        }
    };
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        //   Typing Indicator logic
        if(!socketConnected) return;
        if(!typing){
            setTyping(true);
            socket.emit('typing' , selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if(timeDiff >= timerLength && typing){
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);           // manually setting typing to false
            }
        },timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                {

                                    <UpdateGroupChatModal
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                    />

                                }
                            </>
                        )}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E7"
                        opacity={"90%"}
                        w="100%"
                        h="100%"
                        borderRadius={"lg"}
                        overflow="hidden"
                    >
                        {loading ? (
                            <Spinner thickness='4px'
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin={"auto"}
                                speed='0.65s'
                                color='black.500'
                                size='xl' />
                        ) : (
                            <div className='messages'>
                                <ScrollabelChat messages={messages} />
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping? <div>
                                <Lottie
                                options={defaultOptions}
                                width={70}
                                style={{marginBottom:15 , marginLeft:0}}
                                />
                            </div>: <></>}
                            <Input
                                varient="filled"
                                bg="#E0E0E0"
                                placeholder='Enter a message..'
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>

                </>
            ) : (
                <Box display={"flex"} alignItems="center" justifyContent="center" h="100%" >
                    <Text fontStyle="Work sans" fontSize={"x-large"} pb={3}>
                        Click on a user to start chatting
                    </Text>
                </Box>
            )
            }
        </>
    );
};

export default SingleChat;