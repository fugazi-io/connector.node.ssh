import * as ssh from "ssh2"
import * as connector from "@fugazi/connector";
import program = require("commander");
const pjson = require("../../package.json");


const VERSION = pjson.version as string,
	DEFAULT_IP = "127.0.0.1",
	DEFAULT_LISTEN_PORT = 22222,
	DEFAULT_SSH_PORT = 22;

let host: string, port: number, username: string, keyfile: string;


function executeSSH(request: connector.server.Request): Promise<connector.server.Response> {
	const client = new ssh.Client();

	return new Promise<connector.server.Response>((resolve, reject) => {
		client.on("ready", () => {
			client.exec(request.data('cmd'), (err, stream) => {
				if (err) {
					reject({
						status: connector.server.ResponseStatus.Failure,
						error: err
					});
					return;
				}

				stream.on("close", (code: number, signal: number) => {
					if (code === 0) {
						reject({
							status: connector.server.ResponseStatus.Failure,
							error: `Connection failed with exit code: ${code}`
						});
						client.end();
					}
				}).on("data", (data: string) => {
					resolve({
						status: connector.server.ResponseStatus.Success,
						data: data.toString().trim()
					});
					client.end();
				}).stderr.on("data", (data: string) => {
					reject({
						status: connector.server.ResponseStatus.Failure,
						error: data.toString().trim()
					});
					client.end();
				});
			})
		}).connect({
			host: host,
			port: port,
			username: username,
			privateKey: require('fs').readFileSync(keyfile)
		});
	});
}

(() => {
	program.version(VERSION)
		.option("--host [host-name or ip]", "The host to connect to")
		.option("--port [host-port]", `The port to connect to (${DEFAULT_SSH_PORT} by default)`)
		.option("--username [username]", "The username with which to connect")
		.option("--keyfile [path to key file]", "The path to the private key file with which to authenticate")
		.option("--listen-ip [ip]", "IP on which the service will listen on")
		.option("--listen-port [port]", "Port on which the service will listen on")
		.parse(process.argv);

	host = program.host;
	port = program.port || DEFAULT_SSH_PORT;
	username = program.username;
	keyfile = program.keyfile;

	const listenIP = program.listenIp || DEFAULT_IP;
	const listenPort = Number(program.listenPort) || DEFAULT_LISTEN_PORT;

	const builder = new connector.ConnectorBuilder();
	builder.server().host(listenIP).port(listenPort);
	const module = builder.module({
		name: "ssh",
		title: "SSH connector"
	});

	builder.module({
		name: "ssh",
		title: "SSH connector"
	}).command("execute", {
		title: "Execute command",
		returns: "string",
		syntax: ["execute (cmd string)"]
	}).handler(executeSSH);

	let CONNECTOR = builder.build();
	CONNECTOR.start().then(() => CONNECTOR.logger.info("connector started"));
})();
