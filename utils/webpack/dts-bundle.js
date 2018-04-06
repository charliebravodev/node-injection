function DtsBundlePlugin() {
}

DtsBundlePlugin.prototype.apply = function (compiler) {
	compiler.plugin('done', function () {
		var dts = require('dts-bundle');
		var removeEmptyDirectories = require('remove-empty-directories');

		dts.bundle({
			name: 'node-injection',
			main: 'dist/src/index.d.ts',
			baseDir: 'dist/',
			out: 'node-injection.d.ts',
			removeSource: true,
			outputAsModuleFolder: true // to use npm in-package typings
		});

		// Needed because dts-bundle removes source files and leavs empty directories
		removeEmptyDirectories('dist/');
	});
};

module.exports = DtsBundlePlugin;
