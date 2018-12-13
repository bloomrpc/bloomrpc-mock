import {Command, flags} from '@oclif/command'
import {startGRPCServer} from "../server";
import {red, white, yellow} from "colors/safe";
import * as path from "path";

class Bloomrpc extends Command {
  static description = 'Automock a GRPC Server from a proto definition';

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),

    port: flags.string({char: 'p', default: "3009"})
  };

  static args = [{name: 'file'}];

  async run() {
    const {args, flags} = this.parse(Bloomrpc);

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

    try {

      if (!args.file) {
        console.log(yellow("Please provide a path to .proto file definition"));
        return;
      }

      const serverPort = flags.port || "3009";
      const protoPath = path.resolve(process.cwd(), args.file);

      await startGRPCServer(protoPath, serverPort);
    } catch (e) {
      console.log(red("OHOH! An error occurred while starting the GRPC mock server."));
      console.log(e);
    }
  }
}

export = Bloomrpc
