import { ReflectionObject, Root, Service, Service as ProtoService } from "protobufjs";
import {load as grpcDef} from "@grpc/proto-loader";
import {GrpcObject, loadPackageDefinition} from "grpc";
import * as path from 'path';
import * as fs from 'fs';
import { red } from 'colors/safe';


export interface Proto {
  fileName: string,
  filePath: string,
  protoText: string,
  ast: GrpcObject,
  root: Root,
}

/**
 * Proto ast from filename
 * @param protoPath
 */
export async function fromFileName(protoPath: string): Promise<Proto> {
  const packageDefinition = await grpcDef(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

  const protoAST = loadPackageDefinition(packageDefinition);

  const root = await new Root().load(
    protoPath,
    {
      keepCase: true,
    }
  );


  const protoText = await promisifyRead(protoPath);

  return {
    fileName: protoPath.split(path.sep).pop() || "",
    filePath: protoPath,
    protoText: protoText,
    ast: protoAST,
    root,
  };
}

/**
 * Walk through services
 * @param proto
 * @param onService
 */
export function walkServices(proto: Proto, onService: (service: Service, def: any, serviceName: string) => void) {
  const {ast, root} = proto;

  Object.keys(ast)
    .forEach((serviceName) => {
      const def: any = ast[serviceName];

      // Namespace detection.
      if (typeof def === "object") {
        Object.keys(def).forEach(leaf => {
          const namespace: ReflectionObject & { [key: string]: any } | void =
            root.nested && root.nested[serviceName];

          if (!namespace) {
            return;
          }

          onService(namespace[leaf], def[leaf], `${serviceName}.${leaf}`);
        });
        return;
      }

      // No namespace, root services
      onService(serviceByName(root, serviceName), def, serviceName);
    });
}

export function serviceByName(root: Root, serviceName: string): ProtoService {
  if (!root.nested) {
    throw new Error("Empty PROTO!");
  }

  const serviceLeaf = root.nested[serviceName];
  return  root.lookupService(serviceLeaf.fullName);
}

function promisifyRead(fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', function (err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    });
  });
}
