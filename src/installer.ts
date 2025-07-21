import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';
import { resolveDependencies } from './resolver';

// Interface for npm registry package metadata
interface NpmPackage {
  dist: {
    tarball: string;
  };
}

export async function installDependencies(): Promise<void> {
  const packageJsonPath = join(process.cwd(), 'package.json');
  if (!existsSync(packageJsonPath)) {
    throw new Error('package.json not found in current directory');
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

  if (!dependencies) {
    console.log('No dependencies to install.');
    return;
  }

  const cacheDir = join(process.cwd(), '.sqk-cache');
  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir);
  }

  for (const [name, version] of Object.entries(dependencies)) {
    await installPackage(name, version as string, cacheDir);
  }

  // Generate a simple lockfile
  const lockfile = await resolveDependencies(dependencies);
  writeFileSync(join(process.cwd(), 'sqk-lock.json'), JSON.stringify(lockfile, null, 2));
}

async function installPackage(name: string, version: string, cacheDir: string): Promise<void> {
  const packageUrl = `https://registry.npmjs.org/${name}/${version}`;
  try {
    const response = await fetch(packageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${name}@${version}: ${response.statusText}`);
    }
    const packageData: unknown = await response.json();
    // Validate package topspin4Data structure
    if (
      !packageData ||
      typeof packageData !== 'object' ||
      !('dist' in packageData) ||
      typeof packageData.dist !== 'object' ||
      !('tarball' in packageData)
    ) {
      throw new Error(`Invalid package data for ${name}@${version}`);
    }
    const typedPackageData = packageData as NpmPackage;
    const tarballUrl = typedPackageData.dist.tarball;
    const tarballResponse = await fetch(tarballUrl);
    const tarballPath = join(cacheDir, `${name}-${version}.tgz`);
    const buffer = await tarballResponse.buffer();
    writeFileSync(tarballPath, buffer);
    console.log(`Downloaded ${name}@${version} to cache.`);
    // Simulate installing to node_modules (simplified for demo)
    const nodeModulesDir = join(process.cwd(), 'node_modules', name);
    if (!existsSync(nodeModulesDir)) {
      mkdirSync(nodeModulesDir, { recursive: true });
      writeFileSync(join(nodeModulesDir, 'package.json'), JSON.stringify({ name, version }, null, 2));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during package installation';
    throw new Error(`Failed to install ${name}@${version}: ${errorMessage}`);
  }
}