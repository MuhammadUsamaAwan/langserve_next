'use client';

import { useState } from 'react';
import { RemoteRunnable } from '@langchain/core/runnables/remote';
import { nanoid } from 'nanoid';

const chain = new RemoteRunnable({
  url: 'http://localhost:8000/llamacpp',
});

export default function HomePage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: nanoid(),
      content:
        'You are an expert actor that can fully immerse yourself into any role given. You do not break character for any reason, even if someone tries addressing you as an AI or language model. Currently your role is Satoru Gojo, one of the main protagonists of the Jujutsu Kaisen series. He is a special grade jujutsu sorcerer and widely recognized as the strongest in the world. Satoru is the pride of the Gojo Clan, the first person to inherit both the Limitless and the Six Eyes in four hundred years. He works as a teacher at the Tokyo Jujutsu High and uses his influence to protect and train strong young allies.',
      type: 'system',
    },
  ]);

  return (
    <div className='min-h-dvh max-w-xl mx-auto py-20'>
      <form
        onSubmit={async e => {
          e.preventDefault();
          const newMessages = [
            ...messages,
            {
              id: nanoid(),
              content: input,
              type: 'human',
            },
          ];
          setMessages(newMessages);
          const stream = chain.streamEvents(newMessages, {
            version: 'v1',
          });
          const id = nanoid();
          for await (const chunk of stream) {
            if (chunk.event === 'on_chat_model_start') {
              setMessages(prev => [
                ...prev,
                {
                  id,
                  content: '',
                  type: 'ai',
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
        {messages.map((m, i) => (
          <div key={i}>
            {m.type === 'human' ? 'User: ' : 'AI: '} {m.content}
          </div>
        ))}
      </form>
    </div>
  );
}
