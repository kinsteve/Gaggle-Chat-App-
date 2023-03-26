import { Box } from "@chakra-ui/react";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import { useState } from "react";


const ChatPage = () => {
    
    const {user} = ChatState();
    const [fetchAgain , setFetchAgain]=useState(false);
     
    return (
        <div style={{width:"100%"}}>
           {user && <SideDrawer/>}        
           {/* If a user exist in out app than render SideDrawer component */}
           <Box 
           display={"flex"}
           justifyContent="space-between"
           w={"100%"}
           h="91.5vh"
           p="10px"
           >
             {user && <MyChats fetchAgain={fetchAgain} />}
             {/* Here fetchChat state is made because if user decide to leave a group than the myChats component must render again with that group removed
             therefore it is passed as a prop to this component */}
             {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
           </Box>        
        </div>
    );
};

export default ChatPage;