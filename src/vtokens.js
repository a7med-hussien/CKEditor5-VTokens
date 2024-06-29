/**
 * @module heading/VTokens
 */

import {
	Plugin,
	CKEditorError,
	createDropdown
} from 'ckeditor5';

import CharacterGridView from './ui/charactergridview.js';
import TokensNavigationView from './ui/tokensnavigationview.js';

import '../theme/tokens.css';

const ALL_VT_TOKENS_GROUP = 'All';

export default class VTokens extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'VTokens';
	}

	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );
		this._characters = new Map();
		this._groups = new Map();
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		// Register UI component.
		editor.ui.componentFactory.add( 'VTokensButton', locale => {
			const dropdownView = createDropdown( locale );
			let dropdownPanelContent;

			dropdownView.buttonView.set( {
				label: t( 'Tokens' ),
				icon: false,
				withText: true,
				tooltip: true
			} );

			// Insert a token when a tile was clicked.
			dropdownView.on( 'execute', ( evt, data ) => {
				editor.execute( 'input', {
					text: `<span
						class="mention"
						data-id="${ data.id }"
						data-category="${ data.category }"
						data-name="${ data.name }"
						data-token="${ data.token }"
						token="${ data.token }"
						data-mention="#${ data.name }"
					>
						${ data.name }
					</span>`
				} );

				editor.editing.view.focus();
			} );

			dropdownView.on( 'change:isOpen', () => {
				if ( !dropdownPanelContent ) {
					dropdownPanelContent = this._createDropdownPanelContent( locale, dropdownView );

					dropdownView.panelView.children.add( dropdownPanelContent.navigationView );
					dropdownView.panelView.children.add( dropdownPanelContent.gridView );
				}
			} );

			return dropdownView;
		} );

		// TODO
		/*
		editor.plugins.get( 'VTokens' ).addItems( t( 'General' ), [
			{ id: 34, name: 'Appointment Date', token: '{{appointment.date}}', category: 5 },
			{ id: 36, name: 'Appointment Time', token: '{{appointment.time}}', category: 5 },
			{ id: 37, name: 'Today', token: '{{today}}', category: 5 }
		] );

		editor.plugins.get( 'VTokens' ).addItems( t( 'Dealer' ), [
			{ id: 17, name: 'Dealer Name', token: '{{dealership.name}}', category: 1 },
			{ id: 18, name: 'Dealer Phone', token: '{{dealership.phone}}', category: 1 },
			{ id: 19, name: 'Dealer Address', token: '{{dealership.address}}', category: 1 },
			{ id: 20, name: 'Dealer Logo', token: '{{dealership.image}}', category: 1 }
		] );

		editor.plugins.get( 'VTokens' ).addItems( t( 'Rep' ), [
			{ id: 23, name: 'Rep Name', token: '{{rep.name}}', category: 3 },
			{ id: 24, name: 'Rep Phone', token: '{{rep.phone}}', category: 3 },
			{ id: 25, name: 'Rep Email', token: '{{rep.email}}', category: 3 },
			{ id: 26, name: 'Rep Title', token: '{{rep.role}}', category: 3 }
		] );

		editor.plugins.get( 'VTokens' ).addItems( t( 'Seller' ), [
			{ id: 21, name: 'Client First Name', token: '{{lead.first_name}}', category: 2 },
			{ id: 22, name: 'Client Last Name', token: '{{lead.last_name}}', category: 2 }
		] );

		editor.plugins.get( 'VTokens' ).addItems( t( 'Vehicle' ), [
			{ id: 27, name: 'Vehicle Year', token: '{{lead.year}}', category: 4 },
			{ id: 28, name: 'Vehicle Make', token: '{{lead.brand}}', category: 4 },
			{ id: 29, name: 'Vehicle Model', token: '{{lead.model}}', category: 4 },
			{ id: 30, name: 'Vehicle Miles', token: '{{lead.miles}}', category: 4 },
			{ id: 31, name: 'Vehicle Vin', token: '{{lead.vin}}', category: 4 },
			{ id: 32, name: 'Vehicle Trim', token: '{{lead.trim}}', category: 4 },
			{ id: 33, name: 'Vehicle Phone', token: '{{lead.phone}}', category: 4 }
		] );
		*/
	}

	addItems( groupName, items ) {
		if ( groupName === ALL_VT_TOKENS_GROUP ) {
			throw new CKEditorError( `emoji-group-error-name: The name "${ ALL_VT_TOKENS_GROUP }" is reserved and cannot be used.` );
		}

		const group = this._getGroup( groupName );

		for ( const item of items ) {
			group.add( item.name );

			this._characters.set( item.name, { id: item.id, token: item.token, category: item.category } );
		}
	}

	getGroups() {
		return this._groups.keys();
	}

	getCharactersForGroup( groupName ) {
		if ( groupName === ALL_VT_TOKENS_GROUP ) {
			return new Set( this._characters.keys() );
		}

		return this._groups.get( groupName );
	}

	getInfo( name ) {
		return this._characters.get( name );
	}

	_getGroup( groupName ) {
		if ( !this._groups.has( groupName ) ) {
			this._groups.set( groupName, new Set() );
		}

		return this._groups.get( groupName );
	}

	_updateGrid( currentGroupName, gridView ) {
		gridView.tiles.clear();
		const characterTitles = this.getCharactersForGroup( currentGroupName );

		for ( const name of characterTitles ) {
			const info = this.getInfo( name );
			gridView.tiles.add( gridView.createTile( { name, ...info } ) );
		}
	}

	_createDropdownPanelContent( locale, dropdownView ) {
		const specialCharsGroups = [ ...this.getGroups() ];

		// Add a special group that shows all available special characters.
		specialCharsGroups.unshift( ALL_VT_TOKENS_GROUP );

		const navigationView = new TokensNavigationView( locale, specialCharsGroups );
		const gridView = new CharacterGridView( locale );

		gridView.delegate( 'execute' ).to( dropdownView );

		// Update the grid of special characters when a user changed the character group.
		navigationView.on( 'execute', () => {
			this._updateGrid( navigationView.currentGroupName || ALL_VT_TOKENS_GROUP, gridView );
		} );

		// Set the initial content of the special characters grid.
		this._updateGrid( navigationView.currentGroupName || ALL_VT_TOKENS_GROUP, gridView );

		return { navigationView, gridView };
	}
}
