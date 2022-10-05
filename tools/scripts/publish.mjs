import { readCachedProjectGraph } from '@nrwl/devkit';
import { execSync } from 'child_process';
import chalk from 'chalk';
 
function invariant(condition, message) {
  if (!condition) {
    console.error(chalk.bold.red(message));
    process.exit(1);
  }
}
 
// get anything passed from the cli
const [, , name] = process.argv;
 
const graph = readCachedProjectGraph();
const project = graph.nodes[name];
 
invariant(
  project,
  `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`
);
 
// capture NX's specifc dist path
const outputPath = project.data?.targets?.build?.options?.outputPath;
invariant(
  outputPath,
  `Could not find "build.options.outputPath" of project "${name}". Is project.json configured  correctly?`
);
 
// change the working directory to the dist/package_name
process.chdir(outputPath);

// Execute "npm publish" to publish the package to NPM registry
execSync(`npm publish --access public`);
