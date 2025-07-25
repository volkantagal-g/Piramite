<h1 align="center">
  <br>
  <a><img src="./src/assets/piramite.png" alt="piramiteJS" width="220"></a>
  <br>
  PiramiteJS - Micro Frontends Framework
  <br>
</h1>

<h4 align="center">Piramite is a micro frontends framework which is developed by Technology Team. Micro frontends help cross functional teams to make end-to-end and independent developments and deployments.</h4>

 <br>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#configs">Configs</a> •
  <a href="#tech">Technology</a> •
  <a href="#contributing">Contributing</a>
</p>

### Key Features

You can use Piramite if you need a micro frontend framework that provides following features:

- Lightweight and fast API
- Serves single and multiple components
- Preview (to visualize components)
- SEO friendly (if needed)
- CSS & SCSS support
- Supports only React (for now)

## Installation

Piramite requires [Node.js](https://nodejs.org/) v20.19.3+ to run.

Install the Piramite.

#### Yarn

```sh
$ yarn add piramitejs
```

#### Npm

```sh
$ npm install piramitejs
```

## Usage

This is an example component.

First of all, you should import `@piramite/core`.

After that we can write the component's code.

**HelloWorld.js**

```jsx
const piramite = require('@piramite/core');

import React from 'react';

const ROUTE_PATHS = {
  HELLOWORLDPAGE: '/HelloWorld'
};

const HelloWorld = ({ initialState }) => {
  return <>Hello World!</>;
};

const component = piramite.default.withBaseComponent(HelloWorld, ROUTE_PATHS.HELLOWORLDPAGE);

export default component;
```

If you want to fetch data from server side, you should add `getInitialState`.

**./conf/local.config.js**

```js
const port = 3578;

module.exports = {
  port: port,
  baseUrl: `http://localhost:${port}`,
  mediaUrl: '',
  services: {
    piramiteapi: {
      clientUrl: 'http://piramite-api.qa.getir.com',
      serverUrl: 'http://piramite-api.qa.getir.com'
    }
  },
  timeouts: {
    clientApiManager: 20 * 1000,
    serverApiManager: 20 * 1000
  }
};
```

**HelloWorld.js**

```jsx

const piramite = require('@piramite/core');

import React from 'react';
import appConfig from '../appConfig';

const ROUTE_PATHS = {
  HELLOWORLDPAGE: '/HelloWorld',
};

const HelloWorld = ({initialState}) => {
    HelloWorld.services = [appConfig.services.piramiteApi];

    HelloWorld.getInitialState = (piramiteApiClientManager, context) => {
      const config = { headers: context.headers };
      const params = {...};

      return getName({ params }, piramiteApiClientManager, config);
    };

    return (
        <>
            Hello World. My name is {initialState.name}!
        </>
    );
};

const component = piramite.default.withBaseComponent(HelloWorld, ROUTE_PATHS.HELLOWORLDPAGE);

export default component;

```

**Output For Preview**

```
Hello World. My Name is Volkan!
```

**Output For Api**

```
{
    html: ...,
    scripts: [...],
    style: [...],
    activeComponent: {
        resultPath: "/HelloWorld",
        componentName: "HelloWorld",
        url: "/HelloWorld"
    },
}
```

## Configs

Piramite requires following configurations:

| **Config**                                    | **Type**             |
| --------------------------------------------- | -------------------- |
| [appConfigFile](#appConfigFile)               | Object               |
| [dev](#dev)                                   | Boolean              |
| [distFolder](#distFolder)                     | String               |
| [publicDistFolder](#publicDistFolder)         | String               |
| [inputFolder](#inputFolder)                   | String \* `required` |
| [monitoring](#monitoring)                     | Object               |
| [port](#port)                                 | Number - String      |
| [prefix](#prefix)                             | String \* `required` |
| [ssr](#ssr)                                   | String               |
| [styles](#styles)                             | Array                |
| [output](#output)                             | Object               |
| [staticProps](#staticProps)                   | Array                |
| [routing](#routing)                           | Object               |
| [webpackConfiguration](#webpackConfiguration) | Object               |
| [sassResources](#sassResources)               | Array                |
| [criticalCssDisabled](#criticalCssDisabled)   | Boolean              |

#### appConfigFile

It should contain environment specific configurations (test, production ...).

```
appConfigFile: {
  entry: path.resolve(__dirname, './yourConfigFolder/'),
  output: {
    path: path.resolve(__dirname, './yourOutputFolder/'),
    name: 'yourFileName',
  }
}
```

#### dev

Development mode. Set to `true` if you need to debug.

`Default`: `false`

#### distFolder

The path to the folder where bundled scripts will be placed after the build.

`Default`: `./dist`

#### publicDistFolder

The path to the folder where asset files will be placed after the build.

`Default`: `./dist/assets`

#### inputFolder

The path to the folder that contains script files. It's required.

Passes this config to Babel Loader where it reads all js files under this folder.

'Piramite' converts your files to the appropriate format and optimizes them.

#### monitoring

For now, only prometheus is supported.

```
monitoring: {
  prometheus: false
}
```

> or you can set your custom js file.

```
monitoring: {
    prometheus: path.resolve(__dirname, './src/tools/prometheus.js')
}
```

#### port

`Default`: `3578`

> If you want to change the port
> you may need to change the port in appConfigFiles

#### prefix

`It is required.`

There may be different components owned by different teams using piramtes on the same page. Piramite needs to use a prefix in order to avoid conflicts issues.
This prefix is prepended to initial states and CSS class names.

> We recommend that each team use their own acronyms/prefixes.

#### ssr

`Default`: `true`
Piramite supports server side rendering.
Applications that need 'SEO' features needs to set this parameter to `true`.

#### styles

This field's value should be an array of strings. Array values should be the paths to the global CSS files.

```
styles: [
    path.resolve(__dirname, './some-css-file.scss'),
    path.resolve(__dirname, './node_modules/carousel/carousel.css')
]
```

### output

```
output: {
  client: {
    path: path.resolve(__dirname, './build/public/project/assets'),
    publicPath: path.resolve(__dirname, './src/assets'),
    filename: '[name]-[contenthash].js',
    chunkFilename: '[name]-[chunkhash].js'
  },
  server: {
    path: path.resolve(__dirname, './build/server'),
    filename: '[name].js'
  },
},
```

#### staticProps

You can pass static props to all components at the same time.

```
staticProps: [
  {'key': value}
]
```

#### routing

Piramite need two files to set routing.

```
routing: {
  components: path.resolve(__dirname, './src/appRoute/components.js'),
  dictionary: path.resolve(__dirname, './src/appRoute/dictionary.js')
}
```

#### criticalCssDisabled

Set to `false` if don't need to critical styles.

`Default`: `true`

#### webpackConfiguration

You can add your webpack configuration. They will be merged with the piramites configs.

#### sassResources

You can add sass resources to this field as string array. sass-resource-loader gonna inject those files in every sass files so you won't need to import them.

You can check [sass-resource-loader](https://github.com/shakacode/sass-resources-loader) for usage.

## New Relic Integration

Add `newrelicEnabled: true` on your config.

If you throw an error like `throw new Error({message: "Service error", code: 500})` from your fragments, Piramite detects the fields and sends each field to New Relic as a custom attribute. These fields appear with `_a` prefix to place in the first of rows on your new relic.

## Tech

Piramite uses a number of open source projects to work properly:

- [ReactJS] - A JavaScript library for building user interfaces!
- [Webpack] - Module bundler
- [babel] - The compiler for next generation JavaScript.
- [node.js] - evented I/O for the backend
- [hiddie] - fast node.js network app framework (friendly fork of [middie](https://github.com/fastify/middie))
- [Yarn] - the streaming build system

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request
