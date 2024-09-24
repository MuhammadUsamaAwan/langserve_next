'use client';

import { useState } from 'react';
import { RemoteRunnable } from '@langchain/core/runnables/remote';

const chain = new RemoteRunnable({
  url: 'http://localhost:8000/llamacpp',
});

export default function HomePage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      role: 'system',
      content: 'You are a helpful assistant that can answer questions and help with tasks.',
    },
  ]);

  return (
    <div className='max-w-xl mx-auto py-20'>
      <form
        onSubmit={async e => {
          e.preventDefault();
          const newMessages = [
            ...messages,
            {
              id: crypto.randomUUID(),
              role: 'user',
              content: input,
            },
          ];
          setMessages(newMessages);
          const stream = chain.streamEvents(newMessages, {
            version: 'v1',
          });
          const id = crypto.randomUUID();
          for await (const chunk of stream) {
            if (chunk.event === 'on_chat_model_start') {
              setMessages(prev => [
                ...prev,
                {
                  id,
                  role: 'assistant',
                  content: '',
                },
              ]);
            } else if (chunk.event === 'on_chat_model_end') {
            } else {
              setMessages(prev =>
                prev.map(m =>
                  m.id === id
                    ? {
                        ...m,
                        content: m.content + chunk.data.chunk?.content,
                      }
                    : m
                )
              );
            }
          }
        }}
      >
        <input
          className='border rounded px-2 py-1 w-full border-black'
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className='space-y-4 mt-4'>
          {messages
            .filter(m => m.role !== 'system')
            .map((m, i) => (
              <div key={i}>
                {m.role === 'user' ? 'User: ' : 'AI: '} {m.content}
              </div>
            ))}
        </div>
      </form>
    </div>
  );
}
