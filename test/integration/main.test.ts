import {expect} from 'chai';
import 'es6-shim';
import 'reflect-metadata';
//
// ------------------------------------------------------------
//
import {Inject} from '../../src/decorators/inject';
import {Service} from '../../src/decorators/service';
import {DependencyInjection} from '../../src/dependency-injection';

beforeEach(function() {
	(DependencyInjection as any).serviceRegistry.clearServiceRegistry();
});

describe('@Service()', function() {
	it('should inject constructor parameters', function() {
		@Service()
		class Dependency {
			test = 'hello';
		}

		let paramArg: Dependency;

		@Service()
		class Test {
			constructor(private param: Dependency) {
				paramArg = param;
			}
		}

		expect(paramArg).to.not.be.undefined;
		expect(paramArg.test).to.equal('hello');
	});

	it('should share injected instances', function() {
		@Service()
		class Dependency {

		}

		let paramArg: Dependency;
		let paramArg2: Dependency;

		@Service()
		class Test {
			constructor(private param: Dependency) {
				paramArg = param;
			}
		}

		@Service()
		class Test2 {
			constructor(private param: Dependency) {
				paramArg2 = param;
			}
		}

		expect(paramArg).to.equal(paramArg2);
	});

	describe('@Service({injectable: boolean})', function() {
		it('should not register the service when specifically marked as not injectable', function() {
			@Service({injectable: false})
			class NotRegistered {

			}

			expect((DependencyInjection as any).serviceRegistry.isRegistered(NotRegistered.name)).to.equal(false);
		});

		it('should register the service when specifically marked as injectable', function() {
			@Service({injectable: true})
			class Registered {

			}

			expect((DependencyInjection as any).serviceRegistry.isRegistered(Registered.name)).to.equal(true);
		});
	});

	it('should throw an error when two services have the same name', function() {
		expect(function() {
			@Service()
			class A {

			}

			@Service({name: 'A'})
			class B {

			}
		}).to.throw();
	});

	it('should throw an error when the service to inject is not found', function() {
		expect(function() {
			class A {

			}

			class B {
				@Inject()
				prop: A;
			}
		}).to.throw();
	});

	it('should throw an error when the service name is defined but the service is not registered', function() {
		expect(function() {
			@Service({injectable: false})
			class A {

			}

			@Service()
			class B {
				constructor(private a: A) {

				}
			}
		}).to.throw();
	});

	it('should throw an error when one of the constructor services is not registered', function() {
		expect(function() {
			class A {

			}

			@Service()
			class B {
				constructor(private a: A) {

				}
			}
		}).to.throw();
	});
});

describe('@Inject()', function() {
	it('should inject decorated properties', function() {

		@Service()
		class Dep {
			test = 'hello';
		}

		class Test {
			@Inject()
			prop: Dep;
		}

		const test = new Test();

		expect(test.prop).to.not.be.undefined;
		expect(test.prop.test).to.equal('hello');
	});

	it('should share injected instances', function() {
		@Service()
		class Dep {
			test(): string {
				return 'hello';
			}
		}

		class Test {
			@Inject()
			prop: Dep;
			@Inject()
			prop2: Dep;
		}

		class Test2 {
			@Inject()
			prop: Dep;
		}

		const test = new Test();
		const test2 = new Test2();

		expect(test.prop).to.equal(test.prop2);
		expect(test.prop).to.equal(test2.prop);
	});

	it('should override the injected type with that provided', function() {
		interface A {

		}

		@Service()
		class B implements A {

		}

		class Test {
			@Inject(B)
			prop: A;
		}

		const test = new Test();

		expect(test.prop.constructor.name).to.equal(B.name);
	});

	it('should throw an error when the service to inject is not found', function() {
		expect(function() {
			class A {

			}

			class B {
				@Inject()
				prop: A;
			}
		}).to.throw();
	});

	it('should throw an error when the service name is defined but the service is not registered', function() {
		expect(function() {
			@Service({injectable: false})
			class A {

			}

			class B {
				@Inject()
				prop: A;
			}
		}).to.throw();
	});
});
