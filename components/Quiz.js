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
import { receiveCardsForQuiz } from '../actions';
import { fetchCards } from '../utils/api';
import { white, black, green, red } from '../utils/colors';
import { AppLoading } from 'expo';
import { clearLocalNotification, setLocalNotification } from '../utils/helpers';

class Quiz extends Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Quiz'
		};
	};
	state = {
		showAnswer: false,
		cardNumber: 0,
		correct: 0,
		incorrect: 0,
		ready: false
	};
	componentDidMount() {
		const { navigation } = this.props;
		const deckId = navigation.state.params.currentDeck.title;

		fetchCards()
			.then(cards => receiveCardsForQuiz(deckId, cards))
			.then(() => this.setState({ ready: true }));
	}
	switchView = () => {
		this.setState({
			showAnswer: !this.state.showAnswer
		});
	};
	onCorrectAnswer() {
		this.setState({
			cardNumber: this.state.cardNumber + 1,
			correct: this.state.correct + 1,
			showAnswer: false
		});
	}
	onIncorrectAnswer() {
		let { cardNumber, incorrect } = this.state;
		let newCardNumber = this.state.cardNumber + 1;
		let incorrectCount = this.state.incorrect + 1;

		this.setState({
			cardNumber: newCardNumber,
			incorrect: incorrectCount,
			showAnswer: false
		});
	}
	reset = () => {
		this.setState({
			showAnswer: false,
			cardNumber: 0,
			correct: 0,
			incorrect: 0,
			ready: true
		});
	};

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.showAnswer !== this.props.showAnswer;
	}

	render() {
		const { shuffledCards } = this.props;
		const {
			showAnswer,
			cardNumber,
			correct,
			incorrect,
			ready
		} = this.state;

		if (ready === false) {
			return <AppLoading />;
		}

		if (cardNumber === shuffledCards.length) {
			clearLocalNotification().then(setLocalNotification);

			let score = (correct / (correct + incorrect)) * 100;

			return (
				<View style={styles.scoreContainer}>
					<Text style={styles.scoreHeading}>Final Score</Text>

					<View style={styles.scoreRow}>
						<Text style={[styles.scoreText, { color: green }]}>
							Correct:{' '}
						</Text>
						<Text style={styles.scoreText}>{correct}</Text>
					</View>

					<View style={styles.scoreRow}>
						<Text style={[styles.scoreText, { color: red }]}>
							Incorrect:{' '}
						</Text>
						<Text style={styles.scoreText}>{incorrect}</Text>
					</View>

					<View style={styles.scoreRow}>
						<Text style={styles.scoreText}>Score: </Text>
						<Text style={styles.scoreText}>{score.toFixed(2)}</Text>
					</View>

					<View>
						<TouchableOpacity
							style={styles.resetBtn}
							onPress={() => this.reset()}
						>
							<Text style={styles.resetText}>Retake Quiz</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.backHomeBtn}
							onPress={() =>
								this.props.navigation.navigate('Home')
							}
						>
							<Text style={styles.backHomeText}>Home</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
		}

		return (
			<View style={styles.container}>
				<Text style={styles.cardCount}>
					{cardNumber}/{shuffledCards.length}
				</Text>

				{showAnswer === false ? (
					<View style={styles.content}>
						<Text style={styles.title}>
							{shuffledCards[cardNumber].question}
						</Text>
						<TouchableOpacity
							style={styles.answerBtn}
							onPress={() => this.switchView()}
						>
							<Text style={styles.answerBtnText}>
								Show Answer
							</Text>
						</TouchableOpacity>
					</View>
				) : (
					<View style={styles.content}>
						<Text style={styles.title}>
							{shuffledCards[cardNumber].answer}
						</Text>
						<TouchableOpacity
							style={styles.answerBtn}
							onPress={() => this.switchView()}
						>
							<Text style={styles.answerBtnText}>
								Show Question
							</Text>
						</TouchableOpacity>
					</View>
				)}

				<View style={styles.content}>
					<TouchableOpacity
						style={styles.correctBtn}
						onPress={() => this.onCorrectAnswer()}
					>
						<Text style={styles.correctBtnText}>Correct</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.incorrectBtn}
						onPress={() => this.onIncorrectAnswer()}
					>
						<Text style={styles.incorrectBtnText}>Incorrect</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: white
	},
	cardCount: {
		fontSize: 20,
		padding: 10
	},
	content: {
		backgroundColor: white,
		alignItems: 'center',
		marginTop: 10
	},
	title: {
		fontSize: 36,
		textAlign: 'center'
	},
	answerBtn: {
		backgroundColor: 'transparent',
		marginTop: 10,
		paddingTop: 15,
		paddingBottom: 15,
		width: 220,
		alignItems: 'center'
	},
	answerBtnText: {
		fontSize: 16,
		color: red,
		fontWeight: '600'
	},
	correctBtn: {
		backgroundColor: green,
		borderRadius: Platform.OS === 'ios' ? 10 : 4,
		paddingTop: 15,
		paddingBottom: 15,
		width: 220,
		alignItems: 'center',
		marginTop: 120
	},
	correctBtnText: {
		fontSize: 16,
		color: white
	},
	incorrectBtn: {
		backgroundColor: red,
		borderRadius: Platform.OS === 'ios' ? 10 : 4,
		paddingTop: 15,
		paddingBottom: 15,
		width: 220,
		alignItems: 'center',
		marginTop: 10
	},
	incorrectBtnText: {
		fontSize: 16,
		color: white
	},
	scoreText: {
		flex: 1,
		fontSize: 22,
		textAlign: 'left'
	},
	scoreHeading: {
		fontSize: 36,
		marginTop: 40,
		marginBottom: 40,
		textAlign: 'center'
	},
	scoreContainer: {
		flex: 1,
		backgroundColor: white,
		marginTop: 10
	},
	scoreRow: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		marginLeft: 90
	},
	resetBtn: {
		alignItems: 'center',
		alignSelf: 'center',
		width: 220,
		marginTop: 120,
		borderRadius: Platform.OS === 'ios' ? 10 : 4,
		borderWidth: 2,
		borderColor: black,
		paddingTop: 10,
		paddingBottom: 10
	},
	resetText: {
		color: black,
		fontSize: 22
	},
	backHomeBtn: {
		alignItems: 'center',
		alignSelf: 'center',
		width: 220,
		marginTop: 10,
		paddingTop: 10,
		paddingBottom: 10,
		borderRadius: Platform.OS === 'ios' ? 10 : 4,
		backgroundColor: black
	},
	backHomeText: {
		color: white,
		fontSize: 22
	}
});

function mapStateToProps(state, { navigation }) {
	const { currentDeck } = navigation.state.params;

	return {
		shuffledCards: state[currentDeck.title].questions
	};
}

export default connect(mapStateToProps)(Quiz);
