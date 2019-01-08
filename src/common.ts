import {common} from 'protobufjs';

common('google/rpc/status.proto', {
  nested: {
    google: {
      nested: {
        rpc: {
          nested: {
            Status: {
              fields: {
                code: {
                  type: 'int32',
                  id: 1
                },
                message: {
                  type: 'string',
                  id: 2
                },
                details: {
                  rule: 'repeated',
                  type: 'google.protobuf.Any',
                  id: 3,
                }
              }
            }
          }
        }
      }
    }
  }
});
