import React, { useState } from 'react';

function GroqChatDirect() {
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setQuestion(input);
    setAnswer('');
    setLoading(true);

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [{ role: 'user', content: input }],
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
          stream: false
        })
      });

      const data = await res.json();
      const responseText = data.choices?.[0]?.message?.content || 'No response';
      setAnswer(responseText);
    } catch (err) {
      setAnswer('Error: ' + err.message);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', fontFamily: 'Arial' }}>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Question:</strong>
        <div
          style={{
            background: '#f0f0f0',
            padding: '1rem',
            borderRadius: '5px',
            minHeight: '50px'
          }}
        >
          {question || 'No question yet.'}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Answer:</strong>
        <div
          style={{
            background: '#e0ffe0',
            padding: '1rem',
            borderRadius: '5px',
            minHeight: '50px',
            whiteSpace: 'pre-wrap'
          }}
        >
          {loading ? (
            'Loading...'
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: (answer || 'No answer yet.').replace(/\*\*/g, '<br />')
              }}
            />
          )}
        </div>
      </div>

      {/* Updated input area: */}
      <div
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem',
          background: '#fff',
          borderTop: '1px solid #ccc',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
        }}
      >
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flexGrow: 0, resize: 'none', height: '40px', fontSize: '1rem', padding: '0.5rem' }}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ padding: '0.5rem 1rem', fontSize: '1rem', height: '40px', cursor: 'pointer' }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default GroqChatDirect;
