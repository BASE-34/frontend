/**
 * Mock for @sveltejs/kit error function used in tests.
 */
export function error(status: number, message: string | { message: string }): never {
  const body = typeof message === 'string' ? { message } : message;
  throw { status, body };
}

export function fail(status: number, data: unknown) {
  return { status, data };
}

export function redirect(status: number, location: string): never {
  throw { status, location };
}
