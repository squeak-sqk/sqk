import * as fs from 'fs/promises';
import * as path from 'path';
import { PackageMetadata } from './types';
import { fetchPackageTarball } from './fetcher';

export class PackageStore {
  private storePath: string;

  constructor(storePath?: string) {
    const home =
      process.env.HOME ||
      process.env.USERPROFILE || // Windows fallback
      process.cwd();
    this.storePath = storePath || path.join(home, '.hyperpack', 'store');
  }

  async savePackage(metadata: PackageMetadata, tarball: Buffer): Promise<string> {
    const packagePath = path.join(this.storePath, `${metadata.name}-${metadata.version}`);
    await fs.mkdir(packagePath, { recursive: true });
    const tarballPath = path.join(packagePath, 'package.tar.gz');
    await fs.writeFile(tarballPath, tarball);
    return packagePath;
  }

  async getPackagePath(name: string, version: string): Promise<string | null> {
    const packagePath = path.join(this.storePath, `${name}-${version}`);
    try {
      await fs.access(packagePath);
      return packagePath;
    } catch {
      return null;
    }
  }
}