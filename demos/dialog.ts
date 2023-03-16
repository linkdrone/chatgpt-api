import dotenv from 'dotenv-safe'
import enquirer from 'enquirer'
import { oraPromise } from 'ora'

import { ChatGPTAPI } from '../src'

dotenv.config()

/**
 * Demo CLI for testing basic functionality.
 *
 * ```
 * npx tsx demos/dialog.ts
 * ```
 */
async function main() {
  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
    debug: false
  })

  const Q = [
    {
      type: 'input',
      name: 'question',
      message: 'Q:'
    }
  ]

  let parentMessageId = ''
  while (true) {
    let answers = await enquirer.prompt<{ question: string }>(Q)
    const question = answers.question

    // Reset
    if (question.toLocaleLowerCase() == 'reset') {
      parentMessageId = ''
      continue
    }

    try {
      const res = await api.sendMessage(question, {
        parentMessageId,
        onProgress: (partialResponse) => {
          process.stdout.write(partialResponse.delta)
        }
      })
      parentMessageId = res.id
    } catch (e) {
      console.error('Failed:' + e.message)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
