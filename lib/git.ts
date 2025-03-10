import { execSync } from 'child_process';

export function getGitVersion(): string {
    try {
        const tag = execSync('git describe --tags --abbrev=0').toString().trim();
        return tag;
    } catch (error) {
        return 'dev';
    }
}
