// MyCodeEditor.js

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const languages = [
  { label: 'C', value: 'c' },
  { label: 'C++', value: 'cpp' },
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' },
];

function MyCodeEditor() {
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('cpp');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running...');

    try {
      const response = await axios.post('http://localhost:8080/api/execute', {
        code,
        language,
        input,
      });

      setOutput(response.data.output || 'No output');
    } catch (error) {
      setOutput('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ marginRight: '10px' }}
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        <button onClick={handleRun} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run'}
        </button>
      </div>

      <Editor
        height="400px"
        language={language}
        value={code}
        onChange={setCode}
        theme="vs-dark"
        options={{ minimap: { enabled: false } }}
      />

      <h3>Custom Input:</h3>
      <textarea
        rows={5}
        style={{ width: '100%' }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <h3>Output:</h3>
      <pre style={{
        background: '#1e1e1e',
        color: '#d4d4d4',
        padding: '10px',
        borderRadius: '5px',
        minHeight: '100px'
      }}>
        {output}
      </pre>
    </div>
  );
}

export default MyCodeEditor;
