const app = require('./app');

function inspectStack(stack, prefix = '') {
  stack.forEach((layer) => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(',');
      console.log(`${prefix}route ${layer.route.path} [${methods}]`);
    } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      const re = layer.regexp && layer.regexp.toString();
      console.log(`${prefix}mounted ${re}`);
      inspectStack(layer.handle.stack, prefix + '  ');
    } else if (layer.name) {
      console.log(`${prefix}layer ${layer.name} ${layer.regexp ? layer.regexp.toString() : ''}`);
    }
  });
}

function listRoutes() {
  if (!app || !app._router) return console.log('No router found');
  inspectStack(app._router.stack);
}

listRoutes();
