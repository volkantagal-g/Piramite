import React from 'react';
import structUtils from '../../utils/struct';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

import {
  List,
  ListItem,
  Name,
  Url,
  Footer,
  Label,
  Dot,
  Link,
  HeaderName,
  NoContentDescription,
  Description
} from './styled';
import partials from './partials';

const sheet = new ServerStyleSheet();

const Welcome = () => {
  const { live = [], dev = [], page = [] } = structUtils.groupBy(partials, item => item.status);

  const renderItem = item => (
    <ListItem>
      <Link href={item.previewUrl ? item.previewUrl : `${item.url}?preview`} target="_blank">
        <Name>{item.name}</Name>
        <Url>{item.url}</Url>
        <Footer>
          <Label status={item.status}>
            {item.status} <Dot status={item.status} />
          </Label>
        </Footer>
      </Link>
    </ListItem>
  );
  return (
    <List>
      <HeaderName>Live</HeaderName>
      <Description>This area displays your live projects.</Description>
      {live.map(item => renderItem(item))}
      {live.length === 0 && (
        <NoContentDescription>
          <span>❌</span> No live projects found.
        </NoContentDescription>
      )}
      <HeaderName>Pages</HeaderName>
      <Description>This area displays your pages.</Description>
      {page.map(item => renderItem(item))}
      {page.length === 0 && (
        <NoContentDescription>
          <span>❌</span> No pages found.
        </NoContentDescription>
      )}
      <HeaderName>Development</HeaderName>
      <Description>This area displays your development projects.</Description>
      {dev.map(item => renderItem(item))}
      {dev.length === 0 && (
        <NoContentDescription>
          <span>❌</span> No development projects found.
        </NoContentDescription>
      )}
    </List>
  );
};
export default ReactDOMServer.renderToString(sheet.collectStyles(<Welcome />));
const styleTags = sheet.getStyleTags();

export { styleTags };
