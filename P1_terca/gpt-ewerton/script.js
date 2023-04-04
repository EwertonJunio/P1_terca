const carousel = document.querySelector('.carousel');
const instances = M.Carousel.init(carousel, {
  fullWidth: true,
  indicators: true
});

const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

prevBtn.addEventListener('click', () => {
  instances.prev();
});

nextBtn.addEventListener('click', () => {
  instances.next();
});

class ChatGPT {
  constructor(apiKey) {
    this.inputQuestionGPT = document.querySelector('#question');
    this.resultQuestionGPT = document.querySelector('#result');
    this.buttonSendQuestion = document.querySelector('#send-question');
    this.OPEN_API_KEY = apiKey;
    this.init();
  }

  init() {
    this.inputQuestionGPT.addEventListener('keypress', (event) => {
      if (this.inputQuestionGPT.value && event.key === 'Enter') {
        this.sendQuestion();
      }
    });

    this.buttonSendQuestion.addEventListener('click', (event) => {
      this.sendQuestion();
    });
  }

  async sendQuestion() {
    const question = this.inputQuestionGPT.value;

    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.OPEN_API_KEY}`
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt: question,
          max_tokens: 2048, // Tamanho da Resposta
          temperature: 0.5 // Criatividade da API
        })
      });
      const json = await response.json();

      if (this.resultQuestionGPT.value) {
        this.resultQuestionGPT.value += '\n';
      }
      if (json.error?.message) {
        this.resultQuestionGPT.value += `Error: ${json.error.mesage}`;
      } else if (json.choices?.[0].text) {
        const text = json.choices[0].text || 'Sem resposta';
        this.resultQuestionGPT.value += `Chat GPT: ${text}`;
      }
      this.resultQuestionGPT.scrollTop = this.resultQuestionGPT.scrollHeight;

    } catch (error) {
      console.error(`Error: ${error}`);
    } finally {
      this.inputQuestionGPT.value = '';
      this.inputQuestionGPT.readOnly = true;
    }

    if (this.resultQuestionGPT) {
      this.resultQuestionGPT.value += '\n\n\n';
    }
    this.resultQuestionGPT.value += `Eu: ${question}`;
    this.inputQuestionGPT.value = 'Carregando...';

    this.resultQuestionGPT.scrollTop = this.resultQuestionGPT.scrollHeight;
  }
}

const chatGPT = new ChatGPT('API-KEY');
