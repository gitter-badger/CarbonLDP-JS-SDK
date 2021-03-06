import {
	INSTANCE,

	module,
	clazz,

	isDefined,
	hasConstructor,
	hasProperty,
	hasMethod,
	extendsClass
} from "./../test/JasmineExtender";

import AbstractContext from "./../AbstractContext";
import * as Agents from "./../Agents";
import * as App from "./../App";
import PersistedApp from "./../PersistedApp";
import * as Pointer from "./../Pointer";
import * as Utils from "./../Utils";

import AppContext from "./Context";

describe( module( "Carbon/App/Context" ), ():void => {

	describe( clazz(
		"Carbon.App.Context",
		"Class that represents a Carbon Application. " +
		"It centers the scope of several services (Carbon.Auth, Carbon.Resources, etc.) into the Application's scope."
	), ():void => {
		let parentContext:AbstractContext;
		let appContext:AppContext;

		beforeEach( ():void => {
			class MockedContext extends AbstractContext {
				resolve( uri:string ):string {
					return uri;
				}
			}
			let parentContext = new MockedContext();
			let app:PersistedApp = <any> App.Factory.create( "http://example.com/platform/apps/example-app/" );
			app.rootContainer = <any> Pointer.Factory.create( "http://example.com/apps/example-app/" );
			appContext = new AppContext( parentContext, app );
		});

		it( isDefined(), ():void => {
			expect( AppContext ).toBeDefined();
			expect( Utils.isFunction( AppContext ) );
		});

		it( hasConstructor([
			{ name: "parentContext", type: "Carbon.Context" },
			{ name: "app", type: "Carbon.App.Context" },
		]), ():void => {
			expect( appContext ).toBeTruthy();
			expect( appContext instanceof AppContext );
		});

		it( extendsClass(
			"Carbon.AbstractContext"
		), ():void => {
			expect( appContext instanceof AbstractContext );
		});

		it( hasProperty(
			INSTANCE,
			"agents",
			"Carbon.Agents.Class",
			"Instance of Agents class for manage the agents inside of an application."
		), ():void => {
			expect( appContext.agents ).toBeDefined();
			expect( appContext.agents instanceof Agents.Class ).toBe( true );
		});

		it( hasMethod(
			INSTANCE,
			"resolve",
			"Resolve the URI provided in the scope of the application", [
				{ name: "uri", type: "string" }
			],
			{ type: "string" }
		), ():void => {
			expect( appContext.resolve( "/child/" ) ).toBe( "http://example.com/apps/example-app/child/" );

			expect( appContext.resolve( "/child-another/grandchild/" ) )
				.toBe( "http://example.com/apps/example-app/child-another/grandchild/" );
			expect( appContext.resolve( "http://example.com/apps/another-app/child/" ) )
				.toBe( "http://example.com/apps/another-app/child/" );
		});

	});

});
