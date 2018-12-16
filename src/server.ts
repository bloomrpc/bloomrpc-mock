import {bgCyan, green, yellow} from 'colors/safe';
import {Server, ServerCredentials} from 'grpc';
import {Service} from 'protobufjs';

import {mockServiceMethods} from './automock';
import {fromFileName, walkServices} from './protobuf';

/**
 * Start a mock GRPC Server
 */
export async function startGRPCServer(protoPath: string, serverPort: string) {
  const server = new Server({});

  const proto = await fromFileName(protoPath);

  let services = 0;
  walkServices(proto, (service, def) => {
    bindServiceToServer(service, server, def);
    services++;
  });

  if (services === 0) {
    console.log(yellow('No Services found in your proto file'));
    return;
  }

  server.bind(`0.0.0.0:${serverPort}`, ServerCredentials.createInsecure());
  server.start();

  console.log(bgCyan(`\nGRPC Server listening on port ${serverPort}!`));
}

function bindServiceToServer(service: Service, server: Server, def: any) {
  console.log(yellow(`[Service] ${service.fullName} detected:`));

  const serviceImpl = mockServiceMethods(service);

  Object.keys(serviceImpl).forEach(method =>
    console.log(green(`    [Method] ${method} registered`))
  );

  // console.log(def, serviceImpl)
  server.addService(def.service, serviceImpl);
}
