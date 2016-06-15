/**
 * general use functions
**/

/**
 * parse url string and return url without path
**/
function genGetHostname(url) {
    var m = url.match(/^http:\/\/[^/]+/);
    return m ? m[0] : null;
}

/**
 * 
 */
function addTrailingSlash(url) {
    if (url.substr(-1) !== '/') url += '/';
    return url;
}