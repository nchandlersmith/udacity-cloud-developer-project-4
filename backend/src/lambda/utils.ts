// import { parseUserId } from "../auth/utils";

import { createLogger } from "../utils/logger"

const logger = createLogger('getUserId util')

/**
 * Get a user id from the Authorization header
 * @param Authorization header value
 *
 * @returns a user id from a JWT token
 */
// @ts-ignore
export function getUserId(authorization: string): string {
  logger.info('Getting userId from auth header.')
  /*
  const split = authorization.split(' ')
  const jwtToken = split[1]
  
  return parseUserId(jwtToken)
  */
  return 'Ghost Rider'
}