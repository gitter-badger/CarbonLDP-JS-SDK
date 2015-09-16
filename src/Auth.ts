/// <reference path="../typings/es6-promise/es6-promise.d.ts" />
import * as HTTP from './HTTP';
import * as Errors from './Errors';
import Parent from './Parent';

enum Method {
	Basic
}

export interface Credentials {
	username:string;
	password:string;
}

class Auth {
	private parent:Parent;

	private authenticated:boolean = false;
	private method:Method = null;
	private credentials:Credentials;

	constructor( parent:Parent ) {
		this.parent = parent;
	}

	isAuthenticated( askParent:boolean = true ):boolean {
		//@formatter:off
		return (
			this.authenticated ||
			(askParent && ! ! this.parent.parent && this.parent.parent.Auth.isAuthenticated())
		);
		//@formatter:on
	}

	login( username:string, password:string ):Promise<void> {
		var method:Method = <any> this.parent.getSetting( "auth.method" );

		switch ( method ) {
			case Method.Basic:
				return this.basicAuthentication( username, password );
			default:
				return new Promise<void>( function () {
					throw new Errors.IllegalStateError( 'The authentication method specified isn\'t supported.' );
				} );
		}
	}

	addAuthentication( requestOptions:HTTP.Request.Options ):void {
		if( ! this.isAuthenticated( false ) ) {
			if( this.parent.parent ) {
				this.parent.parent.Auth.addAuthentication( requestOptions);
				return;
			} else {
				console.warn( "There is no authentication to add to the request." );
			}
		}

		var headers:Map<string, HTTP.Header.Class> = requestOptions.headers ? requestOptions.headers : requestOptions.headers = new Map<string, HTTP.Header.Class>();
		switch ( this.method ) {
			case Method.Basic:
				this.addBasicAuthHeader( headers );
				requestOptions.sendCredentialsOnCORS = true;
				break;
		}
	}


	private basicAuthentication( username, password ):Promise<void> {
		return new Promise<void>( ( resolve, reject ) => {
			// TODO: Check that the credentials are valid
			this.credentials = {
				username: username,
				password: password
			};

			this.method = Method.Basic;
			this.authenticated = true;

			resolve();
		} );
	}

	private addBasicAuthHeader( headers:Map<string, HTTP.Header.Class> ):void {
		var header:HTTP.Header.Class;
		if ( headers.has( 'Authorization' ) ) header = headers.get( 'Authorization' );
		else {
			header = new HTTP.Header.Class();
			headers.set( 'Authorization', header );
		}
		var authorization = 'Basic ' + btoa( this.credentials.username + ':' + this.credentials.password );
		header.values.push( new HTTP.Header.Value( authorization ) );
	}


}

//@formatter:off
export default Auth;
export {
	Auth as Class,
	Method
};
//@formatter:on