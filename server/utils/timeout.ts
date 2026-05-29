export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number
): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error('Timeout')),
      ms
    );
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}
