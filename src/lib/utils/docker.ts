import Docker from 'dockerode';
import { create } from 'domain';

const docker = new Docker();

export async function createContainer(npubs: string[], maxActiveSeats: number, id: string): Promise<string> {
    const createOptions = {
        Image: 'pablof7z/nsecbunkerd',
        name: id,
        Env: [
            `ADMIN_NPUBS=${npubs.join(',')}`,
            `MAX_ACTIVE_SEATS=${maxActiveSeats}`,
        ]
    };

    return new Promise<string>((resolve, reject) => {
        console.log('Creating container with id...', createOptions.name);

        docker.createContainer(createOptions, (err, container) => {
            if (err) {
                reject(err);
                return;
            }

            console.log({container})

            container.start((err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(container.id);
            });
        });
    });
}

export async function checkContainer(id: string): Promise<string | null> {
    try {
        const container = await docker.getContainer(id).inspect();
        return container?.Id;
    } catch (err) {
        return null;
    }
}

export async function getContainerFileContent(containerId: string, filePath: string): Promise<string | null> {
    try {
        const container = docker.getContainer(containerId);
        const exec = await container.exec({ Cmd: ['cat', '--', filePath], AttachStdout: true });
        const execStream = await exec.start({ hijack: true });

        return new Promise<string>((resolve, reject) => {
            const chunks: Buffer[] = [];

            execStream.on('data', (chunk) => {
                chunks.push(chunk);
            });

            execStream.on('end', () => {
                const content = Buffer.concat(chunks).toString('utf-8').split('bunker:')[1];

                if (content) {
                    resolve('bunker:' + content.trim());
                }

                resolve(content);
            });

            execStream.on('error', (err) => {
                reject(err);
            });
        });
    } catch (err) {
        console.error(err);
        return null;
    }
}
