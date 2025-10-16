/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@elastic/elasticsearch', 'amqplib', 'pdf-parse']
  },
  env: {
    ELASTIC_CLOUD_ID: process.env.ELASTIC_CLOUD_ID,
    ELASTIC_API_KEY: process.env.ELASTIC_API_KEY,
    RABBITMQ_URL: process.env.RABBITMQ_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY
  }
}

module.exports = nextConfig
