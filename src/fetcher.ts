import { PackageMetadata } from './types';
import fetch from 'node-fetch';
import semver from 'semver';

export async function fetchPackageMetadata(name: string, versionRange: string): Promise<PackageMetadata> {
  const url = `https://registry.npmjs.org/${name}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch metadata for ${name}: ${response.statusText}`);
  }
  const data = await response.json() as { versions: Record<string, any> };
  const versions = Object.keys(data.versions);
  const version = semver.maxSatisfying(versions, versionRange);
  if (!version) {
    throw new Error(`No matching version found for ${name}@${versionRange}`);
  }
  const metadata = data.versions[version];
  return {
    name,
    version,
    dependencies: metadata.dependencies || {},
    dist: metadata.dist,
  };
}

export async function fetchPackageTarball(tarballUrl: string, integrity: string): Promise<Buffer> {
  const response = await fetch(tarballUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch tarball: ${response.statusText}`);
  }
  const buffer = await response.buffer();
  // Optionally verify integrity here using 'ssri' package
  // import ssri from 'ssri';
  // await ssri.checkData(buffer, integrity);
  return buffer;
}