import Docker from 'dockerode';
import fs from 'fs';

const docker = new Docker();

export async function createContainer(npubs: string[], maxActiveSeats: number, id: string): Promise<string> {
    const dataDir = process.env.DATA_DIR ?? "/home/pablo/bunkers/data";
    const bunkerDir = `${dataDir}/bunkers/${id}`;

    // create directory for bunker if it doesn't exist
    if (!fs.existsSync(bunkerDir)) {
        fs.mkdirSync(bunkerDir);
    }

    // check if dataDir/nsecbunker.db file exists, if not, copy it from defaults/
    const dbFile = `${bunkerDir}/nsecbunker.db`;
    if (!fs.existsSync(dbFile)) {
        fs.copyFileSync(`${dataDir}/defaults/nsecbunker.db`, dbFile);
    }

    const createOptions = {
        Image: 'pablof7z/nsecbunkerd',
        name: id,
        Env: [
            `ADMIN_NPUBS=${npubs.join(',')}`,
            `MAX_ACTIVE_SEATS=${maxActiveSeats}`,
        ],
        HostConfig: {
            Binds: [
                [bunkerDir, '/app/config'].join(':')
            ]
        }
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
