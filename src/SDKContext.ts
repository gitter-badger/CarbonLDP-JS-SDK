import * as App from "./App";
import * as APIDescription from "./APIDescription";
import * as Auth from "./Auth";
import Context from "./Context";
import Documents from "./Documents";
import * as Errors from "./Errors";
import * as JSONLDConverter from "./JSONLDConverter";
import * as LDP from "./LDP";
import * as NS from "./NS";
import * as Pointer from "./Pointer";
import * as RDF from "./RDF";
import * as Utils from "./Utils";
import * as ObjectSchema from "./ObjectSchema";
import * as Agent from "./Agent";

export class Class implements Context {
	auth:Auth.Class;
	documents:Documents;

	get parentContext():Context { return null; }

	protected settings:Map<string, any>;

	protected generalObjectSchema:ObjectSchema.DigestedObjectSchema;
	protected typeObjectSchemaMap:Map<string, ObjectSchema.DigestedObjectSchema>;

	constructor() {
		this.settings = new Map<string, any>();

		this.generalObjectSchema = new ObjectSchema.DigestedObjectSchema();
		this.typeObjectSchemaMap = new Map<string, ObjectSchema.DigestedObjectSchema>();

		this.auth = new Auth.Class( this );
		this.documents = new Documents( this );

		this.registerDefaultObjectSchemas();
	}

	getBaseURI():string {
		return this.resolve( "" );
	}

	resolve( relativeURI:string ):string {
		return relativeURI;
	}

	hasSetting( name:string ):boolean {
		return  ( this.settings.has( name ) )
			||  ( !! this.parentContext && this.parentContext.hasSetting( name ) );
	}

	getSetting( name:string ):any {
		if( this.settings.has( name ) ) return this.settings.get( name );
		if( this.parentContext && this.parentContext.hasSetting( name ) ) return this.parentContext.getSetting( name );
		return null;
	}

	setSetting( name:string, value:any ):void {
		this.settings.set( name, value );
	}

	deleteSetting( name:string ):void {
		this.settings.delete( name );
	}

	hasObjectSchema( type:string ):boolean {
		if( this.typeObjectSchemaMap.has( type ) ) return true;
		if( !! this.parentContext && this.parentContext.hasObjectSchema( type ) ) return true;

		return false;
	}

	getObjectSchema( type:string = null ):ObjectSchema.DigestedObjectSchema {
		if( !! type ) {
			// Type specific schema
			if( this.typeObjectSchemaMap.has( type ) ) return this.typeObjectSchemaMap.get( type );
			if( !! this.parentContext && this.parentContext.hasObjectSchema( type ) ) return this.parentContext.getObjectSchema( type );

			return null;
		} else {
			// General schema
			if( !! this.generalObjectSchema ) return this.generalObjectSchema;
			if( !! this.parentContext ) return this.parentContext.getObjectSchema();

			throw new Errors.IllegalStateError();
		}
	}

	extendObjectSchema( type:string, objectSchema:ObjectSchema.Class ):void;
	extendObjectSchema( objectSchema:ObjectSchema.Class ):void;
	extendObjectSchema( typeOrObjectSchema:any, objectSchema:ObjectSchema.Class = null ):void {
		let type:string = objectSchema ? typeOrObjectSchema : null;
		objectSchema = !! objectSchema ? objectSchema : typeOrObjectSchema;
		let digestedSchema:ObjectSchema.DigestedObjectSchema = ObjectSchema.Digester.digestSchema( objectSchema );

		if( ! type ) {
			this.extendGeneralObjectSchema( digestedSchema );
		} else {
			this.extendTypeObjectSchema( digestedSchema, type );
		}
	}

	clearObjectSchema( type:string = null ):void {
		if( ! type ) {
			this.generalObjectSchema = !! this.parentContext ? null : new ObjectSchema.DigestedObjectSchema();
		} else {
			this.typeObjectSchemaMap.delete( type );
		}
	}

	protected extendGeneralObjectSchema( digestedSchema:ObjectSchema.DigestedObjectSchema ):void {
		let digestedSchemaToExtend:ObjectSchema.DigestedObjectSchema;
		if( !! this.generalObjectSchema ) {
			digestedSchemaToExtend = this.generalObjectSchema;
		} else if( !! this.parentContext ) {
			digestedSchemaToExtend = this.parentContext.getObjectSchema();
		} else {
			digestedSchemaToExtend = new ObjectSchema.DigestedObjectSchema();
		}

		this.generalObjectSchema = ObjectSchema.Digester.combineDigestedObjectSchemas( [
			new ObjectSchema.DigestedObjectSchema(),
			digestedSchemaToExtend,
			digestedSchema,
		] );
	}

	protected extendTypeObjectSchema( digestedSchema:ObjectSchema.DigestedObjectSchema, type:string ):void {
		let digestedSchemaToExtend:ObjectSchema.DigestedObjectSchema;
		if( this.typeObjectSchemaMap.has( type ) ) {
			digestedSchemaToExtend = this.typeObjectSchemaMap.get( type );
		} else if( !! this.parentContext && this.parentContext.hasObjectSchema( type ) ) {
			digestedSchemaToExtend = this.parentContext.getObjectSchema( type );
		} else {
			digestedSchemaToExtend = new ObjectSchema.DigestedObjectSchema();
		}

		let extendedDigestedSchema:ObjectSchema.DigestedObjectSchema = ObjectSchema.Digester.combineDigestedObjectSchemas( [
			new ObjectSchema.DigestedObjectSchema(),
			digestedSchemaToExtend,
			digestedSchema,
		] );

		this.typeObjectSchemaMap.set( type, extendedDigestedSchema );
	}

	private registerDefaultObjectSchemas():void {
		this.extendObjectSchema( LDP.RDFSource.RDF_CLASS, LDP.RDFSource.SCHEMA );
		this.extendObjectSchema( LDP.Container.RDF_CLASS, LDP.Container.SCHEMA );
		this.extendObjectSchema( LDP.BasicContainer.RDF_CLASS, LDP.Container.SCHEMA );

		this.extendObjectSchema( APIDescription.RDF_CLASS, APIDescription.SCHEMA );

		// TODO Fix error of cycle reference because the App module dependency of AbstractClass witch has a dependency with SDKContext. For now add manual data
		/* this.extendObjectSchema( App.RDF_CLASS, App.SCHEMA ); */
		this.extendObjectSchema( NS.CS.Class.Application, {
			"name": {
				"@id": NS.CS.Predicate.name,
				"@type": NS.XSD.DataType.string,
			},
			"rootContainer": {
				"@id": NS.CS.Predicate.rootContainer,
				"@type": "@id",
			},
			"allowsOrigin": {
				"@id": NS.CS.Predicate.allowsOrigin,
			},
		});

		this.extendObjectSchema( Auth.Token.RDF_CLASS, Auth.Token.CONTEXT );

		this.extendObjectSchema( Agent.RDF_CLASS, Agent.SCHEMA );
	}
}

export const instance:Class = new Class();

export default instance;
