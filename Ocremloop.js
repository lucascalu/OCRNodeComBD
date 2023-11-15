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
  // Verifica se o texto foi identificado
  if (text.length > 0) {
    // SQL para a inserção
    const sql = `INSERT INTO teste (detail) VALUES (?)`;

    // Executa a query
    connection.query(sql, [text], (error, results) => {
      if (error) {
        console.error('Erro ao inserir no banco de dados:', error);
      } else {
        console.log('Texto inserido no banco de dados com sucesso!');
      }

      // Inicia a próxima iteração após 10 segundos
      setTimeout(performOCR, 10000);
    });
  } else {
    console.log('Nenhum texto identificado. Nada foi registrado no banco de dados.');

    // Inicia a próxima iteração imediatamente
    setTimeout(performOCR, 0);
  }
};

// Função principal
const performOCR = () => {
  // Conecta ao banco de dados
  connection.connect();

  Tesseract.recognize(imagePath, language, tesseractOptions)
    .then(({ data: { text } }) => {
      console.log(text);

      // Chama a função para inserir o texto no banco de dados
      insertTextIntoDatabase(text);
    })
    .catch(error => {
      console.error('Erro ao realizar OCR:', error);

      // Fecha a conexão em caso de erro
      connection.end();

      // Inicia a próxima iteração após 10 segundos em caso de erro
      setTimeout(performOCR, 10000);
    });
};

// Inicia o processo
performOCR();
