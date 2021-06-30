# POC ARTICLES PARSER

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com/get-npm) OR [brew](https://brew.sh/index_fr) install node

### Quick Start

Clone the repository

```
git clone git@github.com:audi-on/poc-articles-parser.git
```

Go inside the new directory

```
cd poc-articles-parser
```

Install dependencies

```
npm ci
```

Build the project

```
npm run build
```

Run the project

```
npm run local
```

### Run example template

The template for 20minutes.fr has been supplied as an example, you can test it with the url https://www.20minutes.fr/societe/2904611-20201110-coronavirus-parents-eleves-inquiets-face-spectre-retour-ecole-maison at http://localhost:3000

### Template definition

```
interface Template {
  article: string;
  title: string;
  content: {
    includes: string;
    excludes?: (p: Node) => boolean;
  };
}
```

- article: article container css selector
- title: title css selector
- content.includes: content css selectors (intro, subtitle, paragraph)
- content.excludes: called on each content.includes selector matched element. Exclude content if true.

