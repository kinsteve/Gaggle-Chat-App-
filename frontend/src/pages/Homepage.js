import { Container, Box, Tab, Tabs, TabList, TabPanels, TabPanel, Image } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/authentication/Login';
import SignUp from '../components/authentication/Signup';

const Home = () => {
    const Navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if (!user) {
            Navigate("/chats");
        }
    }, [Navigate]);


    return (
        <Container maxW='xl' centerContent>
            <Box
                display='flex'
                justifyContent="center"
                p={3}
                bg={'white'}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Image src='/homepageLogo.png' w={"50%"}/>
                {/* <Text fontSize={"4xl"} fontFamily="Work sans">Gaggle</Text> */}
            </Box>
            <Box
                bg="white"
                w="100%"
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                color={"black"}>
                <Tabs variant='soft-rounded'>
                    <TabList mb="1em">
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
};

export default Home;     