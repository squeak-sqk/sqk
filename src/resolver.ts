import { PackageJson, PackageMetadata, Lockfile } from './types';
import { fetchPackageMetadata } from './fetcher';

export class DependencyResolver {
  private resolved: Map<string, PackageMetadata> = new Map();
  private lockfile: Lockfile = { version: '1.0.0', packages: {} };

  async resolveDependencies(pkg: PackageJson): Promise<Lockfile> {
    const queue: Array<{ name: string; versionRange: string }> = [];
    
    // Initialize with root package dependencies
    const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const [name, versionRange] of Object.entries(dependencies)) {
      queue.push({ name, versionRange });
    }

    // Parallel dependency resolution
    while (queue.length > 0) {
      const tasks = queue.splice(0, 10).map(async ({ name, versionRange }) => {
        const key = `${name}@${versionRange}`;
        if (this.resolved.has(key)) return;

        const metadata = await fetchPackageMetadata(name, versionRange);
        this.resolved.set(key, metadata);

        // Add to lockfile
        this.lockfile.packages[key] = {
          version: metadata.version,
          resolved: metadata.dist.tarball,
          integrity: metadata.dist.shasum,
          dependencies: metadata.dependencies,
        };

        // Queue sub-dependencies
        for (const [depName, depVersion] of Object.entries(metadata.dependencies)) {
          queue.push({ name: depName, versionRange: depVersion });
        }
      });

      await Promise.all(tasks);
    }

    return this.lockfile;
  }
}