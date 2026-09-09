/**
 * Logger utility for the build process
 */
export class BuildLogger {
  private static logPrefix = "[Build]";

  public static info(message: string): void {
    console.log(`${this.logPrefix} ${message}`);
  }

  public static warn(message: string): void {
    console.warn(`${this.logPrefix} WARNING: ${message}`);
  }

  public static error(message: string): void {
    console.error(`${this.logPrefix} ERROR: ${message}`);
  }

  public static success(message: string): void {
    console.log(`${this.logPrefix} ✓ ${message}`);
  }
}
