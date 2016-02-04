'use strict';

module.exports = exports = stream => new Promise((resolve, reject) => {
	stream
		.on('error', reject)
		.on('end', resolve);
});
