import { Box } from '@chakra-ui/react';
import React from 'react';
import { ChatState } from "../Context/ChatProvider";
import SingleChat from './SingleChat';

const ChatBox = (fetchAgain , setFetchAgain) => {
     const {selectedChat} = ChatState();
    return (
        //here base means when screen is small if a chat is selected than it will show chat box otherwise it is not visible  , but in medium (md) display its flex
        <Box 
        display={{base : selectedChat ? "flex" :"none" , md : "flex"}}
        alignItems="center"
        flexDir="column"
        p={3}
        backdropFilter='auto'
        backdropBlur={"8px"} 
        w={{base :"100%", md:"68%"}}
        borderRadius = "lg"
        borderWidth="1px"
        > 
           <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        </Box>
    );
};

export default ChatBox;