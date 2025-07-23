import PartialList, { styleTags } from './PartialList';
import Header, { styleTags as headerStyleTags } from './Header/Header';

export default () => {
  return `
    <!doctype html>
      <head>
        <title>Welcome</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            box-sizing: border-box;
          }
          body {
            background: #f5f5f5;
            margin: 0 auto;
            padding: 0;
            font-family: 'Lato', sans-serif;
            text-shadow: 0 0 1px rgba(255, 255, 255, 0.004);
            font-size: 100%;
            font-weight: 400;
          }

          .container {
            padding: 10px;
          }
        </style>
        ${styleTags}
        ${headerStyleTags}
      </head>
      <body>
        ${Header}
        <div class="container">
          ${PartialList}
        </div>
      </body>
    </html>
  `;
};
