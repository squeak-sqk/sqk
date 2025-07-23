import * as fs from 'fs/promises';
import * as path from 'path';
import { DependencyResolver } from './resolver';
import { Installer } from './installer';
import { LockfileManager } from './lockefile';
import { PackageJson } from './types';

async function main() {
  const command = process.argv[2];
  const projectPath = process.cwd();
  if (command === 'install') {
    const pkgJsonPath = path.join(projectPath, 'package.json');
    const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, 'utf-8')) as PackageJson;
    const resolver = new DependencyResolver();
    const lockfile = await resolver.resolveDependencies(pkgJson);
    const lockfileManager = new LockfileManager(projectPath);
    await lockfileManager.save(lockfile);
    const installer = new Installer();
    await installer.install(lockfile, projectPath);
    console.log('Installation complete!');
  } else {
    console.log('Usage: hyperpack install');
  }
}

main().catch(console.error);