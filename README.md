# Node Injection

[![Build Status](https://travis-ci.org/charliebravodev/node-injection.svg?branch=master)](https://travis-ci.org/charliebravodev/node-injection)
[![codecov](https://codecov.io/gh/charliebravodev/node-injection/branch/master/graph/badge.svg)](https://codecov.io/gh/charliebravodev/node-injection)
[![npm (scoped)](https://img.shields.io/npm/v/@hashstack/node-injection.svg)](https://www.npmjs.com/package/@hashstack/node-injection)

Decorator based service / dependency injection for NodeJS and Typescript inspired from Angular and Spring.

## Getting started

Node Injection allows you to develop services that can be share throughout your application. Each service has a single instance which can be injected into other services, controllers, classes etc.

Here is a basic example of how to use Node Injection:

```typescript
// 1. Import ES6 polyfills

import "reflect-metadata";
import "es6-shim";

// 2. Create a service

@Service()
class MyService {

	private beeps: number = 0;

	beep(): string {
		this.beeps++;
		console.log(this.beeps);
	}
}

// 3. Inject your service
 
class A {
	@Inject()
	myService: MyService;
	
	constructor() {
		this.myService.beep();
	}
}

class B {
	@Inject()
	myService: MyService;
	
	constructor() {
		this.myService.beep();
	}
}

new A(); // prints "1" to the console
new B(); // prints "2" to the console
```

Services do not need to use `@Inject()`: you just declare in their constructor the services to inject, and Node Injection injects them automatically:

```typescript
@Service()
class A {
	constructor(private myService: MyService) {
		this.myService.beep();
	}
}
```

## Installing

1. Install module:
	```
	npm install node-injection --save
	```
2. If you are targeting ES5, install `reflect-metadata` and `es6-shim`:
	```
	npm install reflect-metadata es6-shim --save
	```
	and make sure to import it in the global scope (place it at the beginning of your application):
	```typescript
	import 'es6-shim';
	import 'reflect-metadata';
	```
3. In your `tsconfig.json`, make sure you have the following options:
	```
	"emitDecoratorMetadata": true,
	"experimentalDecorators": true,
	```

## Documentation

Node Injection annotations are built with simplicity, clearness and conciseness in mind. The full list of features they allow is described below. 

### Services

#### Basic usage

This class decorator registers a class as a service.

```typescript
@Service()
class A {
	
}
```

> Node Injection creates a single instance of this class. When another class or service injects this service, they access the same instance.

Services can rely on other services, all you need to do is declare dependencies in their constructor and they will automatically be injected with the appropriate instance at runtime. 

```typescript
@Service()
class A {
	constructor(private myService: MyService) {
		// this.myService....
	}
}
```

> You will get an error if you try to inject a service that is not registered (i.e. is not annotated with `@Service()`).
>
> Also note that services are identified by their class name. Hence, you cannot register two classes with the same name as services.

#### Advanced configuration

The `@Service()` decorator can be given a configuration object to alter its behavior.

| Property 			| Type 		| Description | Example |
| ------------- | ------- | ----------- | ------- |
| name 				| String 	| Override the name used to register the service. See [usage with uglified code](#usage-with-uglified-code). | `@Service({name: 'MyService'})` |
| injectable 	| Boolean | When set to `false`, the service will not be added to the registry and hence will not be injectable in other components. This option is useful when you only want constructor parameters to be injected automatically. | `@Service({injectable: false})` |

#### Usage with uglified code

By default, Node Injection uses [`Function.prototype.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name) to determine the name of the service to register (unless one is specified), and also the type of service to inject. When using this library in uglyfied code (Webpack.optimize.UglifyJsPlugin, UglifyJS...), function names are generally mangled (replaced by shorter names). This will cause service registration conflicts and injection errors.

There are two ways to prevent this problem:

1. Provide a name for each of your service:
	
	```typescript
	@Service({name: 'Test')
	class Test {
		
	}
	```
	
	When defined, Node Injection will use this property instead of `Function.name`.

2. Disable function name mangling. For Webpack's UglifyJS plugin, this is how you do it:

	```javascript
	new webpack.optimize.UglifyJsPlugin({sourceMap: true, mangle: {keep_fnames: true}})
	```
	
	The disadvantage of this approach is that code obfuscation will be reduced.

### Injecting services

 `Constructor` is used to emphasize that the given parameter must be a class. It is defined as:
```typescript
interface Constructor {
	new (): any;
}
```
which simply represents a class object:
```typescript
class MyClass {

}
```
> and `MyClass` would be the argument.

#### Basic usage

Sometimes, you want to inject services in classes that aren't services themselves. You can use the `@Inject()` property decorator to this end.

```typescript
class A {
	@Inject()
	private myService: MyService;
	
	constructor() {
		// this.myService...
	}
}
```

#### Working with interfaces

When a property type is an interface, you need to tell Node Injection which class to inject: 

```typescript
class A {
	@Inject(MyService)
	private myService: MyServiceInterface;
	
	constructor() {
		// this.myService...
	}
}
```

## Contributing

Please read [CONTRIBUTING.md](README.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* [Geoffroy Empain](http://empain.eu) - *Initial work*

See also the list of [contributors](https://github.com/charliebravodev/node-injection/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

