import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';

export const RPC_TIMEOUT_MS = 30_000;

const MAX_TCP_ATTEMPTS = 3;

function isRecoverableTcp(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    /connection closed/i.test(msg) ||
    /econnrefused/i.test(msg) ||
    /socket hang up/i.test(msg)
  );
}

/**
 * Універсальний RPC: кілька спроб при обриві TCP, пауза після reconnect.
 */
export async function sendMicroserviceRpc<TResult>(
  client: ClientProxy,
  logger: Logger,
  serviceLabel: string,
  pattern: string,
  payload: unknown,
  badGatewayHint: string,
): Promise<TResult> {
  const run = () =>
    lastValueFrom(client.send<TResult>(pattern, payload).pipe(timeout(RPC_TIMEOUT_MS)));

  for (let attempt = 0; attempt < MAX_TCP_ATTEMPTS; attempt++) {
    try {
      if (attempt > 0) {
        logger.warn(
          `[${serviceLabel} ${pattern}] TCP reconnect (спроба ${attempt + 1}/${MAX_TCP_ATTEMPTS})`,
        );
        try {
          await client.close();
        } catch {
          /* ignore */
        }
        await client.connect();
        await new Promise((r) => setTimeout(r, 150 * attempt));
      }
      return await run();
    } catch (err: unknown) {
      if (!isRecoverableTcp(err)) {
        throw err;
      }
      if (attempt === MAX_TCP_ATTEMPTS - 1) {
        const detail = err instanceof Error ? err.message : String(err);
        logger.error(`[${serviceLabel} ${pattern}] усі спроби TCP вичерпано: ${detail}`, err instanceof Error ? err.stack : undefined);
        throw new HttpException(
          {
            message: badGatewayHint,
            detail,
          },
          HttpStatus.BAD_GATEWAY,
        );
      }
    }
  }

  throw new HttpException(
    { message: badGatewayHint, detail: 'TCP: unexpected retry loop exit' },
    HttpStatus.BAD_GATEWAY,
  );
}
