import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { S3 } from 'aws-sdk'
// import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
// import { getUserId } from '../utils'

const logger = createLogger('GenerateUploadUrl')
const attachmentBucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new S3({
  signatureVersion: 'v4'
})

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    logger.info(`Generating url attachment url for todoId: ${todoId}`)

    const url = s3.getSignedUrl('putObject' ,{
      Bucket: attachmentBucketName,
      Key: todoId,
      Expires: parseInt(urlExpiration)
    })

    logger.info(`${todoId} image url: ${url}`)
    

    return {
        statusCode: 200,
        body: JSON.stringify({imageUrl: url})
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
