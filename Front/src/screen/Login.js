
import React, {useRef} from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground} from "react-native";
import * as SecureStore from 'expo-secure-store';
import ROUTES from '../constant/routes';
import jwt_decode from "jwt-decode";
import  {API}  from '../constant/constant';

export default function Login({ navigation }) {
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')
	const [rooms, setRooms] = useState([])
	let first = true;

	const loginField = useRef()
	const passwordField = useRef()

	useEffect(() => {
	    if (first) {
	        SecureStore.getItemAsync('token1').then((res) => {
	        	if (res) {
	            	const decoded = jwt_decode(res);
	                setRooms(decoded.id_rooms)
	                navigation.navigate(ROUTES.HOME, { screen: ROUTES.CONTACT })
					console.log(res);
	            }
	        })
			first = false;
	    }
	}, [rooms])

	const connect = () => {
		if (login !== '' && password !== '') {
			axios.post(API + '/users/auth', {
				login: login,
				password: password
			})
				.then(function (response) {
					setLogin('');
					setPassword('');
					loginField.current.value = "";
					passwordField.current.value = "";
					const token = response.data.token;
					const refresh = response.data.refresh;
					SecureStore.setItemAsync('token1', token).then(() => {
						SecureStore.setItemAsync('refreshtoken', refresh).then(() => {
							console.log('co')
							navigation.navigate(ROUTES.HOME, { screen: rooms.length > 1 ? ROUTES.FEED : ROUTES.CHATROOMS })
						})
					})
				})
				.catch(function (error) {
					if (error.response) {
						// The request was made and the server responded with a status code
						// that falls out of the range of 2xx
						console.log('error response data', error.response.data);
						console.log('error response status', error.response.status);
						console.log('error response headers', error.response.headers);
					} else if (error.request) {
						// The request was made but no response was received
						// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
						// http.ClientRequest in node.js
						console.log('error request', error.request);
					} else {
						// Something happened in setting up the request that triggered an Error
						console.log('Error', error.message);
					}
				});
		}
		else {
			alert('Please enter a valid login and password.')
		}
	}

	return (
  
		<ImageBackground
			source={require("../assets/connexion.png")}
			resizeMode="cover"
			style={{ 
				width: '100%', 
				height: '100%', 
				backgroundColor: '#C5AAFF',
			}}
		>

			<View style={styles.container}>
				<View style={styles.boxTitle}>
				<Text style={styles.title}>
					Sign in
				</Text>
				</View>
				<View style={styles.boxForm}>
					<Text style={styles.label}>
						Login
					</Text>
					<TextInput
						style={styles.input}
						onChangeText={login => setLogin(login)}
						ref={loginField}
					/>
					<Text style={styles.label}>
						Password
					</Text>
					<TextInput
						style={styles.input}
						onChangeText={password => setPassword(password)}
						secureTextEntry={true}
						ref={passwordField}
					/>
					<TouchableOpacity
						onPress={() => connect()}
						style={styles.button}
					>
						<Text
							style={styles.buttonText}
						>
							Login
						</Text>
					</TouchableOpacity>
					<Text
						style={styles.toRegister}
						onPress={() => navigation.navigate(ROUTES.REGISTER)}
					>
						New to Chuu ? Sign Up here !
					</Text>
				</View>
			</View>
		</ImageBackground>
		
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 52,
		alignItems: 'center'
	},
	boxTitle: {
		marginTop: 90,
	},
	boxForm: {
		marginTop: 60,

	},
	title: {
		fontSize: 40,
		fontWeight: '600',
		marginBottom: 15,
	},
	label: {
		marginTop: 15,
		fontSize: 15,
		fontWeight: '500',
	},
	input: {
		borderBottomColor: 'black',
		borderBottomWidth: 1,
		height: 40,
	},
	button: {
		marginTop: 20,
		backgroundColor: 'black',
		borderRadius: 12
	},
	buttonText: {
		color: '#C5AAFF',
		textAlign: 'center',
		padding: 15,
		fontWeight: '500',
		fontSize: 18,
	},
	toRegister: {
		marginTop: 20,
		fontWeight: '600',
		fontSize: 15,
	}
})