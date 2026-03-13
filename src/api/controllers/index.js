const apiRoutes = require('__V_API_ROUTES__');

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

function matchPath(requestPath, routePath) {
  const routeParts = routePath.split('/').filter(Boolean);
  const requestParts = requestPath.split('/').filter(Boolean);

  if (routeParts.length !== requestParts.length) return null;

  const params = {};
  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(':')) {
      params[routeParts[i].slice(1)] = requestParts[i];
    } else if (routeParts[i] !== requestParts[i]) {
      return null;
    }
  }
  return params;
}

function handleApiRoute(req, res, next, handler) {
  const mod = handler.default ? handler : handler;

  if (mod.default) {
    mod.default(req, res, next);
    return;
  }

  const methodHandler = mod[req.method];
  if (methodHandler) {
    methodHandler(req, res, next);
  } else {
    res.statusCode = 405;
    res.setHeader('Allow', HTTP_METHODS.filter(m => mod[m]).join(', '));
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }
}

function registerControllers(hiddie) {
  hiddie.use('/health', (req, res) => {
    res.json({ status: true });
  });

  hiddie.use('/liveness', (req, res) => {
    res.json({ status: true });
  });

  if (!apiRoutes || !apiRoutes.length) return;

  apiRoutes.forEach(({ path: routePath, handler }) => {
    hiddie.use(routePath, (req, res, next) => {
      handleApiRoute(req, res, next, handler);
    });
  });
}

export function createApiMiddleware() {
  return function apiMiddleware(req, res, next) {
    if (!apiRoutes || !apiRoutes.length) {
      next();
      return;
    }

    const reqPath = req.path || req.url;

    for (const route of apiRoutes) {
      const params = matchPath(reqPath, route.path);
      if (params !== null) {
        req.params = Object.assign(req.params || {}, params);
        handleApiRoute(req, res, next, route.handler);
        return;
      }
    }

    next();
  };
}

export default registerControllers;
