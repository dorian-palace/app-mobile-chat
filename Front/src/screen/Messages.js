import * as React from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import jwt_decode from 'jwt-decode'
import { API } from '../constant/constant';
import { useState, useEffect } from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView
} from "react-native";

const Messages = (props) => {
    
    let isUser;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMessageIndex, setSelectedMessageIndex] = useState();
    const [messages, setMessages] = useState([]);
    const [decoded, setDecoded] = useState([]);
    const [selectedReaction, setSelectedReaction] = useState(null);

    function getUserInfo(callback) {
        SecureStore.getItemAsync('token1').then((payload) => {
            payload = jwt_decode(payload);
            callback(payload);
        });
    }

    function getMessages(callback) {
        SecureStore.getItemAsync('token1').then((rest) => {
            SecureStore.getItemAsync('refreshtoken').then((res) => {
                if (res) {
                    var payload = jwt_decode(rest);
                    axios.get(`${API}/chat/get/${props.idRoom}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                token1: rest,
                                refreshtoken: res
                            }
                        }).then(res => {
                            // const data = res.data;
                            callback(res.data);

                            console.log('data-messages : ',res.data);
                            
                        }).catch(error => {
                            console.log('messages: ', error);
                            if(error.response) {
                        
                            } else if (error.request) {
                                console.log('error request', error.request);
                            }
                            else {
                                console.log('Error', error.message);
                            }
                        })
                }
            })
        })
    }

    useEffect(() => {
        props.socket.on('newMessage', message => setMessages(messages => [...messages, message]));
        getUserInfo(payload => {
            setDecoded(payload);
        })
        getMessages(data => {
            setMessages(data);
            console.log('getMessages: ',setMessages);
        })
    }, []);

    const formattedDate = [];
    if (messages?.length > 0) {
        messages.forEach((msg) => {
            formattedDate[msg.id_message] = new Date(msg.created_at)
			.toLocaleTimeString("en-US", {
                day:"numeric",
                month:"short",
                hour: "numeric",
                minute: "numeric",
            });
        
            // console.log('CREATED AT',msg.created_at);
			// console.log('MESSAGE ID:' , msg.id_message)
        });
    }



    const handleLongPress = (index) => {
        setModalVisible(true);
        setSelectedMessageIndex(index);
    };

    const handleReaction = (reaction, index) => {
        const newMessages = [...messages];
        newMessages[index] = {
            ...newMessages[index],
            reaction,
        };
        setMessages(newMessages);
        setSelectedReaction(reaction);
        setModalVisible(false);
    };



    return (
        <SafeAreaView style={styles.mainContainer}>

            {messages?.map((msg, index) => {

                return (
                
                
                    <View style={styles.container} key={index}>
                    
                        <View style={styles.contentSendedHours} >
                                {isUser = decoded.login == msg.login}
                                <Text style={styles.login, isUser ? styles.sendedUserName : styles.receivedUserName}>
                                    {msg.login} 
                                    {/* {console.log('formattedDate',formattedDate[msg.id])} {console.log('messageid', msg.id)} */}
                                </Text>
                            </View>
                            {isUser = decoded.login == msg.login}
                        <TouchableOpacity style={isUser ? styles.sendedMessage : styles.receivedMessage} onLongPress={() => handleLongPress(index)}>
                            
                            <Text style={styles.content}>{msg.content}</Text>
                        </TouchableOpacity>
                        <View style={styles.contentSendedHours} >
                                {isUser = decoded.login == msg.login}
                                <Text style={styles.login, isUser ? styles.sendedHour : styles.receivedHour}>
                                 {formattedDate[msg.id_message]}
                                 {/* {console.log('formattedDate',formattedDate[msg.id])} {console.log('messageid', msg.id)} */}
                                </Text>
                            </View>



                        {/* <View style={styles.display}> */}
                            {/* {msg.reaction ? (
                                <View style={{ position: 'absolute', bottom: 0, alignSelf: 'flex-start', paddingLeft: 67 }}>
                                    <Text style={{ fontSize: 25, marginLeft: 80, }}>{msg.reaction}</Text>
                                </View>
                            ) : null} */}
                            {/* <View style={styles.bottomModal}>
                                {selectedMessageIndex === index && modalVisible ? (
                                    <TouchableOpacity style={styles.modalContainer}>
                                        <TouchableOpacity onPress={() => handleReaction("💅🏽", index)}>
                                            <Text style={{ fontSize: 20, }}>💅🏽</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleReaction("🫶", index)}>
                                            <Text style={{ fontSize: 20, }}>🫶</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleReaction("🤮", index)}>
                                            <Text style={{ fontSize: 20, }}>🤮</Text>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                ) : (
                                    <Text></Text>
                                )}
                            </View> */}
                        {/* </View> */}

                    </View>
                

                )

            }

            )}
        </SafeAreaView>
    );
};

export default Messages;

const styles = StyleSheet.create({

    display: {
        flexDirection: 'row',
        // backgroundColor:'green',
        // width: 60,
        // alignSelf:'flex-end'
    },
    contentSendedHours: {

    },
    sendedMessage: {
        marginRight: 40,
        maxWidth: 250,
        padding: 10,
        marginBottom: 5,
        alignSelf: "flex-end",
        backgroundColor: "#B2FFDF",
        borderRadius: 20,
    },
    login: {
        color: "#ECECEC",
        marginLeft: 25,
        marginBottom: 5,
        fontWeight: "bold",
        fontSize: 20,
    },
    mainContainer: {
        flex:1,
        marginTop:100,
        // height: "80%",
    },

    container: {
    },

    receivedMessage: {
        marginBottom: 4,
        maxWidth: 250,
        marginLeft: 40,
        alignSelf: "flex-start",
        borderRadius: 20,
        backgroundColor: "#C5AAFF",
        position: "relative",
        padding: 10,
    },

    content: {
        padding: 1,
        // backgroundColor:'yellow'
    },

    receivedHour: {
        // alignSelf: "flex-start",
        marginTop: 7,
        color:"#E0DFDF",
        marginLeft: 40,
        paddingBottom:5,
        fontSize: 15,
    },

    sendedHour: {
        alignSelf: "center",
        alignSelf: "flex-end",
        color: "#E0DFDF",
        marginTop: 7,
        marginRight: 40,
        paddingBottom: 5,
        fontSize: 15,

    },
    receivedUserName: {
        marginTop: 7,
        color:"white",
        marginLeft: 40,
        paddingBottom:5,
        fontSize: 15,
    },

    sendedUserName: {
        alignSelf: "center",
        alignSelf: "flex-end",
        color: "white",
        marginTop: 7,
        marginRight: 40,
        paddingBottom: 5,
        fontSize: 15,

    },

    bottomModal: {
        flexDirection: "row",
        zIndex: 1000,
        width: "27%",
        alignSelf: "flex-start",
        flexWrap: "wrap",
        // backgroundColor: "green",
        // justifyContent: "space-between",
    },

    currentHour: {
        alignSelf: "center",
        padding: 10,
        fontSize: 12,
    },

    modalContainer: {
        alignItems: "flex-end",
        width: "80%",
        backgroundColor: "white",
        marginLeft: 79,
        padding: 10,
        borderRadius: 10,
        flexDirection: "row",
    },

    reactionsContainer: {
        backgroundColor: "green",
        marginRight: 10,
        width: "20%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 20,
    },
});