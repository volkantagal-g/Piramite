import style from './COMPONENT_NAME.scss';

const piramite = require('@piramite/core');

function COMPONENT_NAME({ initialState }) {
  return <div className={classNames(style.root)}>'COMPONENT_NAME'</div>;
}

const component = piramite.default.withBaseComponent(COMPONENT_NAME, ROUTE_PATHS.COMPONENT_NAME);

// component.services = [piramite.default.SERVICES.piramiteapi]

/* component.getInitialState = (piramiteApiClientManager, context) => {
  return piramiteApiClientManager.get('/product').execute().then(response => response.data);
}; */

export default component;
