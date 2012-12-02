wordpress-importer-cli
======================

Uses [CasperJS|http://casperjs.org] to import wordpress WXR files from the command line. https://github.com/kovshenin/wordpress-cli didn't have support for this feature at the time.

Usage:

Make sure you have CasperJS installed (using the instructions on their site), then run this script as follows:

casperjs wxr-uploader.js http://my.wordpress.com/site/ admin password import.wxr

It will print out any import notices from Wordpress to std out.
