import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { decode, verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import axios from 'axios'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-or580l07.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  logger.info(`Actual log of auth header: ${event.authorizationToken}`)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
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
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  logger.info(`token: ${token}`)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  const response = await axios.get(jwksUrl)
  const jwk = response.data
  logger.info(`jwt: ${JSON.stringify(jwt)}`)
  logger.info(`jwk: ${JSON.stringify(jwk)}`)
  const x5c = jwk.keys.find(key => key.kty === 'RSA' && key.kid === jwt.header.kid).x5c[0]
  const prefix = '-----BEGIN CERTIFICATE-----\n'
  const suffix = '\n-----END CERTIFICATE-----'
  const cert = `${prefix}${x5c}${suffix}`
  logger.info(`cert: ${cert}`)

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  const check = verify(token, cert, { algorithms: [ 'RS256' ]}) as JwtPayload
  if (check) {
    logger.info('Checks pass!')
    return jwt.payload
  }
  logger.error('Token checks fail!')
  throw new Error('Token does not pass verify')
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
