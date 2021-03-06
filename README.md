# [CarbonLDP JavaScript SDK](http://carbonldp.com/)
JavaScript SDK that simplifies the use of CarbonLDP's REST API.

## Development Setup
1. Install Dependencies
    - [node.js](https://nodejs.org/en/)
    - gulp: `npm install gulp -g`
2. cd into the project's root directory
3. Run `npm install`
4. Run `npm run-script install-dev`
4. To build the source code run `npm start`

## Gulp Tasks
1. `build`: Same as `npm start`. Build the source code and prepare it for production (inside the dist/ folder)
2. `lint`: Same as `npm lint`. Run TSLint over the source code to perform static code analysis.

## File Structure
- **build**: Build related scripts.
    - **license.js**: Contains the license to append to the build.
    - **sfx.js**: Main file that feeds the SFX building process. Requires Carbon and exposes it in the global environment.
- **dist**: Compiled files.
    - **bundles**: Contains different versions of Carbon, bundled for simplicity.
        **Carbon.sfx.js**: Bundle that contains Carbon and all of its dependencies. Carbon is exposed in the global environment.
    - **js**: The whole -non bundled- library. Useful for JSPM based applications.
- **node_modules**: npm dependencies (don't touch them)
- **resources**: Additional resources (may be removed)
- **scripts**: Scripts that aid in the workflow
    - **copy-hooks.js**: Copies `pre-commit` to .git when `npm install` is called.
    - **pre-commit**: Builds Carbon and adds the dist folder to the commit. Makes sure there's a fresh build in each commit.
- **src**: Source files
- **test**: Test framework related files (not the real tests)
- **typings**: TypeScript description files
- **.gitignore**: Git configuration file to mark which files to ingore
- **CHANGELOG.md**: File to track changes. Any new addition needs to be added here
- **gulpfile.js**: Gulp configuration file
- **karma.conf.js**: Karma test runner configuration file
- **LICENSE**: Self explanatory
- **package.json**: npm configuration file
- **README.md**: === this
- **test-main.js**: RequireJS configuration file to be loaded by karma
- **tsd.json**: tsd configuration file
- **tslint.json**: tslint configuration file

## License

	Copyright (c) 2015-present, Base22 Technology Group, LLC.
	All rights reserved.

	This source code is licensed under the BSD-style license found in the
	LICENSE file in the root directory of this source tree.