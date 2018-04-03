import { Constructor } from './interfaces/constructor';
import { ServiceConfig } from './interfaces/service-config';
import { ServiceRegistry } from './service-registry';
import { ErrorUtils } from './utils/error-utils';
import { ServiceUtils } from './utils/service-utils';

export class DependencyInjection {

	private static readonly serviceRegistry = new ServiceRegistry();

	public static annotateService(target: any, config: ServiceConfig): void {

		ServiceUtils.defineServiceNameMetadata(target, config.name || target.name);

		const serviceName: string = ServiceUtils.getServiceName(target);

		if (this.serviceRegistry.isRegistered(serviceName)) {
			throw Error(`A service with name '${serviceName}' is already registered.`);
		}

		// Resolve dependencies

		const dependenciesTypes: string[] = ServiceUtils.getConstructorParamServiceNames(target);
		const resolvedDependencies: any[] = [];

		dependenciesTypes.forEach((constructorParamServiceName, paramIndex) => {
			if (!constructorParamServiceName) {
				ErrorUtils.constructorParameterServiceNameNotResolved(serviceName, paramIndex);
			}

			const resolvedDependency: any = this.serviceRegistry.getService(constructorParamServiceName);

			if (!resolvedDependency) {
				ErrorUtils.serviceNotFound(constructorParamServiceName);
			}

			resolvedDependencies.push(resolvedDependency);
		});

		// Register service

		if (!(config.injectable === false)) {
			this.serviceRegistry.registerService(serviceName, target, resolvedDependencies);
		}
	}

	public static annotateProperty(target: any, propertyKey: string, clazz: Constructor) {

		const serviceName: string = clazz ? ServiceUtils.getServiceName(clazz) : ServiceUtils.getPropertyServiceName(target, propertyKey);

		if (!serviceName) {
			ErrorUtils.serviceNameNotResolved(propertyKey, target);
		}

		const resolvedService = this.serviceRegistry.getService(serviceName);

		if (!resolvedService) {
			ErrorUtils.serviceNotFound(serviceName);
		}

		// Delete property before overriding it.
		delete this[propertyKey];

		// Redefine the property
		Object.defineProperty(target, propertyKey, {
			value: resolvedService,
			enumerable: true,
			configurable: true,
		});
	}
}
