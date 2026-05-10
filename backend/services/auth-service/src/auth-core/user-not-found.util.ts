/** Повідомлення з database-мікросервісу при відсутності користувача (див. UserNotFoundError). */
export function isUserNotFoundMessage(message: string | undefined): boolean {
  return typeof message === 'string' && message.includes('User not found');
}
