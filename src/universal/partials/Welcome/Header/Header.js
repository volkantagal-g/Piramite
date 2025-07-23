import React from 'react';
import { HeaderContainer, PiramiteLogo } from './styled';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

const sheet = new ServerStyleSheet();

const Header = () => {
  return (
    <HeaderContainer>
      <PiramiteLogo>
        <img width={50} src="images/piramite.png" alt="Piramite" />
        PiramiteJS
      </PiramiteLogo>
    </HeaderContainer>
  );
};

export default ReactDOMServer.renderToString(sheet.collectStyles(<Header />));
const styleTags = sheet.getStyleTags();

export { styleTags };
