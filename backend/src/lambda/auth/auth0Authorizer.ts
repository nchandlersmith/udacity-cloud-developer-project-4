import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Mocking authorization...')
  logger.info(`Auth event: ${event}`)
  logger.info('User was authorized')

  return {
    principalId: 'Ghost Rider',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: '*'
        }
      ]
    }
  }
}
