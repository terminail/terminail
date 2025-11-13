module.exports = {
    extension: ['js'],
    spec: 'tests/e2e/specs/**/*.test.js',
    timeout: 30000,
    reporter: 'spec',
    require: [
        'tests/e2e/helpers/setup.js'
    ],
    exit: true
};