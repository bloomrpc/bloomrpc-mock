import {UntypedServiceImplementation} from "grpc";
import {Enum, Field, Message, Root, Service, Type} from "protobufjs";
import * as uuid from 'uuid';

export interface MethodPayload {
  plain: {[key: string]: any},
  message: Message,
}

export type ServiceMethodsPayload = {
  [name: string]: () => MethodPayload
}

enum MethodType {
  request,
  response
}

/**
 * Mock a service
 *
 * @param service
 * @param mocks
 */
export function mockServiceMethods(
  service: Service,
  mocks: void | {} = undefined,
): UntypedServiceImplementation {

  const mockedMethodsPayloads = mockResponseMethods(service, mocks);

  return Object.keys(mockedMethodsPayloads).reduce((methods: UntypedServiceImplementation, method: string) => {

    methods[method] = (call: any, callback: any) => {
      // Server side streaming
      if (service.methods[method].responseStream) {
        setInterval(function() {
          const getMockPayload = mockedMethodsPayloads[method];
          const {message} = getMockPayload();
          call.write(message);
        }, 1000);

        setTimeout(function() {
          call.end();
        }, 10000);

        return;
      }

      const getMockPayload = mockedMethodsPayloads[method];
      const {message} = getMockPayload();
      callback(null, message);
    };

    return methods;
  }, {});
}

/**
 * Mock method response
 * @param service
 * @param mocks
 */
export function mockResponseMethods(
  service: Service,
  mocks: void | {} = undefined,
)  {
  return mockMethodReturnType(
    service,
    MethodType.response,
    mocks
  );
}

/**
 * Mock methods request
 * @param service
 * @param mocks
 */
export function mockRequestMethods(
  service: Service,
  mocks: void | {} = undefined,
) {
  return mockMethodReturnType(
    service,
    MethodType.request,
    mocks
  );
}

/**
 *
 * @param service
 * @param type
 * @param mocks
 */
function mockMethodReturnType(
  service: Service,
  type: MethodType,
  mocks: void | {} = undefined,
): ServiceMethodsPayload {
  const root = service.root;
  const serviceMethods = service.methods;

  return Object.keys(serviceMethods).reduce((methods: ServiceMethodsPayload, method: string) => {

    const serviceMethod = serviceMethods[method];

    const methodMessageType = type === MethodType.request
      ? serviceMethod.requestType
      : serviceMethod.responseType;

    const messageType = root.lookupType(methodMessageType);

    methods[method] = () => {
      let data = {};
      if (!mocks) {
        data = mockTypeFields(messageType);
      }
      return {plain: data, message: messageType.fromObject(data)};
    };

    return methods;
  }, {});
}

/**
 * Mock a field type
 * @param type
 */
function mockTypeFields(type: Type): Object {
  const fieldsData: { [key: string]: any } = {};

  return type.fieldsArray.reduce((data, field) => {
    if (field.repeated) {
      data[field.name] = [mockField(field)];
    } else {
      data[field.name] = mockField(field);
    }
    return data;
  }, fieldsData)
}

/**
 * Mock enum
 * @param enumType
 */
function mockEnum(enumType: Enum): number {
  const enumKey = Object.keys(enumType.values)[0];

  return enumType.values[enumKey];
}

/**
 * Mock a field
 * @param field
 */
function mockField(field: Field): any {
  if (field.resolvedType instanceof Type) {
    return mockTypeFields(field.resolvedType);
  }

  if (field.resolvedType instanceof Enum) {
    return mockEnum(field.resolvedType);
  }

  switch (field.type) {
    case "string":
      return interpretMockViaFieldName(field.name);
    case "number":
      return 10;
    case "bool":
      return true;
    case "int32":
      return 10;
    case "int64":
      return 20;
    case "unit32":
      return 100;
    case "unit64":
      return 100;
    case "sint32":
      return 100;
    case "sint64":
      return 1200;
    case "fixed32":
      return 1400;
    case "fixed64":
      return 1500;
    case "sfixed32":
      return 1600;
    case "sfixed64":
      return 1700;
    case "double":
      return 1.400;
    case "float":
      return 1.100;
    case "bytes":
      return new Buffer("Hello");

    default:
      const resolvedField = field.resolve();
      return mockField(resolvedField);
  }
}

/**
 * Tries to guess a mock value from the field name.
 * Default Hello.
 * @param fieldName
 */
function interpretMockViaFieldName(fieldName: string): string {
  const fieldNameLower = fieldName.toLowerCase();

  if (fieldNameLower.startsWith('id') || fieldNameLower.endsWith('id')) {
    return uuid.v4()
  }

  return "Hello";
}
