import * as Fragment from "./Fragment";
import * as NamedFragment from "./NamedFragment";
import * as PersistedFragment from "./PersistedFragment";

export interface Class extends PersistedFragment.Class, NamedFragment.Class {

}

export class Factory {
	static decorate<T extends Fragment.Class>( fragment:T, snapshot:Object = {} ):T & Class {
		PersistedFragment.Factory.decorate( fragment, snapshot );

		return <any> fragment;
	}
}

export default Class;
