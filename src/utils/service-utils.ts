import { Constructor } from '../interfaces/constructor';

export class ServiceUtils {

	private static readonly DESIGN_TYPE_SAFE_KEY = 'design:type:service-name';

	public static getConstructorParamServiceNames(target: any, propertyKey?: string | symbol): string[] {
		const paramsTypes: Constructor[] = Reflect.getMetadata('design:paramtypes', target, propertyKey) || [];
		return paramsTypes.map(type => ServiceUtils.getServiceName(type));
	}

	public static getPropertyServiceName(target: any, propertyKey: string): string {
		const type: Constructor = Reflect.getMetadata('design:type', target, propertyKey);
		return ServiceUtils.getServiceName(type);
	}

	public static getServiceName(clazz: Constructor): string {
		return Reflect.getMetadata(ServiceUtils.DESIGN_TYPE_SAFE_KEY, clazz);
	}

	public static defineServiceNameMetadata(target: any, value: string): void {
		Reflect.defineMetadata(ServiceUtils.DESIGN_TYPE_SAFE_KEY, value, target);
	}

}
