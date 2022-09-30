module.exports = {
	// transform: {
	//   '^.+\\.[jt]s(x)?$': 'babel-jest',
	// },
	transformIgnorePatterns: [ '/node_modules/' ],
	moduleDirectories: [ 'node_modules', '<rootDir>/node_modules', '.' ],
	setupFilesAfterEnv: [ './config/test-setup' ],
};
