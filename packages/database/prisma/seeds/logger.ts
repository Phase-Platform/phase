export const logger = {
  info: (message: string) => process.stdout.write(`[INFO] ${message}\n`),
  error: (message: unknown) =>
    process.stderr.write(
      `[ERROR] ${message instanceof Error ? message.message : String(message)}\n`
    ),
  success: (message: string) => process.stdout.write(`[SUCCESS] ${message}\n`),
};
