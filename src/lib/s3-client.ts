import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

let client: S3Client

export const getS3Client = (): S3Client => {
  if (!client) {
    client = new S3Client({
      region: process.env.AWS_REGION as string,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string
      }
    })
  }
  return client
}

export const uploadFile = async (key: string, file: any) => {
  const client = getS3Client()
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: file,
    ACL: 'public-read'
  })

  const res = await client.send(command)
  return res.$metadata.httpStatusCode
}
