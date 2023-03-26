import {React,useState} from 'react';
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement,Button, useToast } from '@chakra-ui/react';
import axios from "axios";
import { useNavigate } from "react-router";
import { API_SERVICE } from '../../config';

const Login = () => {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [show , setShow] = useState(false);
    const [loading , setLoading] =useState(false);
    const toast =useToast();
    const Nav=useNavigate();
    const handleClick=()=>setShow(!show);
    const submitHandler=async ()=>{
            setLoading(true);
            if(!email || !password){
                toast({
                    title:"Please Fill all the feilds",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
                  setLoading(false);
                  return;
            }

            try{
                  const config={
                    headers:{
                      "Content-type":"application/json",
                    },
                  };
                  const {data}=await axios.post(
                    `${API_SERVICE}/api/user/login`,
                    {email,password},
                    config
                  );

                  toast({
                    title: "Login Successful",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
                  localStorage.setItem("userInfo", JSON.stringify(data));
                  setLoading(false);
                  Nav("/chats");
                } catch (error) {
                  toast({
                    title: "Error Occured!",
                    description: error.response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
                  setLoading(false);
                }
    };      

    return (
        <VStack
            spacing={4}
            align='stretch'
            color="black"
        >
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                 placeholder='Enter your Email'
                 value={email}
                 onChange={(e)=>setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                <Input
                 type={show?"text":"password"}
                 placeholder='Enter your Password'
                 value={password}
                 onChange={(e)=>setPassword(e.target.value)}
                />
                 <InputRightElement width="4.5rem" onClick={handleClick}>
                   <Button h="1.75rem" size="sm">
                      {show ? "Hide" : "Show"}
                   </Button>
                 </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
            colorScheme="blue"
            width="100%"
            style={{marginTop:15}}
            onClick={submitHandler}
            isLoading={loading}
            >
              Login 
            </Button>
            <Button
            varient="solid"
            colorScheme="red"
            width="100%"
            
            onClick={()=>{
                setEmail("guest@example.com");
                setPassword("123456");
            }}
            >
              Login as Guest
            </Button>
        </VStack>
    );
};

export default Login;