Object.defineProperty(exports, '__esModule', {
    value: true
});
/** @babel */

var DEFAULT_ACTIVE_FILE_DIR = 'Active file\'s directory';
exports.DEFAULT_ACTIVE_FILE_DIR = DEFAULT_ACTIVE_FILE_DIR;
var DEFAULT_PROJECT_ROOT = 'Project root';
exports.DEFAULT_PROJECT_ROOT = DEFAULT_PROJECT_ROOT;
var DEFAULT_EMPTY = 'Empty';

exports.DEFAULT_EMPTY = DEFAULT_EMPTY;
var config = {
    createFileInstantly: {
        title: 'Create files instantly',
        description: 'When opening files that don\'t exist, create them\n                      immediately instead of on save.',
        type: 'boolean',
        'default': false
    },
    helmDirSwitch: {
        title: 'Shortcuts for fast directory switching',
        description: 'See README for details.',
        type: 'boolean',
        'default': false
    },
    defaultInputValue: {
        title: 'Default input value',
        description: 'What should the path input default to when the dialog\n                      is opened?',
        type: 'string',
        'enum': [DEFAULT_ACTIVE_FILE_DIR, DEFAULT_PROJECT_ROOT, DEFAULT_EMPTY],
        'default': DEFAULT_ACTIVE_FILE_DIR
    }
};
exports.config = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi9jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFTyxJQUFNLHVCQUF1QixHQUFHLDBCQUEwQixDQUFDOztBQUMzRCxJQUFNLG9CQUFvQixHQUFHLGNBQWMsQ0FBQzs7QUFDNUMsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDOzs7QUFHOUIsSUFBSSxNQUFNLEdBQUc7QUFDaEIsdUJBQW1CLEVBQUU7QUFDakIsYUFBSyxFQUFFLHdCQUF3QjtBQUMvQixtQkFBVyw0R0FDbUM7QUFDOUMsWUFBSSxFQUFFLFNBQVM7QUFDZixtQkFBUyxLQUFLO0tBQ2pCO0FBQ0QsaUJBQWEsRUFBRTtBQUNYLGFBQUssRUFBRSx3Q0FBd0M7QUFDL0MsbUJBQVcsRUFBRSx5QkFBeUI7QUFDdEMsWUFBSSxFQUFFLFNBQVM7QUFDZixtQkFBUyxLQUFLO0tBQ2pCO0FBQ0QscUJBQWlCLEVBQUU7QUFDZixhQUFLLEVBQUUscUJBQXFCO0FBQzVCLG1CQUFXLDJGQUNjO0FBQ3pCLFlBQUksRUFBRSxRQUFRO0FBQ2QsZ0JBQU0sQ0FBQyx1QkFBdUIsRUFBRSxvQkFBb0IsRUFBRSxhQUFhLENBQUM7QUFDcEUsbUJBQVMsdUJBQXVCO0tBQ25DO0NBQ0osQ0FBQyIsImZpbGUiOiIvVXNlcnMva3N3ZWRiZXJnLy5hdG9tL3BhY2thZ2VzL2FkdmFuY2VkLW9wZW4tZmlsZS9saWIvY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9BQ1RJVkVfRklMRV9ESVIgPSAnQWN0aXZlIGZpbGVcXCdzIGRpcmVjdG9yeSc7XG5leHBvcnQgY29uc3QgREVGQVVMVF9QUk9KRUNUX1JPT1QgPSAnUHJvamVjdCByb290JztcbmV4cG9ydCBjb25zdCBERUZBVUxUX0VNUFRZID0gJ0VtcHR5JztcblxuXG5leHBvcnQgbGV0IGNvbmZpZyA9IHtcbiAgICBjcmVhdGVGaWxlSW5zdGFudGx5OiB7XG4gICAgICAgIHRpdGxlOiAnQ3JlYXRlIGZpbGVzIGluc3RhbnRseScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBgV2hlbiBvcGVuaW5nIGZpbGVzIHRoYXQgZG9uJ3QgZXhpc3QsIGNyZWF0ZSB0aGVtXG4gICAgICAgICAgICAgICAgICAgICAgaW1tZWRpYXRlbHkgaW5zdGVhZCBvZiBvbiBzYXZlLmAsXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBoZWxtRGlyU3dpdGNoOiB7XG4gICAgICAgIHRpdGxlOiAnU2hvcnRjdXRzIGZvciBmYXN0IGRpcmVjdG9yeSBzd2l0Y2hpbmcnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1NlZSBSRUFETUUgZm9yIGRldGFpbHMuJyxcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIGRlZmF1bHRJbnB1dFZhbHVlOiB7XG4gICAgICAgIHRpdGxlOiAnRGVmYXVsdCBpbnB1dCB2YWx1ZScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBgV2hhdCBzaG91bGQgdGhlIHBhdGggaW5wdXQgZGVmYXVsdCB0byB3aGVuIHRoZSBkaWFsb2dcbiAgICAgICAgICAgICAgICAgICAgICBpcyBvcGVuZWQ/YCxcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGVudW06IFtERUZBVUxUX0FDVElWRV9GSUxFX0RJUiwgREVGQVVMVF9QUk9KRUNUX1JPT1QsIERFRkFVTFRfRU1QVFldLFxuICAgICAgICBkZWZhdWx0OiBERUZBVUxUX0FDVElWRV9GSUxFX0RJUixcbiAgICB9LFxufTtcbiJdfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/advanced-open-file/lib/config.js
