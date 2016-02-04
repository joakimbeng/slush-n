'use strict';
const _prompt = require('inquirer').prompt;

module.exports = exports = questions =>
	new Promise(resolve => _prompt(questions, resolve));
