import HTTPError from "./../HTTPError";

const name:string = "NotAcceptableError";
const statusCode:number = 406;

class NotAcceptableError extends HTTPError {
	static get statusCode():number { return statusCode; }

	get name():string { return name; }
}

export default NotAcceptableError;
