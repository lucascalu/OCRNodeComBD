const Tesseract = require('tesseract.js');
const mysql = require('mysql2');

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'teste'
});

// Local da imagem
const imagePath = './teste.PNG';

// Idioma para reconhecimento
const language = 'eng';

// Opções do Tesseract
const tesseractOptions = { logger: m => console.log(m) };

// Função para inserir o texto no banco de dados
const insertTextIntoDatabase = (text) => {
  // SQL para a inserção
  const sql = `INSERT INTO teste (detail) VALUES ('${text}')`;

  // Executa a query
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Erro ao inserir no banco de dados:', error);
    } else {
      console.log('Texto inserido no banco de dados com sucesso!');
    }

    // Fecha a conexão após a operação
    connection.end();
  });
};

// Função principal
Tesseract.recognize(imagePath, language, tesseractOptions)
  .then(({ data: { text } }) => {
    console.log(text);

    // Conecta ao banco de dados
    connection.connect();

    // Chama a função para inserir o texto no banco de dados
    insertTextIntoDatabase(text);
  })
  .catch(error => {
    console.error('Erro ao realizar OCR:', error);
    connection.end(); // Certifique-se de fechar a conexão em caso de erro
  });
