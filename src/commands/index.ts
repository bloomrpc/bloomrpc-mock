import {Command, flags} from '@oclif/command';
import {red, white, yellow} from 'colors/safe';
import * as path from 'path';

import {startGRPCServer} from '../server';
import * as fs from "fs";

class Bloomrpc extends Command {
  static description = 'Automock a GRPC Server from a proto definition';

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),

    port: flags.string({char: 'p', default: '3009'}),
    rootCert: flags.string({char: 'r'}),
    keyCertPairs: flags.string({char: 'k'}),
    include: flags.string({char: 'i', multiple: true}),
  };

  static args = [{name: 'file'}];

  async run() {
    const {args, flags} = this.parse(Bloomrpc);

    /* tslint:disable */
    console.log(
      white(`
     _______    .---.      ,-----.       ,-----.   ,---.    ,---.-------.   .-------.    _______   
    \\  ____  \\  | ,_|    .'  .-,  '.   .'  .-,  '. |    \\  /    |  _ _   \\  \\  _(\`)_ \\  /   __  \\  
    | |    \\ |,-./  )   / ,-.|  \\ _ \\ / ,-.|  \\ _ \\|  ,  \\/  ,  | ( ' )  |  | (_ o._)| | ,_/  \\__) 
    | |____/ /\\  '_ '\`);  \\  '_ /  | ;  \\  '_ /  | |  |\\_   /|  |(_ o _) /  |  (_,_) ,-./  )       
    |   _ _ '. > (_)  )|  _\`,/ \\ _/  |  _\`,/ \\ _/  |  _( )_/ |  | (_,_).' __|   '-.-'\\  '_ '\`)     
    |  ( ' )  (  .  .-': (  '\\_/ \\   : (  '\\_/ \\   | (_ o _) |  |  |\\ \\  |  |   |     > (_)  )  __ 
    | (_{;}_) |\`-'\`-'|__\\ \`"/  \\  ) / \\ \`"/  \\  ) /|  (_,_)  |  |  | \\ \`'   |   |    (  .  .-'_/  )
    |  (_,_)  / |        '. \\_/\`\`".'   '. \\_/\`\`".' |  |      |  |  |  \\    //   )     \`-'\`-'     / 
    /_______.'  \`--------\` '-----'       '-----'   '--'      '--''-'   \`'-' \`---'       \`._____.'    
    `)
    );
    // /* tslint:enable */
    try {
      if (!args.file) {
        console.log(yellow('Please provide a path to .proto file definition'));
        return;
      }

      const serverPort = flags.port || '3009';
      const protoPath = path.resolve(process.cwd(), args.file);

      let credentials;

      if (flags.rootCert) {
        const certs = (flags.keyCertPairs as string).split(',');

        credentials = {
          rootCerts: fs.readFileSync(flags.rootCert),
          keyCertPairs: [{
            private_key: fs.readFileSync(certs[0]),
            cert_chain: fs.readFileSync(certs[1]),
          }]
        };
      }

      await startGRPCServer(protoPath, serverPort, credentials, flags.include);
    } catch (e) {
      console.log(red('OHOH! An error occurred while starting the GRPC mock server.'));
      console.log(e);
    }
  }
}

export = Bloomrpc;
