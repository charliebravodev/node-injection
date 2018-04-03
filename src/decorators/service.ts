import {DependencyInjection} from '../dependency-injection';
import {ServiceConfig} from '../interfaces/service-config';

/**
 * Registers the annotated class as a service.
 * @returns {(target)}
 * @constructor
 */
export function Service(config?: ServiceConfig): ClassDecorator {

	const defaultConfig: ServiceConfig = {injectable: true};

	return (target) => {
		DependencyInjection.annotateService(target, Object.assign(defaultConfig, config));
		return target;
	};
}
