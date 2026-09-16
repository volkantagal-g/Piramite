import Eev from 'eev';

// config/string.js replaces the double-quoted placeholder string below (first
// occurrence only, so it must not appear elsewhere in this file); reformatting
// the quotes breaks global style injection
// prettier-ignore
/* eslint-disable-next-line */
"__V_styles__"

if (!window.HbEventBus) {
  window.HbEventBus = new Eev();
  window.piramite_project_version = process.env.APP_BUILD_VERSION || '1.0.0';
}
