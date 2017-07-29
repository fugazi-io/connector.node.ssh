# connector.node.ssh

A fugazi connector for SSH client, which adds the ability to execute commands on remote hosts, from the [fugazi terminal client](https://github.com/fugazi-io/webclient)

## Installing
The connector requires [node.js](https://nodejs.org/en/) to run, if you don't have it then [download](https://nodejs.org/en/download/) or use [a package manager](https://nodejs.org/en/download/package-manager/).  

The package can be found in [npm @fugazi/connector.ssh](https://www.npmjs.com/package/@fugazi/connector.ssh):
```bash
npm install @fugazi/connector.ssh
```

You then need to compile the typescript files:
```bash
npm run compile
// or
node_modules/typescript/bin/tsc -p scripts
```

## Running
```bash
node scripts/bin/index.js --host <hostname or ip> --username <username> --keyfile <private key> [additional options]
```

### Options
#### You are required to pass the following options:

> #### --host
> The host to which to which to connect

> #### --username
> The username with which to connect

> #### --keyfile
> The path to the private key file with which to authenticate


#### You may pass the following options to the connector when running it:

> ##### --port
> The port to which to connect, default is 22
> ```bash
> node scripts/bin/index.js --port 33333
> ```

> ##### --listen-port
> The port to which this connector service is bound, default is `22222`  
> ```bash
> node scripts/bin/index.js --listen-port 23422
> ```

> ##### --listen-ip  
> The host to which this connector service is bound, default is `127.0.0.1`  
> ```bash
> node scripts/bin/index.js --listen-ip 0.0.0.0
> ```

## Using
Once the connector service starts it should print something like:
```bash
info: ===== ROUTES START =====
info: # Commands:
info:     GET : /ssh/execute
info: # Root modules:
info:     /ssh.json
info: ====== ROUTES END ======
info: server started. listening on 127.0.0.1:22222
info: connector started
```

In a fugazi terminal ([http://fugazi.io](http://fugazi.io) or if hosted anywhere else) load the module from the provided url:
```
load module from "http://localhost:22222/ssh.json"
```

Now you're ready to use the ssh module, for example:
```
execute "ls -l"
```
Should list the content of the current directory

## Supported commands
The following commands are supported:
 * execute remote shell command
 
 More commands to follow.
 
 ## Contribution
 We'll be happy to get help with this connector (as with all [fugazi repos](https://github.com/fugazi-io)), for example to 
 add unimplemented commands.  
 
 ## Contact
 Feel free to [create issues](https://github.com/fugazi-io/connector.node.ssh/issu/es) if you're running into trouble, 
 and welcome to ask any question in [our gitter](https://gitter.im/fugazi-io/Lobby).
