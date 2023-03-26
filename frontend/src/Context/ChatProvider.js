/* 
Context provides a way to pass data through the 
component tree without having to pass props down manually at every level.

createContext() = Creates a Context object. When React renders a component that subscribes to this Context object it will read the current context value from the closest matching Provider above it in the tree.
Provider = Every Context object comes with a Provider React component that allows consuming components to subscribe to context changes.

*/


import {createContext , useContext , useEffect, useState} from "react"        
import { useNavigate } from "react-router-dom";

const ChatContext = createContext()

const ChatProvider = ({children})=>{
    const [user , setUser] = useState();
    const [selectedChat , setSelectedChat] = useState();
    const [chats,setChats] = useState([]);
    const [notification , setNotification] = useState([]);

    const Navigate = useNavigate();
    
    useEffect(()=>{
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);
      if(!userInfo){                  // if there is no logged in user  , send route to homepage
           Navigate("/");
      }
    } ,[Navigate]);
 
    return(
        <ChatContext.Provider value={{user , setUser,selectedChat , setSelectedChat , chats,setChats , notification , setNotification}}>
            {children}
        </ChatContext.Provider>
    )
};

export const ChatState=()=>{
   return useContext(ChatContext);
}


export default ChatProvider;