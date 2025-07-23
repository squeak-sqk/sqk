import { PackageMetadata } from './types';
import fetch from 'node-fetch';

export async function fetchPackageMetadata(name: string, versionRange: string): Promise<PackageMetadata> {
  const url = `https://registry.npmjs.org/${name}`;
  const response = await fetch(url);
  const data = await response.json();
  const version = Object.keys(data.versions)
    .filter(v => v.includes(versionRange.replace(/[^0-9.]/g, '')))
    .sort()
    .pop()!;
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
  const buffer = await response.buffer();
  // TODO:
  return buffer;
}