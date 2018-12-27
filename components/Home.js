import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Platform,
	TouchableOpacity,
	ScrollView,
	AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import { receiveDecks } from '../actions';
import { fetchDecks } from '../utils/api';
import { DECKS_STORAGE_KEY } from '../utils/helpers';
import { white, black, yellow } from '../utils/colors';
import { AppLoading } from 'expo';

class Home extends Component {
	state = {
		ready: false
	};
	componentDidMount() {
		const { dispatch } = this.props;
		fetchDecks()
			.then(decks => dispatch(receiveDecks(decks)))
			.catch(e => {
				console.log('Error: ', e);
			})
			.then(() => this.setState({ ready: true }));
	}

	render() {
		const { decks } = this.props;
		const { ready } = this.state;

		const numDecks = Object.keys(decks).length;

		if (ready === false) {
			return <AppLoading />;
		}

		return (
			<View style={styles.container}>
				<ScrollView contentContainerStyle={styles.scrollContainer}>
					{numDecks > 0 ? (
						decks.map(deck => {
							let numCards = deck.questions
								? deck.questions.length
								: 0;

							return (
								<TouchableOpacity
									key={deck.title}
									style={styles.deck}
									onPress={() =>
										this.props.navigation.navigate('Deck', {
											currentDeck: deck
										})
									}
								>
									<Text style={styles.deckText}>
										{deck.title}
									</Text>
									<Text style={styles.cardsText}>
										{numCards} cards
									</Text>
								</TouchableOpacity>
							);
						})
					) : (
						<Text style={styles.noDecks}>No decks available</Text>
					)}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: white
	},
	scrollContainer: {
		paddingLeft: 20,
		paddingTop: 0,
		backgroundColor: white
	},
	deck: {
		flexDirection: 'column',
		flex: 1,
		minHeight: 150,
		backgroundColor: white,
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#808080'
	},
	deckText: {
		fontSize: 24
	},
	cardsText: {
		fontSize: 14
	},
	noDecks: {
		fontSize: 24,
		padding: 20,
		flex: 1,
		textAlign: 'center'
	}
});

function mapStateToProps(decks) {
	return {
		decks: decks
	};
}

export default connect(mapStateToProps)(Home);
