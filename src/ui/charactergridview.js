import { View, ButtonView } from 'ckeditor5';

export default class CharacterGridView extends View {
	constructor( locale ) {
		super( locale );

		this.tiles = this.createCollection();

		this.setTemplate( {
			tag: 'div',
			children: [ {
				tag: 'div',
				attributes: {
					class: [
						'ck',
						'ck-token-grid__tiles'
					]
				},
				children: this.tiles
			} ],
			attributes: {
				class: [
					'ck',
					'ck-token-grid'
				]
			}
		} );
	}

	createTile( { id, name, token, category } ) {
		const tile = new ButtonView( this.locale );

		tile.set( {
			label: name,
			withText: true,
			class: 'ck-token-flex__tile'
		} );

		tile.on( 'execute', () => {
			this.fire( 'execute', { id, name, token, category } );
		} );

		return tile;
	}
}
