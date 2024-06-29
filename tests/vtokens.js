import { ClassicEditor, Essentials, Paragraph, Heading } from 'ckeditor5';
import Vtokens from '../src/vtokens.js';

/* global document */

describe( 'Vtokens', () => {
	it( 'should be named', () => {
		expect( Vtokens.pluginName ).to.equal( 'Vtokens' );
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
					Vtokens
				],
				toolbar: [
					'vtokensButton'
				]
			} );
		} );

		afterEach( () => {
			domElement.remove();
			return editor.destroy();
		} );

		it( 'should load Vtokens', () => {
			const myPlugin = editor.plugins.get( 'Vtokens' );

			expect( myPlugin ).to.be.an.instanceof( Vtokens );
		} );

		it( 'should add an icon to the toolbar', () => {
			expect( editor.ui.componentFactory.has( 'vtokensButton' ) ).to.equal( true );
		} );

		it( 'should add a text into the editor after clicking the icon', () => {
			const icon = editor.ui.componentFactory.create( 'vtokensButton' );

			expect( editor.getData() ).to.equal( '' );

			icon.fire( 'execute' );

			expect( editor.getData() ).to.equal( '<p>Hello CKEditor 5!</p>' );
		} );
	} );
} );
