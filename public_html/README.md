Summary of changes to HTML file in DevTools after compression:
After enabling mod_deflate on the Apache server, the HTML file size transferred to the browser decreased. In Chrome DevTools, the Content-Length remained as the original HTML size (uncompressed), but the Transferred size showed a smaller value due to compression. This confirms that the HTML file was being compressed before being sent to the client, reducing bandwidth usage and potentially improving page load times.

Summary of removing 'server' header: (unsuccessful, but attempted)
Attempted to change the Apache ServerName so site would use rshelopal.site instead of the default domain by editing the virtual host configuration and running a config test. The test failed because the ServerTokens directive was placed inside a <VirtualHost> block, which isn’t allowed and needs to be in the global Apache config. This prevented Apache from reloading with the updated ServerName.
