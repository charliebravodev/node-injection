import {DependencyInjection} from '../dependency-injection';
import {Constructor} from '../interfaces/constructor';

/**
 * Injects the annotated property with the instance of the referenced service.
 * @param {Constructor} clazz If provided, this class will be used for the injection.
 * @returns {(target: Object, propertyKey: (string | symbol), parameterIndex: number) => any}
 * @constructor
 */
export function Inject(clazz?: Constructor): PropertyDecorator {
	return (target: Object, propertyKey: string) => {
		DependencyInjection.annotateProperty(target, propertyKey, clazz);
	};
}
