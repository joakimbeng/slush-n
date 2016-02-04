'use strict';
const path = require('path');
const pify = require('pify');
const exec = pify(require('child_process').execFile);
const gulp = require('gulp');
const conflict = require('gulp-conflict');
const jsonEditor = require('gulp-json-editor');
const mergeStream = require('merge-stream');
const all = require('promise-all');
const readPkg = require('read-pkg');
const writePkg = require('write-pkg');
const objectOmit = require('object-omit');
const xoInit = require('xo-init');
const avaInit = require('ava-init');
const stringifyAuthor = require('stringify-author');
const parseAuthor = require('parse-author');
const githubUsername = pify(require('github-username'));
const validateNpmPackageName = require('validate-npm-package-name');
const prompt = require('./prompt');
const streamToPromise = require('./stream-to-promise');

const PKG_NAME_DEFAULT = path.basename(process.cwd());

const gitInit = () => exec('git', ['init']);

const normalizePkgJson = () =>
	readPkg('package.json')
	.then(pkg => writePkg(objectOmit(pkg, ['_id', 'readme'])));

const getNpmConf = name =>
	exec('npm', ['config', 'get', name])
	.then(val => typeof val === 'string' ? val.trim() : null)
	.then(val => val === 'undefined' ? null : val);

const getAuthor = () => all({
	name: getNpmConf('init-author-name'),
	email: getNpmConf('init-author-email'),
	url: getNpmConf('init-author-url')
});

const getAuthorString = () => getAuthor().then(stringifyAuthor);

const getRepository = (author, pkgName) => (
	author.email ?
	githubUsername(author.email).then(username => `${username}/${pkgName}`) :
	Promise.resolve('')
);

const sourceFiles = files => gulp.src(files, {cwd: path.resolve(__dirname, '..')});

const dotFiles = () => sourceFiles(['.editorconfig', '.gitignore', '.travis.yml']);

const templates = () => sourceFiles(['templates/**', '!templates/package.json']);

const packageJson = () => prompt([
	{
		name: 'name',
		message: 'name',
		default: PKG_NAME_DEFAULT,
		validate(answer) {
			const result = validateNpmPackageName(answer);
			if (result.validForNewPackages) {
				return true;
			}
			return [].concat(result.errors || []).concat(result.warnings || []).join('.\n');
		}
	},
	{
		name: 'description',
		message: 'description',
		default: ''
	},
	{
		name: 'keywords',
		message: 'keywords',
		filter(answer) {
			return answer.split(/,\s*/g);
		}
	},
	{
		name: 'author',
		message: 'author',
		default() {
			const done = this.async();
			getAuthorString().then(done, () => done(''));
		}
	},
	{
		name: 'repository',
		message: 'repository',
		default(answers) {
			const done = this.async();
			const author = parseAuthor(answers.author);
			getRepository(author, answers.name).then(done, () => done(''));
		}
	}
])
.then(answers =>
	sourceFiles('templates/package.json')
		.pipe(jsonEditor(answers))
);

const copyFiles = () => packageJson()
	.then(
		packageJsonStream => mergeStream(
			packageJsonStream,
			dotFiles(),
			templates()
		)
		.pipe(conflict(process.cwd()))
		.pipe(gulp.dest(process.cwd()))
	)
	.then(streamToPromise);

module.exports = exports = function n() {
	return copyFiles()
	.then(normalizePkgJson)
	.then(gitInit)
	.then(() => xoInit({args: ['--env=node']}))
	.then(() => avaInit({args: []}));
};
