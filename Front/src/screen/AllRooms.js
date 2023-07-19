import React, { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import BlocRoom from '../components/BlocRoom';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API } from '../constant/constant';

// const baseUrl = "http://10.10.2.228:3000"

let idRooms = [];
// let unavailable = false;
export default function AllRooms() {
	const [underline, setUnderline] = useState(2)
	const [rooms, setRooms] = useState([]);
	const [moreRooms, setMoreRooms] = useState([])
	const [unavailable, setUnavailable] = useState(false)
	// const [touchable, setTouchable] = useState(true)
	const [disabled, setDisabled] = useState(false)

	const underlined = (number) => {
		setUnderline(number)
	}

	let uri = "/participants/rooms-list"
	if (underline === 2) uri = "/rooms"

	useEffect(() => {

		SecureStore.getItemAsync('token1').then((token) => {
			// console.log("TOKEN1 :", token )
			SecureStore.getItemAsync('refreshtoken').then((refresh) => {
				// console.log("TOKEN2", refresh);
				axios({
					method: 'GET',
					url: `${API + uri}`,
					headers: {
						'Content-Type': 'application/json',
						token1: token,
						refreshtoken: refresh
					}
				}).then((response) => {
					setRooms(response.data)
					// console.log('allRooms', response.data);
				})
					.catch(error => {
						console.log(error.response.data)
						// if (error.response.status === 417) {
						// 	axios({
						// 		method: 'get',
						// 		url: `${baseUrl + uri}`,
						// 		headers: {
						// 			'Content-Type': 'application/json',
						// 			token1: token,
						// 			refreshtoken: error.response.data
						// 		}
						// 	}).then((response) => {
						// 		setRooms(response.data)
						// 		console.log('setRooms: ', response.data);
						// 	})
						// 		.catch(error => console.log(error))
						// }
						// else {
						// 	console.log(error)
						// }
					})
			})
		})
	}, [underline]);

	const essai = (idRoom) => {
		arrayRooms.push(idRoom)
		setMoreRooms(arrayRooms)
		// console.log('essai: ', arrayRooms)
	}

	useEffect(() => {
		moreRooms.forEach((moreRoom) => {
			idRooms.push(moreRoom.id)
		})
	}, [moreRooms])

	const setNewRooms = (object) =>{
		setMoreRooms([...moreRooms, object])

		// console.log (rooms.find(({ id }) => id === object.id))
	}

	const deleteRoom = (id) => {
		idRooms = idRooms.filter(id_room => id_room !== id)
		setMoreRooms(moreRooms.filter(moreRoom => moreRoom.id !== id))
		setUnavailable(false)
		// setTouchable(true)
	}

	const addRooms = () => {
		SecureStore.getItemAsync('token1').then((token) => {
			SecureStore.getItemAsync('refreshtoken').then((refresh) => {
				axios({
					method: 'post',
					url: `${API}/participants/rooms-list/add`,
					headers: {
						'Content-Type': 'application/json',
						token1: token,
						refreshtoken: refresh
					},          
					data: JSON.stringify({
						id: idRooms
					})
				}).then((response) => {
						console.log(response.data)
					})
					.catch(error => {
						if (error.response.status === 417) {
							axios({
								method: 'post',
								url: `${API}/participants/rooms-list/add`,
								headers: {
									'Content-Type': 'application/json',
									token1: token,
									refreshtoken: error.response.data
								}, 
								data: JSON.stringify({
									id: idRooms
								})       
							}).then((response) => {
								console.log(response.data)
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
							})
						}
						else {
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
						}
					})
				})
			})
	}

	// useEffect(() => {
	// 	if(moreRooms.length >= 1) {
	// 		rooms.forEach((room) => {
	// 			moreRooms.forEach((moreRoom) => {
	// 				if(room.id === moreRoom.id) {
	// 					setUnavailable(true)
	// 				}
	// 			})
	// 		});
	// 	}
	// }, [rooms, moreRooms])


	// console.log('moreRooms end', moreRooms)
	return (
		<ScrollView style={styles.bg}>
			<View style={styles.tabs}>
				
				<TouchableOpacity onPress={() => underlined(2)}>
					<Text style={underline === 2 ? styles.selected : styles.notSelected}>More bands</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => underlined(1)}>
					<Text style={underline === 1 ? styles.selected : styles.notSelected}>My chuu bands</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.container}>
				{
					rooms.length >= 1 ?
					rooms.map((room) => 
						<BlocRoom 
							key={room.id}
							name={room.name}
							room={room}
							tab={underline}
							pressRoom={setNewRooms}
							// specialClass={moreRooms.find(moreRoom => moreRoom.id === room.id) ? true : false}
							// touchable={touchable}
							tb = {false}
							disabled = {disabled}
							moreRooms = {moreRooms}
						/>
					)
					:
					<Text>No rooms.</Text>
				}
			</View>

			{
				moreRooms.length >= 1 &&
				<View
					style={styles.pls}
				>
					<ScrollView 
						style={styles.test}
						horizontal={true}
						// stickyHeaderIndices={[0]}
					>
						<View style={styles.help}>
							{
								moreRooms.map((arrayRoom) => 
									<BlocRoom
										key={arrayRoom.id}
										id={arrayRoom.id}
										name={arrayRoom.name}
										deletePress={deleteRoom}
										tb = {true}
									/>
								)
							}
							<TouchableOpacity 
								onPress={() => addRooms()}
								style={styles.btn}
							>
								<Text
									style={{ textTransform: 'uppercase'}}
								>
									Add
								</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</View>
			} 
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	bg: {
		flex: 1,
		backgroundColor: '#080713'
	},
	tabs: {
		justifyContent: 'space-evenly',
		flexDirection: 'row',
		backgroundColor: '#080713',
	},
	selected: {
		textDecorationLine: 'underline',
		color: '#C5AAFF',
		fontSize: 20,
		fontWeight: '600',
		marginBottom: 50,
		marginLeft: 14,
		paddingTop: 20,
	},
	notSelected: {
		color: '#C5AAFF',
		fontSize: 20,
		fontWeight: '600',
		marginBottom: 50,
		marginLeft: 14,
		paddingTop: 20,
	},
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		backgroundColor: '#080713',
	},
	pls: {
		marginTop: 100,
	},
	test: {
		backgroundColor: '#110f1f',
		flex: 5,
	},
	help: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: 5
	},
	btn: {
		marginLeft: 40,
		marginRight: 20,
		backgroundColor: '#C5AAFF',
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 10,
	}
})
