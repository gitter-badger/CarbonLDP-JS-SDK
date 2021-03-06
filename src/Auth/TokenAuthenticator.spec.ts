import {
		INSTANCE,

		module,

		isDefined,

		clazz,
		method,

		hasConstructor,
		hasMethod,
		hasSignature,
} from "./../test/JasmineExtender";

import AbstractContext from "./../AbstractContext";
import * as Errors from "./../Errors";
import * as HTTP from "./../HTTP";
import * as Utils from "./../Utils";

import AuthenticationToken from "./AuthenticationToken";
import UsernameAndPasswordToken from "./UsernameAndPasswordToken";

import * as Token from "./Token";

import * as TokenAuthenticator from "./TokenAuthenticator";

describe( module( "Carbon/Auth/TokenAuthenticator" ), ():void => {
	it( isDefined(), ():void => {
		expect( TokenAuthenticator ).toBeDefined();
		expect( Utils.isObject( TokenAuthenticator ) ).toEqual( true );
	});

	describe( clazz( "Carbon.Auth.TokenAuthenticator.Class", `
		Authenticates requests using Basic Authentication
	`), ():void => {

		beforeEach( function ():void {
			jasmine.Ajax.install();
		} );

		afterEach( function ():void {
			jasmine.Ajax.uninstall();
		} );

		it( isDefined(), ():void => {
			expect( TokenAuthenticator.Class ).toBeDefined();
			expect( Utils.isFunction( TokenAuthenticator.Class ) ).toEqual( true );
		});

		it( hasConstructor(
			[
				{ name: "context", type: "Carbon.Context", description: "The context where to authenticate the agent." }
			]
		), ():void => {
			class MockedContext extends AbstractContext {
				resolve( uri:string ):string {
					return uri;
				}
			}

			let authenticator:TokenAuthenticator.Class = new TokenAuthenticator.Class( new MockedContext() );

			expect( !! authenticator ).toEqual( true );
			expect( authenticator instanceof TokenAuthenticator.Class ).toEqual( true );
		});

		it( hasMethod( INSTANCE, "isAuthenticated", `
			returns true if the instance contains stored credentials.
		`, { type: "boolean" } ), ():void => {
			class MockedContext extends AbstractContext {
				resolve( uri:string ):string {
					return uri;
				}
			}

			let authenticator:TokenAuthenticator.Class = new TokenAuthenticator.Class( new MockedContext() );

			expect( "isAuthenticated" in authenticator ).toEqual( true );
			expect( Utils.isFunction( authenticator.isAuthenticated ) ).toEqual( true );

			// TODO
		});

		describe( method(
			INSTANCE,
			"authenticate"
		), ():void => {

			it( hasSignature(
				"Stores credentials to authenticate future requests.", [
					{ name: "authenticationToken", type: "Carbon.Auth.UsernameAndPasswordToken" }
				],
				{ type: "Promise<Carbon.Auth.Token.Class>"}
			), ( done:{ ():void, fail:( error:Error ) => void } ):void => {
				
				// Property Integrity
				(() => {
					class MockedContext extends AbstractContext {
						resolve( uri:string ) {
							return uri;
						}
					}
					let context = new MockedContext();
					let authenticator:TokenAuthenticator.Class = new TokenAuthenticator.Class( context );

					expect( "authenticate" in authenticator ).toEqual( true );
					expect( Utils.isFunction( authenticator.authenticate ) ).toEqual( true );
				})();

				let promises:Promise<void>[] = [];

				// Successful Authentication
				(() => {
					class SuccessfulContext extends AbstractContext {
						resolve( relativeURI:string ):string {
							return "http://example.com/successful/" + relativeURI;
						}
					}

					let expirationTime:Date = new Date();
					expirationTime.setDate( expirationTime.getDate() + 1 );
					jasmine.Ajax.stubRequest( "http://example.com/successful/auth-tokens/", null, "POST" ).andReturn( {
						status: 200,
						responseText: `
						[{
							"@id": "",
							"@type": [
								"https://carbonldp.com/ns/v1/security#Token",
								"https://carbonldp.com/ns/v1/platform#VolatileResource"
							],
							"https://carbonldp.com/ns/v1/security#tokenKey": "token-value",
							"https://carbonldp.com/ns/v1/security#expirationTime": {
								"@value": "${expirationTime.toISOString()}",
								"@type": "http://www.w3.org/2001/XMLSchema#dateTime"
							}
						}]
					`,
					});

					let context:SuccessfulContext = new SuccessfulContext();
					let authenticator:TokenAuthenticator.Class = new TokenAuthenticator.Class( context );

					promises.push( authenticator.authenticate( new UsernameAndPasswordToken( "user", "pass" ) ).then( ( token:Token.Class ):void => {
						expect( authenticator.isAuthenticated() ).toEqual( true );

						expect( token ).toBeDefined();
						expect( token ).not.toBeNull();
						expect( Token.Factory.is( token ) ).toEqual( true );
					}) );
				})();

				// Unsuccessful Authentication
				(() => {
					class UnsuccessfulContext extends AbstractContext {
						resolve( relativeURI:string ):string {
							return "http://example.com/unsuccessful/" + relativeURI;
						}
					}

					let expirationTime:Date = new Date();
					expirationTime.setDate( expirationTime.getDate() + 1 );
					jasmine.Ajax.stubRequest( "http://example.com/unsuccessful/auth-tokens/", null, "POST" ).andReturn( {
						status: 401
					} );

					let context:UnsuccessfulContext = new UnsuccessfulContext();
					let authenticator:TokenAuthenticator.Class = new TokenAuthenticator.Class( context );

					promises.push( authenticator.authenticate( new UsernameAndPasswordToken( "user", "pass" ) ).then( () => {
							done.fail( new Error( "The authentication should have been unsuccessful." ) );
					}, ( error:Error ) => {
						expect( error instanceof HTTP.Errors.UnauthorizedError ).toEqual( true );

						expect( authenticator.isAuthenticated() ).toEqual( false );
					} ) );
				})();

				Promise.all( promises ).then( ():void => {
					done();
				}, ( error:Error ):void => {
					done.fail( error );
				});
			});

			it( hasSignature(
				"Stores credentials to authenticate future requests.", [
					{ name: "token", type: "Carbon.Auth.Token.Class" }
				],
				{ type: "Promise<Carbon.Auth.Token.Class>" }
			), ( done:{ ():void, fail:( error:Error ) => void } ):void => {

				class MockedContext extends AbstractContext {
					resolve( uri:string ) {
						return uri;
					}
				}
				let context = new MockedContext();
				
				// Property Integrity
				(() => {
					let authenticator:TokenAuthenticator.Class = new TokenAuthenticator.Class( context );

					expect( "authenticate" in authenticator ).toEqual( true );
					expect( Utils.isFunction( authenticator.authenticate ) ).toEqual( true );
				})();

				let promises:Promise<void>[] = [];

				// Successful Authentication
				(() => {
					let expirationTime:Date = new Date();
					expirationTime.setDate( expirationTime.getDate() + 1 );
					let tokenString:string = `{
						"expirationTime": "${expirationTime.toISOString()}",
						"id": "",
						"key": "token-value",
						"types": [
							"https://carbonldp.com/ns/v1/security#Token",
							"https://carbonldp.com/ns/v1/platform#VolatileResource"
						]
					}`;
					let authenticator:TokenAuthenticator.Class = new TokenAuthenticator.Class( context );

					promises.push( authenticator.authenticate( JSON.parse( tokenString ) )
						.then( ( tokenCredentials:Token.Class ):void => {
							expect( authenticator.isAuthenticated() ).toEqual( true );
	
							expect( tokenCredentials ).toBeDefined();
							expect( tokenCredentials ).not.toBeNull();
							expect( Token.Factory.is( tokenCredentials ) ).toEqual( true );
						})
					);
				})();

				// Unsuccessful Authentication, time expired
				(() => {
					let expirationTime:Date = new Date();
					expirationTime.setDate( expirationTime.getDate() - 1 );
					let tokenString:string = `{
						"expirationTime": "${expirationTime.toISOString()}",
						"id": "",
						"key": "token-value",
						"types": [
							"https://carbonldp.com/ns/v1/security#Token",
							"https://carbonldp.com/ns/v1/platform#VolatileResource"
						]
					}`;
					let authenticator:TokenAuthenticator.Class = new TokenAuthenticator.Class( context );

					promises.push( authenticator.authenticate( JSON.parse( tokenString ) ).then( () => {
						done.fail( new Error( "The authentication should have been unsuccessful." ) );
					}, ( error:Error ) => {
						expect( error instanceof Errors.IllegalArgumentError ).toEqual( true );

						expect( authenticator.isAuthenticated() ).toEqual( false );
					} ) );
				})();

				Promise.all( promises ).then( ():void => {
					done();
				}, ( error:Error ):void => {
					done.fail( error );
				});
			});
			
		});

		it( hasMethod( INSTANCE, "addAuthentication", `
			Adds the Basic authentication header to the passed request options object.
		`, [
			{ name: "requestOptions", type:"Carbon.HTTP.Request.Options", description: "Request options object to add Authentication headers." }
		], { type: "Carbon.HTTP.Request.Options", description: "The request options with the added authentication headers." } ), (  done:{ ():void; fail:( error:any ) => void } ):void => {

			// Property Integrity
			(() => {
				class MockedContext extends AbstractContext {
					resolve( uri:string ):string {
						return uri;
					}
				}

				let authenticator:TokenAuthenticator.Class = new TokenAuthenticator.Class( new MockedContext() );

				expect( "addAuthentication" in authenticator ).toEqual( true );
				expect( Utils.isFunction( authenticator.addAuthentication ) ).toEqual( true );
			})();


			let promises:Promise<void>[] = [];

			// Successful Authentication
			(() => {
				class SuccessfulContext extends AbstractContext {
					resolve( relativeURI:string ):string {
						return "http://example.com/successful/" + relativeURI;
					}
				}

				let expirationTime:Date = new Date();
				expirationTime.setDate( expirationTime.getDate() + 1 );
				jasmine.Ajax.stubRequest( "http://example.com/successful/auth-tokens/", null, "POST" ).andReturn( {
					status: 200,
					responseText: `[{
						"@id": "", 
						"@type": [ 
							"https://carbonldp.com/ns/v1/security#Token" 
						], 
						"https://carbonldp.com/ns/v1/security#tokenKey": "token-value", 
						"https://carbonldp.com/ns/v1/security#expirationTime": { 
							"@value": "${expirationTime.toISOString()}"  , 
							"@type": "http://www.w3.org/2001/XMLSchema#dateTime" 
						} 
					}]`,
				} );

				let context:SuccessfulContext = new SuccessfulContext();
				let authenticator:TokenAuthenticator.Class = new TokenAuthenticator.Class( context );

				promises.push( authenticator.authenticate( new UsernameAndPasswordToken( "user", "pass" ) ).then( ():void => {
					let requestOptions:HTTP.Request.Options = authenticator.addAuthentication( {} );

					expect( !! requestOptions ).toEqual( true );
					expect( Utils.isObject( requestOptions ) ).toEqual( true );
					expect( "headers" in requestOptions ).toEqual( true );
					expect( requestOptions.headers instanceof Map ).toEqual( true );
					expect( requestOptions.headers.has( "authorization" ) ).toEqual( true );

					let authorizationHeader:HTTP.Header.Class = requestOptions.headers.get( "authorization" );

					expect( authorizationHeader instanceof HTTP.Header.Class ).toEqual( true );
					expect( authorizationHeader.values.length ).toEqual( 1 );

					let authorization:string = authorizationHeader.toString();

					expect( Utils.S.startsWith( authorization, "Token " ) ).toEqual( true );
					expect( authorization.substring( 6 ) ).toEqual( "token-value" );
				}) );
			})();

			// TODO: Test case where other headers are already provided
			// TODO: Test case where an Authorization header is already provided, but no Basic authentication value is
			// TODO: Test another case where a Basic Authorization header is already provided

			Promise.all( promises ).then( ():void => {
				done();
			}, ( error:Error ):void => {
				done.fail( error );
			});
		});

		it( hasMethod( INSTANCE, "clearAuthentication", `
			Clears any saved credentials and restores the Authenticator to its initial state.
		` ), ( done:{ ():void; fail:( error:any ) => void } ):void => {
			// Property Integrity
			(() => {
				class MockedContext extends AbstractContext {
					resolve( uri:string ):string {
						return uri;
					}
				}
				let authenticator:TokenAuthenticator.Class = new TokenAuthenticator.Class( new MockedContext() );

				expect( "clearAuthentication" in authenticator ).toEqual( true );
				expect( Utils.isFunction( authenticator.clearAuthentication ) ).toEqual( true );
			})();

			let promises:Promise<void>[] = [];

			// Successful Authentication
			(() => {
				class SuccessfulContext extends AbstractContext {
					resolve( relativeURI:string ):string {
						return "http://example.com/successful/" + relativeURI;
					}
				}

				let expirationTime:Date = new Date();
				expirationTime.setDate( expirationTime.getDate() + 1 );
				jasmine.Ajax.stubRequest( "http://example.com/successful/auth-tokens/", null, "POST" ).andReturn( {
					status: 200,
					responseText:`[{
						"@id": "", 
						"@type": [ 
							"https://carbonldp.com/ns/v1/security#Token" 
						], 
						"https://carbonldp.com/ns/v1/security#tokenKey": "token-value", 
						"https://carbonldp.com/ns/v1/security#expirationTime": { 
							"@value": "${expirationTime.toISOString()}"  , 
							"@type": "http://www.w3.org/2001/XMLSchema#dateTime" 
						} 
					}]`,
				} );

				let context:SuccessfulContext = new SuccessfulContext();
				let authenticator:TokenAuthenticator.Class = new TokenAuthenticator.Class( context );

				promises.push( authenticator.authenticate( new UsernameAndPasswordToken( "user", "pass" ) ).then( ():void => {
					expect( authenticator.isAuthenticated() ).toEqual( true );

					authenticator.clearAuthentication();

					expect( authenticator.isAuthenticated() ).toEqual( false );
				}) );
			})();

			Promise.all( promises ).then( ():void => {
				done();
			}, ( error:Error ):void => {
				done.fail( error );
			});
		});

		it( hasMethod( INSTANCE, "supports",
			`Returns true if the Authenticator supports the AuthenticationToken.`,
			[
				{ name: "authenticationToken", type: "Carbon.Auth.AuthenticationToken" }
			],
			{ type: "boolean" }
		), ():void => {
			class MockedContext extends AbstractContext {
				resolve( uri:string ):string {
					return uri;
				}
			}
			let authenticator:TokenAuthenticator.Class = new TokenAuthenticator.Class( new MockedContext() );

			expect( authenticator.supports ).toBeDefined();
			expect( Utils.isFunction( authenticator.supports ) ).toEqual( true );

			class DummyToken implements AuthenticationToken {}

			expect( authenticator.supports( new UsernameAndPasswordToken( "user", "pass" ) ) ).toEqual( true );
			expect( authenticator.supports( new DummyToken() ) ).toEqual( false );
		});
	});
});
