import {
	RECEIVE_DECKS,
	ADD_DECK,
	RECEIVE_CARDS,
	ADD_CARD,
	QUIZ
} from '../actions';

function decks(state = {}, action) {
	switch (action.type) {
		// keep the original state object
		// merge each new deck object into the state object
		case RECEIVE_DECKS:
			return {
				...state,
				...action.decks
			};

		// keep the original state object
		// merge the new deck object into the state object
		case ADD_DECK:
			return {
				...state,
				[action.title]: {
					title: action.title,
					questions: []
				}
			};

		case RECEIVE_CARDS:
			return {
				questions: state.decks.filter(deck => {
					if (deck.title === action.id) {
						return deck.questions;
					}
				})
			};

		case ADD_CARD:
			const deck = state[action.id];

			return {
				...state,
				[action.id]: {
					title: action.id,
					questions: deck.questions.concat(action.card)
				}
			};

		case QUIZ:
			return {
				questions: state.decks.filter(deck => {
					if (deck.title === action.id) {
						return _.shuffle(deck.questions);
					}
				})
			};

		default:
			return state;
	}
}

export default decks;
