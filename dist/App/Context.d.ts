import AbstractContext from "./../AbstractContext";
import Agents from "./../Agents";
import Context from "./../Context";
import PersistedApp from "./../PersistedApp";
export declare class Class extends AbstractContext {
    agents: Agents;
    private app;
    private base;
    constructor(parentContext: Context, app: PersistedApp);
    resolve(uri: string): string;
    private getBase(resource);
}
export default Class;
