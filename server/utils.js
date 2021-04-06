import { spawn } from 'child_process';
import path from 'path';
import apis from './api';

export function bindApisToApp(app) {
  apis.forEach((api) => {
    const [type, apiInfo] = api;
    const [urlPath, action] = apiInfo;

    switch (type) {
      case 'post': app.post(urlPath, action); break;
      case 'get': app.get(urlPath, action); break;
      default: break;
    }
  });
}

export function availableRoutes(app) {
  // eslint-disable-next-line no-underscore-dangle
  const routes = app._router.stack
    .filter((r) => r.route)
    .map((r) => (
      {
        method: Object.keys(r.route.methods)[0].toUpperCase(),
        path: r.route.path,
      }
    ));

  return JSON.stringify(routes, null, 2);
}

export async function callPythonScript(scriptName, args = []) {
  return new Promise((success, reject) => {
    const directory = path.join(__dirname, '../service/');

    const script = directory + scriptName;
    const pyArgs = [script, ...args];
    const pyprog = spawn('python', pyArgs);

    let result = '';
    let resultError = '';

    pyprog.stdout.on('data', (data) => {
      result += data.toString();
    });

    pyprog.stderr.on('data', (data) => {
      resultError += data.toString();
    });

    pyprog.stdout.on('end', () => {
      if (resultError === '') {
        success(JSON.parse(result));
      } else {
        reject(resultError);
      }
    });
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
  });
}
