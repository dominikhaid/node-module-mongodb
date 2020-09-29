function startExpress(server, serverOptions, protocol) {
	const authors = require("../routes/author");
	server.use("/api", authors);

	const stories = require("../routes/stories");
	server.use("/api", stories);

	const fans = require("../routes/fans");
	server.use("/api", fans);

	port = process.env.PORT || 5000;
	if (protocol.httpServer) protocol.httpServer.listen(port);
	if (protocol.httpsServer) protocol.httpsServer.listen(port);
	if (!protocol.httpServer && !protocol.httpsServer) server.listen(port);

	console.log("\nSequlize Api start at: " + port, "\nConfig:", serverOptions);
}

module.exports.startExpress = startExpress;
