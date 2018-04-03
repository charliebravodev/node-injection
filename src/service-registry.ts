import {Constructor} from './interfaces/constructor';

export class ServiceRegistry {

	private readonly services = {};

	public clearServiceRegistry(): void {
		Object.keys(this.services).forEach(k => {
			delete this.services[k];
		});
	}

	public isRegistered(serviceName: string): boolean {
		return !!this.services[serviceName];
	}

	public getService(serviceName: string): any {
		return this.services[serviceName];
	}

	// @see https://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
	public registerService(serviceName: string, target: Constructor, resolvedDependencies: Constructor[]): any {
		this.services[serviceName] = new (Function.prototype.bind.apply(target, [null].concat(resolvedDependencies)))();
	}
}
