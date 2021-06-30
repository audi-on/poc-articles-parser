import * as express from 'express';
import * as mustache from 'mustache-express';
import * as bodyParser from 'body-parser';
import * as got from 'got';
import * as jsdom from 'jsdom';

interface Template {
  article: string;
  title: string;
  content: {
    includes: string;
    excludes?: (p: Node) => boolean;
  };
}

const queryElements: { [k: string]: Template } = {
  'www.20minutes.fr': {
    article: '#main-content',
    title: '.nodeheader-title',
    content: {
      includes: '.hat-summary, .content > h2, .content > p',
    },
  },
  'www.lesnumeriques.com': {
    article: '',
    title: '',
    content: {
      includes: ''
    },
  },
  'www.capital.fr': {
    article: '',
    title: '',
    content: {
      includes: '',
      excludes: (p) => false,
    },
  },
};

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', __dirname + '/frontend');

function formatText(text: string): string {
  return text.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
}

function getTitle(article: Element, elements: Template) {
  const title = article.querySelector(elements.title);
  return title && title.textContent ? formatText(title.textContent) : '';
}

function getContent(article: Element, elements: Template) {
  const content: string[] = [];

  const paragraphs = article.querySelectorAll(elements.content.includes);
  paragraphs.forEach((p) => {
    if (
      !p.childNodes.length ||
      (p.childNodes.length === 1 && p.childNodes[0].textContent === '\n') ||
      (elements.content.excludes && elements.content.excludes(p))
    )
      return;
    if (p.textContent) {
      content.push(formatText(p.textContent));
    }
  });

  return content;
}

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/debug', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/parse', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.send(400);
  }

  const { hostname } = new URL(url);
  const elements = queryElements[hostname];

  if (!elements) {
    return res.send(400);
  }

  // @ts-ignore
  const response = await got(url);
  const {
    window: { document },
  } = new jsdom.JSDOM(response.body);

  const article =
    document.querySelector(elements.article) || document.createElement('div');

  res.send({
    title: getTitle(article, elements),
    content: getContent(article, elements),
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
