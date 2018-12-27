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
import { addCard } from '../actions';
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

class AddCard extends Component {
	static navigationOptions = ({ navigation }) => {
		const { currentDeck } = navigation.state.params;

		return {
			title: `${currentDeck.title}`
		};
	};
	state = {
		question: '',
		answer: '',
		showSnackbar: false
	};

	submit = () => {
		const { title } = this.props;
		const { question, answer } = this.state;

		this.props.addCard(title, question, answer);
		this.setState({
			question: '',
			answer: '',
			showSnackbar: true
		});
	};

	toDeck = () => {
		this.setState({
			showSnackbar: false
		});
		this.props.navigation.dispatch(
			NavigationActions.back({
				key: this.props.navigation.state.params.key
			})
		);
	};

	render() {
		return (
			<ScrollView ref="scroll" style={styles.container}>
				<KeyboardAvoidingView behavior="position" style={{ flex: 1 }}>
					<TextInput
						placeholder="Card Question"
						style={styles.deckName}
						value={this.state.question}
						onChangeText={input =>
							this.setState({ question: input })
						}
					/>

					<TextInput
						placeholder="Card Answer"
						style={styles.deckName}
						value={this.state.answer}
						onChangeText={input => this.setState({ answer: input })}
					/>

					<SubmitBtn onPress={this.submit} />
				</KeyboardAvoidingView>

				<View style={styles.snackBar}>
					<SnackBar
						visible={this.state.showSnackbar}
						textMessage="Card Created"
						actionHandler={this.toDeck}
						actionText="Back to deck"
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

function mapStateToProps(decks, { navigation }) {
	const { currentDeck } = navigation.state.params;

	return {
		decks: decks,
		title: currentDeck.title
	};
}

export default connect(
	mapStateToProps,
	{ addCard }
)(AddCard);
