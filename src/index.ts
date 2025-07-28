import { fetchPackageMetadata, fetchPackageTarball } from './fetcher';
import { PackageStore } from './installer';

async function main() {
  const pkgName = 'lodash';
  const versionRange = '^4.17.0';

  const metadata = await fetchPackageMetadata(pkgName, versionRange);
  const tarballUrl = metadata.dist.tarball;
  // Use integrity if available, otherwise fallback to shasum (for npm registry compatibility)
  // Check for 'integrity' property, fallback to 'shasum' if not present
  const integrity: string = 'integrity' in metadata.dist
    ? (metadata.dist as any).integrity
    : metadata.dist.shasum || '';

  const tarball = await fetchPackageTarball(tarballUrl, integrity);

  const store = new PackageStore();
  const savedPath = await store.savePackage(metadata, tarball);

  console.log(`Package saved at: ${savedPath}`);
}

main().catch(err => {
  console.error('Error:', err);
});