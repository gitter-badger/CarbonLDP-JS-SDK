/// <reference path="../typings/es6-promise/es6-promise.d.ts" />
import AuthenticationToken from "./Auth/AuthenticationToken";
import * as HTTP from "./HTTP";
import Parent from "./Parent";
export declare enum Method {
    BASIC = 0,
    TOKEN = 1,
}
export declare class Class {
    private parent;
    private method;
    private authenticators;
    private authenticator;
    constructor(parent: Parent);
    isAuthenticated(askParent?: boolean): boolean;
    authenticate(username: string, password: string): Promise<void>;
    authenticate(authenticationToken: AuthenticationToken): Promise<void>;
    addAuthentication(requestOptions: HTTP.Request.Options): void;
    clearAuthentication(): void;
    private getAuthenticator(authenticationToken);
}
export default Class;
