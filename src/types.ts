// Type definitions for HyperPack
export interface PackageJson {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface PackageMetadata {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  dist: { 
    tarball: string; shasum: string 
    latest: string;
};
}

export interface Lockfile {
  version: string;
  packages: Record<string, LockfileEntry>;
}

export interface LockfileEntry {
  version: string;
  resolved: string;
  integrity: string;
  dependencies: Record<string, string>;
}

interface PackageJsonMetadata {
  name: string;
  versions: {
    [version: string]: {
      dependencies?: Record<string, string>;
      dist: {
        tarball: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
  };
  'dist-tags'?: {
    latest: string;
  };
}