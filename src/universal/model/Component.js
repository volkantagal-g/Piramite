import routesWithComponents from '../core/route/routesWithComponents';
import { createComponentName } from '../utils/helper';

const COMPONENTS = require('__V_COMPONENTS__').default;

export default class Component {
  static getComponentName = (path) => createComponentName(path);

  static getComponentPath = (name) => `/${name}`;

  static getComponentIsMobileFragment = (path) =>
    COMPONENTS[path].isMobileFragment ? COMPONENTS[path].isMobileFragment : false;

  static getComponentIsFullWidth = (path) =>
    COMPONENTS[path].fullWidth ? COMPONENTS[path].fullWidth : false;

  static getComponentIsPreviewQuery = (path) => COMPONENTS[path].isPreviewQuery || true;

  static getComponentObjectWithPath = (path) => routesWithComponents[path];

  static getComponentWithName = (name) => new Component(Component.getComponentPath(name));

  static getComponentWithPath = (path) => new Component(path);

  static isExist = (path) => Object.prototype.hasOwnProperty.call(routesWithComponents, path);

  constructor(path) {
    this.name = Component.getComponentName(path);
    this.path = path;
    this.isMobileFragment = Component.getComponentIsMobileFragment(path);
    this.fullWidth = Component.getComponentIsFullWidth(path);
    this.object = Component.getComponentObjectWithPath(path);
    this.isPreviewQuery = Component.getComponentIsPreviewQuery(path);
  }
}
