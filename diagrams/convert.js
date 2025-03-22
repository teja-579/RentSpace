const { exec } = require('child_process');

const diagrams = [
  'system_architecture.md',
  'database_schema.md',
  'api_flow.md'
];

diagrams.forEach(diagram => {
  const input = `diagrams/${diagram}`;
  const output = `diagrams/${diagram.replace('.md', '.png')}`;

  
  exec(`mmdc -i ${input} -o ${output}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error converting ${diagram}:`, error);
      return;
    }
    console.log(`Successfully converted ${diagram} to ${output}`);
  });
});
