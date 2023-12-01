export class RetryTimeoutError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'RetryTimeoutError';
    }
}


export interface RetryOptions {
    retryCount?: number;
    timeout?: number;
    onRetry?: (retryCount: integer) => void;
    onAbort?: () => void;
};

const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT = 3000;

export function withRetry<T>(
    promiseCreator: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const {
        retryCount = DEFAULT_RETRY_COUNT,
        timeout = DEFAULT_TIMEOUT,
        onRetry,
        onAbort
    } = options;

    return new Promise<T>((resolve, reject) => {
        let currentAttempt = 0;

        const runPromise = () => {
            const promise = promiseCreator();
            let timeoutId: NodeJS.Timeout | null = null;

            const onResolve = (result: T) => {
                clearTimeout(timeoutId!);
                resolve(result);
            };

            const onReject = (error: any) => {
                console.log(`on Reject with`, error);

                clearTimeout(timeoutId!);

                if (currentAttempt < retryCount) {
                    currentAttempt++;
                    if (onRetry) {
                        setTimeout(() => onRetry(currentAttempt), 250);
                    }
                    console.log(`Retrying... (Attempt ${currentAttempt})`);
                    runPromise();
                } else {
                    if (onAbort) {
                        onAbort();
                    }
                    reject(error);
                }
            };

            timeoutId = setTimeout(() => {
                onReject(new RetryTimeoutError(`Promise timed out after ${timeout}ms`));
            }, timeout);

            promise.then(onResolve).catch(onReject);
        };

        runPromise();
    });
}