import AbstractError from "./../../Errors/AbstractError";
import Response from "./../Response";
declare class HTTPError extends AbstractError {
    static statusCode: number;
    name: string;
    response: Response;
    constructor(message: string, response: Response);
}
export default HTTPError;
