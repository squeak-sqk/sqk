import { program } from 'commander';
import { installDependencies } from './installer';

program
  .command('install')
  .description('Install dependencies for the project')
  .action(async () => {
    try {
      await installDependencies();
      console.log('Dependencies installed successfully.');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Installation error:', errorMessage);
    }
  });

program.parse(process.argv);