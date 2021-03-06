import * as Auth from "./Auth";
import Context from "./Context";
import Documents from "./Documents";
import * as ObjectSchema from "./ObjectSchema";
export declare class Class implements Context {
    auth: Auth.Class;
    documents: Documents;
    parentContext: Context;
    protected settings: Map<string, any>;
    protected generalObjectSchema: ObjectSchema.DigestedObjectSchema;
    protected typeObjectSchemaMap: Map<string, ObjectSchema.DigestedObjectSchema>;
    constructor();
    getBaseURI(): string;
    resolve(relativeURI: string): string;
    hasSetting(name: string): boolean;
    getSetting(name: string): any;
    setSetting(name: string, value: any): void;
    deleteSetting(name: string): void;
    hasObjectSchema(type: string): boolean;
    getObjectSchema(type?: string): ObjectSchema.DigestedObjectSchema;
    extendObjectSchema(type: string, objectSchema: ObjectSchema.Class): void;
    extendObjectSchema(objectSchema: ObjectSchema.Class): void;
    clearObjectSchema(type?: string): void;
    protected extendGeneralObjectSchema(digestedSchema: ObjectSchema.DigestedObjectSchema): void;
    protected extendTypeObjectSchema(digestedSchema: ObjectSchema.DigestedObjectSchema, type: string): void;
    private registerDefaultObjectSchemas();
}
export declare const instance: Class;
export default instance;
