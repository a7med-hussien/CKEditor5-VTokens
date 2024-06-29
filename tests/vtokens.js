import { ClassicEditor, Essentials, Paragraph, Heading } from 'ckeditor5';
import VTokens from '../src/vtokens.js';

/* global document */

describe( 'VTokens', () => {
	it( 'should be named', () => {
		expect( VTokens.pluginName ).to.equal( 'VTokens' );
	} );

	describe( 'init()', () => {
		let domElement, editor;

		beforeEach( async () => {
			domElement = document.createElement( 'div' );
			document.body.appendChild( domElement );

			editor = await ClassicEditor.create( domElement, {
				plugins: [
					Paragraph,
					Heading,
					Essentials,
					VTokens
				],
				toolbar: [
					'VTokensButton'
				]
			} );
		} );

		afterEach( () => {
			domElement.remove();
			return editor.destroy();
		} );

		it( 'should load VTokens', () => {
			const myPlugin = editor.plugins.get( 'VTokens' );

			expect( myPlugin ).to.be.an.instanceof( VTokens );
		} );

		it( 'should add an icon to the toolbar', () => {
			expect( editor.ui.componentFactory.has( 'VTokensButton' ) ).to.equal( true );
		} );

		it( 'should add a text into the editor after clicking the icon', () => {
			const icon = editor.ui.componentFactory.create( 'VTokensButton' );

			expect( editor.getData() ).to.equal( '' );

			icon.fire( 'execute' );

			expect( editor.getData() ).to.equal( '<p>Hello CKEditor 5!</p>' );
		} );
	} );
} );
