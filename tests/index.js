import { icons } from '../src/index.js';

import ckeditor from './../theme/icons/ckeditor.svg';

describe( 'CKEditor5 VTokens', () => {
	describe( 'icons', () => {
		it( 'exports the "ckeditor" icon', () => {
			expect( icons.ckeditor ).to.equal( ckeditor );
		} );
	} );
} );
