import * as chai from 'chai';
import {expect} from 'chai';
import 'es6-shim';
import 'reflect-metadata';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import {DependencyInjection} from './dependency-injection';
import {ServiceUtils} from './utils/service-utils';

chai.use(sinonChai);

describe('DependencyInjection', function() {
	describe('annotateService', function() {
		it('should define metadata with the service name', function() {
			class A {

			}

			const ReflectUtils_definedClassNameMetadata = sinon.stub(ServiceUtils, 'defineServiceNameMetadata').returns(undefined);

			DependencyInjection.annotateService(A, {});

			expect(ReflectUtils_definedClassNameMetadata).to.have.been.called;
		});
	});
});
