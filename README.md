<p align="center">
  <img src="./resources/logo.png" />
</p>

BloomRPC-Mock
========

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/bloomrpc-mock.svg)](https://npmjs.org/package/bloomrpc-mock)
[![Downloads/week](https://img.shields.io/npm/dw/bloomrpc-mock.svg)](https://npmjs.org/package/bloomrpc-mock)
[![License](https://img.shields.io/npm/l/bloomrpc-mock.svg)](https://github.com/uw-labs/bloomrpc-mock/blob/master/package.json)

Automock your GRPC services! <br/>
BloomRPC-Mock is a command line utility and toolset library for working with GRPC mocks.


**Disclaimer:**
The library is still in its early stage, it has many missing features to be considered a fully fledged mock system
but we are learning and experimenting the best approaches with GRPC for then implement the right functionality.


### Installation

```
npm i bloomrpc-mock -g
```

## Usage:

```
> bloomrpc-mock {protofilepath}.proto

     _______    .---.      ,-----.       ,-----.   ,---.    ,---.-------.   .-------.    _______
    \  ____  \  | ,_|    .'  .-,  '.   .'  .-,  '. |    \  /    |  _ _   \  \  _(`)_ \  /   __  \
    | |    \ |,-./  )   / ,-.|  \ _ \ / ,-.|  \ _ \|  ,  \/  ,  | ( ' )  |  | (_ o._)| | ,_/  \__)
    | |____/ /\  '_ '`);  \  '_ /  | ;  \  '_ /  | |  |\_   /|  |(_ o _) /  |  (_,_) ,-./  )
    |   _ _ '. > (_)  )|  _`,/ \ _/  |  _`,/ \ _/  |  _( )_/ |  | (_,_).' __|   '-.-'\  '_ '`)
    |  ( ' )  (  .  .-': (  '\_/ \   : (  '\_/ \   | (_ o _) |  |  |\ \  |  |   |     > (_)  )  __
    | (_{;}_) |`-'`-'|__\ `"/  \  ) / \ `"/  \  ) /|  (_,_)  |  |  | \ `'   |   |    (  .  .-'_/  )
    |  (_,_)  / |        '. \_/``".'   '. \_/``".' |  |      |  |  |  \    //   )     `-'`-'     /
    /_______.'  `--------` '-----'       '-----'   '--'      '--''-'   `'-' `---'       `._____.'

[Service] .ItemRepository detected:
    [Method] GetByAccountID registered
    [Method] GetByID registered
    [Method] GetByIDs registered

GRPC Server listening on port 3009!
```


### Planned features:

- [ ] Being able to provide custom mocks responses
- [ ] Client Side and Bi-Directional Streaming Support
