import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const nycOutputDir = path.resolve(__dirname, '.nyc_output');
const coverageOutputFile = path.resolve(__dirname, 'coverage.json');
const mergedCoverageDir = path.resolve(__dirname, 'merged_coverage');

function getSubfolders(dir: string): string[] {
    return fs.readdirSync(dir).filter(subdir => {
        return fs.statSync(path.join(dir, subdir)).isDirectory();
    });
}

function mergeCoverageReports(subfolders: string[]) {
    const coverageFiles = subfolders
        .map(folder => path.join(nycOutputDir, folder, 'coverage-final.json'))
        .filter(filePath => fs.existsSync(filePath));

    if (coverageFiles.length === 0) {
        console.error('No coverage-final.json files found in subfolders');
        process.exit(1);
    }

    const mergeCommand = `npx istanbul-merge --out ${coverageOutputFile} ${coverageFiles.join(' ')}`;
    execSync(mergeCommand, { stdio: 'inherit' });
}

function generateHtmlReport() {
    if (!fs.existsSync(coverageOutputFile)) {
        console.error(`Coverage file not found: ${coverageOutputFile}`);
        process.exit(1);
    }

    const reportCommand = `npx istanbul report --include ${coverageOutputFile} --dir ${mergedCoverageDir} html`;
    execSync(reportCommand, { stdio: 'inherit' });
}

// Main execution
const subfolders = getSubfolders(nycOutputDir);
mergeCoverageReports(subfolders);
generateHtmlReport();

console.log(`HTML coverage report generated at ${mergedCoverageDir}`);
