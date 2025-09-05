Team Members: Ryandeep Shelopal

The password for user "grader" on your Apache server:
username: ssh grader@161.35.228.132
password: cse135grader101

Link to site: rshelopal.site

Details of Github auto deploy setup: On Gradescope!

Username/password info for logging into the site: On Gradescope!

REPORT (HW3):
For my report I focused on the screen width metric from static_data. I chose this because deciding which responsive breakpoints to support is one of the most common design challenges. Instead of looking at every raw pixel value, I bucketed widths into ranges similar to common frameworks, which makes the results easier to interpret and directly actionable. I used a bar chart to show the distribution across these buckets since it’s the clearest way to compare counts and spot where most users fall. Alongside the chart, I included summary statistics (median, p75, p90) and a table of counts and percentages to provide more detail.

The reasoning behind the chart types comes from matching the visualization to the question. Pie charts work well for proportions, which is why I used them for user agent share. Bar charts fit better for ordered numeric data like widths. Tables make sense for values like languages, which are long and potentially high in number. These choices were made to keep the dashboard easy to read and, more importantly, useful for decision-making. The broader lesson is that numbers should guide improvements. It’s easy to guess at which breakpoints or browsers matter, but this project shows that even a small dataset can reveal clear priorities. This same approach applies to server-side decisions like caching or indexing — measuring real behavior is a more reliable guide than relying on gut feeling.

Summary of changes to HTML file in DevTools after compression:
After enabling mod_deflate on the Apache server, the HTML file size transferred to the browser decreased. In Chrome DevTools, the Content-Length remained as the original HTML size (uncompressed), but the Transferred size showed a smaller value due to compression. This confirms that the HTML file was being compressed before being sent to the client, reducing bandwidth usage and potentially improving page load times.

Summary of removing 'server' header: (unsuccessful, but attempted)
Attempted to change the Apache ServerName so site would use rshelopal.site instead of the default domain by editing the virtual host configuration and running a config test. The test failed because the ServerTokens directive was placed inside a <VirtualHost> block, which isn’t allowed and needs to be in the global Apache config. This prevented Apache from reloading with the updated ServerName.
