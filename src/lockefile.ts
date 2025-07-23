import * as fs from 'fs/promises';
import * as path from 'path';
import { Lockfile } from './types';

export class LockfileManager {
  private lockfilePath: string;
  constructor(projectPath: string) {
    this.lockfilePath = path.join(projectPath, 'hyperpack.lock');
  }
  async save(lockfile: Lockfile): Promise<void> {
    await fs.writeFile(this.lockfilePath, JSON.stringify(lockfile, null, 2));
  }
  async load(): Promise<Lockfile | null> {
    try {
      const data = await fs.readFile(this.lockfilePath, 'utf-8');
      return JSON.parse(data) as Lockfile;
    } catch {
      return null;
    }
  }
}