import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Platform,
	TouchableOpacity,
	ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { receiveDecks, receiveCards } from '../actions';
import { fetchDecks, fetchCards } from '../utils/api';
import { white, black, yellow } from '../utils/colors';
import { AppLoading } from 'expo';
import _ from 'lodash';

class Deck extends Component {
	static navigationOptions = ({ navigation }) => {
		const { currentDeck } = navigation.state.params;

		return {
			title: `${currentDeck.title}`
		};
	};
	componentDidMount() {
		const { navigation } = this.props;
		const deckId = navigation.state.params.currentDeck.title;

		fetchCards().then(cards => receiveCards(deckId, cards));
	}

	render() {
		const { deck, cards } = this.props;

		return (
			<View style={styles.container}>
				<View style={styles.info}>
					<Text style={styles.title}>{deck.title}</Text>
					<Text style={styles.cards}>{cards.length} Cards</Text>
				</View>
				<TouchableOpacity
					style={styles.newCardBtn}
					onPress={() =>
						this.props.navigation.navigate('AddCard', {
							currentDeck: deck
						})
					}
				>
					<Text style={styles.newCardText}>Add Card</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.quizBtn}
					onPress={() =>
						this.props.navigation.navigate('Quiz', {
							currentDeck: deck
						})
					}
				>
					<Text style={styles.quizText}>Begin Quiz</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: white
	},
	info: {
		backgroundColor: white,
		alignItems: 'center',
		marginTop: 100
	},
	title: {
		fontSize: 32
	},
	cards: {
		fontSize: 14
	},
	newCardBtn: {
		alignItems: 'center',
		alignSelf: 'center',
		width: 220,
		marginTop: 150,
		borderRadius: Platform.OS === 'ios' ? 10 : 4,
		borderWidth: 2,
		borderColor: black,
		paddingTop: 10,
		paddingBottom: 10
	},
	newCardText: {
		fontSize: 22
	},
	quizText: {
		fontSize: 22,
		color: white
	},
	quizBtn: {
		alignItems: 'center',
		alignSelf: 'center',
		width: 220,
		marginTop: 10,
		paddingTop: 10,
		paddingBottom: 10,
		borderRadius: Platform.OS === 'ios' ? 10 : 4,
		backgroundColor: black
	}
});

function mapStateToProps(state, { navigation }) {
	const { currentDeck } = navigation.state.params;

	return {
		deck: state[currentDeck.title],
		cards: state[currentDeck.title].questions
	};
}

export default connect(mapStateToProps)(Deck);
