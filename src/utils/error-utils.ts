export class ErrorUtils {

	private static FORGOTTEN_SERVICE_ANNOTATION_WARNING = 'You may have forgotten to annotate the injected service with @Service().';

	public static serviceNotFound(serviceName: string): void {
		throw Error(`Service with name "${serviceName}" not found.`);
	}

	public static serviceNameNotResolved(propertyKey: string, target: any): void {
		throw Error(`Could not determine service name for property "${propertyKey}" of class ${target.name}. ${ErrorUtils.FORGOTTEN_SERVICE_ANNOTATION_WARNING}`);
	}

	public static constructorParameterServiceNameNotResolved(serviceName: string, paramIndex: number): void {
		throw Error(`The type of constructor parameter at index ${paramIndex} of service ${serviceName} could not be determined. ${ErrorUtils.FORGOTTEN_SERVICE_ANNOTATION_WARNING}`);
	}
}
