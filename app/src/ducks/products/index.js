const initialState = {
	products: [
		{ id: 1, name: 'Abacate' },
		{ id: 2, name: 'Alface' },
		{ id: 3, name: 'Couve' },
		{ id: 4, name: 'Alcatrão' },
		{ id: 5, name: 'Alcatrão' },
		{ id: 6, name: 'Alcatrão' },
		{ id: 7, name: 'Alcatrão' },
	],
	recentProducts: [
		{ id: 1, name: 'Abacate' },
		{ id: 2, name: 'Alface' },
		{ id: 3, name: 'Couve' },
		{ id: 4, name: 'Alcatrão' },
		{ id: 5, name: 'Alcatrão' },
		{ id: 6, name: 'Alcatrão' },
		{ id: 7, name: 'Alcatrão' },
	],
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		default:
			return state
	}
}
