import Auth from "./Auth";
import Documents from "./Documents";
import * as ObjectSchema from "./ObjectSchema";
interface Context {
    auth: Auth;
    documents: Documents;
    parentContext: Context;
    getBaseURI(): string;
    resolve(relativeURI: string): string;
    hasSetting(name: string): boolean;
    getSetting(name: string): any;
    setSetting(name: string, value: any): any;
    deleteSetting(name: string): any;
    hasObjectSchema(type: string): boolean;
    getObjectSchema(type: string): ObjectSchema.DigestedObjectSchema;
    getObjectSchema(): ObjectSchema.DigestedObjectSchema;
    extendObjectSchema(type: string, objectSchema: ObjectSchema.Class): void;
    extendObjectSchema(objectSchema: ObjectSchema.Class): void;
    clearObjectSchema(type: string): void;
    clearObjectSchema(): void;
}
export default Context;
