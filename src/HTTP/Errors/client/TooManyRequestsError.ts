import HTTPError from "./../HTTPError";

const name:string = "TooManyRequestsError";
const statusCode:number = 429;

class TooManyRequestsError extends HTTPError {
	static get statusCode():number { return statusCode; }

	get name():string { return name; }
}

export default TooManyRequestsError;
