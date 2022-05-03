import React, { useEffect, useState, useRef } from 'react'
import { View, SafeAreaView, Switch, StatusBar, StyleSheet, Image, Pressable, LayoutAnimation, UIManager, Platform, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import Text from './components/text/text'
import { useTheme } from './context/theme-context';
import { commonColors, lightColors, spacing } from './theme';
import { Octokit } from "@octokit/core";
import { Transitioning, TransitioningView, Transition } from 'react-native-reanimated';


const images = {
	dark: {
		pin: require('../assets/pin-dark.png'),
		url: require('../assets/url-dark.png'),
		twitter: require('../assets/twitter.png'),
		officeBuilding: require('../assets/office-building-dark.png'),
	},
	light: {
		pin: require('../assets/pin-light.png'),
		url: require('../assets/url-light.png'),
		twitter: require('../assets/twitter.png'),
		officeBuilding: require('../assets/office-building-light.png'),
	}
}

const octokit = new Octokit();

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

// get month year day from date
const formateDate = (dateString) => {
	const date = new Date(dateString);
	const monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	const day = date.getDate();
	const monthIndex = date.getMonth();
	const year = date.getFullYear();
	return `${day} ${monthNames[monthIndex]} ${year}`;
}

const Row = ({icon, label}) => {
	return (
		<View style={[styles.row, {marginBottom: spacing[4]}]}>
			<Image source={icon} style={styles.icon} />
			{label ? 
				<Text style={[ {marginLeft: spacing[4]} ]}>{label}</Text>
				: <Text textColor="#4B6A9B" style={[{marginLeft: spacing[3]}]}>Not Available</Text>
			}
			
		</View>
	)
}

export default function Root() {
	const {setScheme, isDark, colors} = useTheme();
	const [name, setName] = useState("");
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const ref = useRef(null);

	const transition = (
		<Transition.Sequence>
		  <Transition.In type="fade" durationMs={300} />
		  <Transition.Out type="fade" durationMs={300} />
		</Transition.Sequence>
	)

	console.log("data ", data)
	
	const onSearch = async () => {
		setLoading(true);
		try {
			const res = await octokit.request('GET /users/{username}', {
				username: name
			})
			
			setData(res.data);
			setLoading(false);
			LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
		} catch (err) {
			console.error(err);
			setLoading(false);
		}
		
	}

	const toggleScheme = () => {
		if (ref.current) {
			ref.current.animateNextTransition();
		}
		/*
		* setScheme will change the state of the context
		* thus will cause childrens inside the context provider to re-render
		* with the new color scheme
		*/
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
		return isDark ? setScheme('light') : setScheme('dark');
	}

    return (
		<Transitioning.View style={{ flex: 1,  }} {...{ ref, transition }}>
			{
				isDark && <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: colors.outerBackground }} />
			}
			<SafeAreaView style={{flex: 1}}>
				
				<View style={styles.header}>
					<Text preset="h1">
						devfinder
					</Text>
					
					<Pressable onPress={toggleScheme} style={styles.row}>
						<Text>
							{isDark ? "LIGHT": "DARK"}
						</Text>
							
						<Image 
							source={isDark ? require('../assets/002-sun.png') : require('../assets/moon.png') } 
							style={{marginLeft: spacing[2]}}  
						/>
					</Pressable>
				</View>
				
				<View style={[styles.searchView, {backgroundColor: colors.background}]}>
					<Image source={require('../assets/search.png')} />

					<TextInput
						placeholder="Search GitHub Username…"
						style={{ marginLeft: spacing[2], color: colors.text, flex: 1 }}
						placeholderTextColor={colors.text}
						onChangeText={(text) => setName(text)}
						autoCorrect={false}
					/>

					<TouchableOpacity onPress={onSearch} style={styles.button}>
						<Text textColor="white" style={{fontWeight: "700"}}>
							Search
						</Text>
					</TouchableOpacity>
				</View>
				{
					loading &&
					<View style={{margin: spacing[4]}}>
						<Text style={{ textAlign: "center" }}>Fetching...</Text>
					</View>
				}
				{
					data ? 
					<View style={[styles.card, styles.content, {backgroundColor: colors.background}]}>
						<View style={{ flexDirection: "row" }}>
							<View style={styles.avatar}>
								<Image 
									style={{ height: 70, width: 70 }} 
									resizeMode="contain" 
									source={{ uri: data?.avatar_url }} 
								/>
							</View>

							<View style={[{ marginLeft: spacing[4]}]}>
								<Text preset="h2" textColor={isDark ? colors.text : "#2B3444"} style={{ textTransform: 'capitalize',}}>
									{data?.name}
								</Text>
								<Text textColor={commonColors.blue}>
									{`@${data.login}`}
								</Text>
								<Text preset="h4">
									{`Joined ${formateDate(data.created_at)} `}
								</Text>
							</View>
						</View>

						<View style={{ marginVertical: spacing[5] }}>
							<Text>
								{data.bio ?? "Ut voluptate cillum sit sunt laborum Lorem tempor laboris. Irure non dolor dolor fugiat proident eiusmod aliqua commodo."}
							</Text>
						</View>

						<View style={[styles.box, {backgroundColor: colors.outerBackground}]}>
							<View style={styles.row}>
								<View style={styles.boxItem}>
									<Text preset="small">Repos</Text>
									<Text style={[{marginTop: spacing[2], fontWeight: 'bold'}]}>{data.public_repos}</Text>
								</View>
								<View style={styles.boxItem}>
									<Text preset="small">Followers</Text>
									<Text style={[{marginTop: spacing[2]}]}>{data.followers}</Text>
								</View>
								<View style={styles.boxItem}>
									<Text  preset="small">Following</Text>
									<Text style={[{marginTop: spacing[2]}]}>{data.following}</Text>
								</View>
							</View>
						</View>

						<View style={{marginVertical: spacing[6]}}>
							<Row label={data.location} icon={isDark ? images.dark.pin : images.light.pin }/>
							<Row label={data.blog} icon={isDark ? images.dark.url : images.light.url }/>
							<Row label={data.twitter_username} icon={images.dark.twitter}/>
							<Row label={data.company} icon={isDark ? images.dark.officeBuilding : images.light.officeBuilding } />
						</View>
					</View> : null
				}
				

				<StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
			</SafeAreaView>
		</Transitioning.View>

    )
}

const styles = StyleSheet.create({
	header: {
		marginTop: 30,
		marginHorizontal: spacing[6],
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center'
	},

	searchView: {
		marginTop: spacing[6],
		marginHorizontal: spacing[6],
		paddingVertical: spacing[4],
		paddingHorizontal: spacing[4],
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: spacing[4],
		// card
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 5,
	},

	button: {
		marginLeft: spacing[2],
		backgroundColor: commonColors.blue,
		height: 46,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		width: 80
	},

	card: {
		// card
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 5,
		borderRadius: spacing[4]
	},

	content: {
		marginTop: spacing[6], 
		marginHorizontal: spacing[6],
		padding: spacing[4],
		paddingVertical: spacing[6],
		flex: 1
	},

	avatar: {
		height: 70,
		width: 70,
		borderRadius: 35,
		overflow: 'hidden',
	},

	box: {
		borderRadius: 10,
		paddingVertical: spacing[5],
		paddingHorizontal: spacing[4],
	},

	boxItem: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}

})