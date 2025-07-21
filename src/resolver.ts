export interface LockfileEntry {
  name: string;
  version: string;
  resolved: string;
}

export async function resolveDependencies(dependencies: Record<string, string>): Promise<LockfileEntry[]> {
  const lockfile: LockfileEntry[] = [];
  for (const [name, version] of Object.entries(dependencies)) {
    lockfile.push({
      name,
      version,
      resolved: `https://registry.npmjs.org/${name}/${version}`
    });
  }
  return lockfile;
}