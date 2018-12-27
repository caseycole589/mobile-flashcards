import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	KeyboardAvoidingView,
	TouchableOpacity,
	ScrollView,
	Platform,
	Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { addDeck } from '../actions';
import { white, black, teal } from '../utils/colors';
import { NavigationActions } from 'react-navigation';
import SnackBar from 'react-native-snackbar-component';

function SubmitBtn({ onPress }) {
	return (
		<TouchableOpacity
			style={
				Platform.OS === 'ios'
					? styles.iosSubmitBtn
					: styles.androidSubmitBtn
			}
			onPress={onPress}
		>
			<Text style={styles.submitBtnText}>Submit</Text>
		</TouchableOpacity>
	);
}

class AddDeck extends Component {
	state = {
		title: '',
		showSnackbar: false
	};

	submit = () => {
		const title = this.state.title;

		this.props.addDeck(title);
		this.setState({
			title: '',
			showSnackbar: true
		});
	};

	toHome = () => {
		this.setState({
			showSnackbar: false
		});
		this.props.navigation.dispatch(
			NavigationActions.back({
				key: 'AddDeck'
			})
		);
	};

	render() {
		return (
			<ScrollView ref="scroll" style={styles.container}>
				<KeyboardAvoidingView behavior="position">
					<Text style={styles.title}>
						What's the title of your new deck?
					</Text>
					<TextInput
						placeholder="Deck Title"
						style={styles.deckName}
						value={this.state.title}
						onChangeText={input => this.setState({ title: input })}
					/>
					<SubmitBtn onPress={this.submit} />
				</KeyboardAvoidingView>

				<View style={styles.snackBar}>
					<SnackBar
						visible={this.state.showSnackbar}
						textMessage="Deck Created"
						actionHandler={this.toHome}
						actionText="Home"
						backgroundColor={teal}
					/>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: white
	},
	title: {
		fontSize: 42,
		textAlign: 'center',
		marginBottom: 30
	},
	deckName: {
		height: 50,
		padding: 10,
		backgroundColor: '#fff',
		flex: 1,
		marginBottom: 60
	},
	iosSubmitBtn: {
		backgroundColor: teal,
		padding: 30,
		borderRadius: 7,
		height: 45
	},
	androidSubmitBtn: {
		backgroundColor: teal,
		padding: 15,
		paddingLeft: 30,
		paddingRight: 30,
		height: 45,
		borderRadius: 2,
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center'
	},
	submitBtnText: {
		color: white,
		fontSize: 20,
		textAlign: 'center'
	},
	snackBar: {
		marginTop: 120
	}
});

function mapStateToProps(decks) {
	return {
		decks: decks
	};
}

export default connect(
	mapStateToProps,
	{ addDeck }
)(AddDeck);
