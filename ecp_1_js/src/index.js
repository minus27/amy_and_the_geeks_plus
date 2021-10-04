fastly.enableDebugLogging(true);

addEventListener('fetch', event => event.respondWith(handleRequest(event)));

var DEBUG = {
  OPTS: {},
  init: function(url) {
    const qs_param_names = ['use_httpbin_backend','log_headers','log_dictionary_parsing'];
    qs_param_names.forEach( qs_param_name => {
      let option_name = qs_param_name.toUpperCase();
      this.OPTS[option_name] = url.searchParams.get(qs_param_name) == '1';
      if (this.OPTS[option_name]) url.searchParams.delete(qs_param_name);
    }, this);
    console.log(`DEBUG ${JSON.stringify(this.OPTS)}`);
  }
}

async function handleRequest(event) {

  console.log('----------')
  const dictSettings = new Dictionary('settings');

  let req = event.request;
  let method = req.method;
  let url = new URL(req.url);

  DEBUG.init(url);

  let path = url.pathname;
  let method_path = `${method} ${path}`;
  const demoMode = (method_path == 'GET /demo.html');
  if (demoMode) method_path = 'GET /';

  let hostName;
  let bereqOpts = { method: method, headers: req.headers };

  bereqOpts['cacheOverride'] = new CacheOverride("override", { ttl: 0 });
  let newUrl = url;
  
  switch (method_path) {
    case 'GET /api/v2/status.json':
      // Spoof response to status update requests ever 60 seconds
      return createResponse('', {status: 304}, 'Status update response spoofed');
    case 'GET /fsm.js':
    case 'GET /fsm.css':
    case 'GET /fsp.js':
    case 'GET /fsp.css':
      // Prepare request from assets on GitHub
      /*
      hostName = 'api.github.com';
      bereqOpts.backend = 'api_github_com';
      bereqOpts.headers.set('Authorization', 'token XXXXX');
      bereqOpts.headers.set('Accept', 'application/vnd.github.v4.raw');
      newUrl.pathname = newUrl.pathname.replace(/([^/]+)$/, `repos/minus27/fastly-status-map/contents/aatg/$1`);
      */
      //https://raw.githubusercontent.com/minus27/amy_and_the_geeks_plus/main/html_assets/
      hostName = 'raw.githubusercontent.com';
      bereqOpts.backend = 'raw_githubusercontent_com';
      newUrl.pathname = newUrl.pathname.replace(/([^/]+)$/, `minus27/amy_and_the_geeks_plus/main/html_assets/$1`);
      break;
    default:
      if (newUrl.pathname == '/demo.html') newUrl.pathname = '/';
      bereqOpts.headers.set('Referer', 'https://status.fastly.com/');
      hostName = 'status.fastly.com';
      bereqOpts.backend = 'status_fastly_com';
  }
  bereqOpts.headers.delete("Accept-Encoding");
  bereqOpts.headers.set('Host', hostName);

  newUrl.host = hostName;

  console.log(`URL = ${newUrl}\nMethod = ${method}\nBackend = ${bereqOpts.backend}`);
  if (DEBUG.OPTS.LOG_HEADERS) logHeaders(bereqOpts.headers);

  if (DEBUG.OPTS.USE_HTTPBIN_BACKEND) {
    bereqOpts.headers.set('Z-Method', bereqOpts.method);
    bereqOpts.method = 'GET';
    bereqOpts.headers.set('Z-URL', newUrl);
    newUrl = 'https://httpbin.org/anything';
    bereqOpts.headers.set('Z-Host', hostName);
    bereqOpts.headers.set('Host', 'httpbin.org');
    bereqOpts.headers.set('Z-Backend', bereqOpts.backend);
    bereqOpts.backend = 'httpbin_org';
    console.log(`* URL = ${newUrl}\n* Method = ${method}\n* Backend = ${bereqOpts.backend}`);
    if (DEBUG.OPTS.LOG_HEADERS) logHeaders(bereqOpts.headers);
  }

  try {
    var beresp = await fetch(newUrl, bereqOpts);
    var berespBody = await beresp.text();
  } catch(err) {
    console.error(err.message);
    return createResponse('Internal Server Error', {status: 500}, err.message);
  }

  let berespOpts = { status: beresp.status, headers: beresp.headers };

  if (bereqOpts.backend == "api_github_com" || bereqOpts.backend == "raw_githubusercontent_com") {
    const mimetypes = {
      'css':'text/css',
      'html':'text/html',
      'js':'text/javascript',
      'txt':'text/plain'
    };
    let fileExt = path.replace(/^.*\./, '');
    if (!(fileExt in mimetypes)) fileExt = 'txt';
    berespOpts.headers.set('Content-Type', mimetypes[fileExt]);
  }
  
  console.log(`${method_path} ${beresp.status}`);
  if (hostName == 'status.fastly.com' && method_path == 'GET /' && beresp.status == 200) {
    let newText, insertSteps;
    
    let googleMapsApiKey = parseDictItem(dictSettings, 'GOOGLE_MAPS_API_KEY');
    newText = parseDictItem(dictSettings, 'head_content').replace('GOOGLE_MAPS_API_KEY', googleMapsApiKey);
    insertSteps = parseDictItem(dictSettings, 'head_steps');
    berespBody = insertText('HEAD content', berespBody, newText, insertSteps);
    
    newText = parseDictItem(dictSettings, 'body_fsp_content');
    insertSteps = parseDictItem(dictSettings, 'body_fsp_steps');
    berespBody = insertText('FSP BODY content', berespBody, newText, insertSteps);
    
    newText = parseDictItem(dictSettings, 'body_fsm_content');
    insertSteps = parseDictItem(dictSettings, 'body_fsm_steps');
    berespBody = insertText('FSM BODY content', berespBody, newText, insertSteps);
  }

  return new Response(berespBody, berespOpts);
}

/*********************************************************/

function insertText(logText, oldText, newText, steps, startIndex = 0) {
  /*
    STEPS = array of STEP or SEARCH_TEXT
      STEP = [ SEARCH_TEXT, OPTIONAL_SEARCH_FORWARD ]
        SEARCH_TEXT = string to search for
        OPTIONAL_SEARCH_FORWARD = boolean to select .indexOf() vs. .lastIndexOf() w/ default = true
  */
  try {
    if (typeof steps == 'string') steps = [[steps]]; // <- Shortcut for simple insertion 
    let index = startIndex, stepIndex = 0;
    for (; stepIndex < steps.length; stepIndex++) {
      let searchText = steps[stepIndex][0];
      let searchForward = (steps[stepIndex].length == 1) ? true : steps[stepIndex][1];
      if (typeof searchForward != "boolean") searchForward = true;
      index =  (searchForward) ? oldText.indexOf(searchText, index) : oldText.lastIndexOf(searchText, index);
      if (index == -1) throw new Error(`findIndex failed at step ${stepIndex}`);
    }
    return `${oldText.slice(0,index)}${newText}${oldText.slice(index)}`
  } catch(err) {
    console.log(`insertText() failed: ${logText} - ${err.message}`);
    return oldText;
  }
}

function parseDictItem(dictionary, key) {
  try {
    if (DEBUG.OPTS.LOG_DICTIONARY_PARSING) console.log(`KEY = ${key}`);
    let val = dictionary.get(key);
    if (DEBUG.OPTS.LOG_DICTIONARY_PARSING) console.log(`VAL = ${val}`);
    let parsedVal = JSON.parse(val);
    if (DEBUG.OPTS.LOG_DICTIONARY_PARSING) console.log(`PARSED_VAL = ${parsedVal}`);
    return parsedVal;
  } catch(err) {
    console.log(`parseDictItem() failed - ${err.message}`);
  }
}

function logHeaders(headers) {
  let o = {};
  headers.entries().forEach( k => {let a = `${k}`.split(','); o[a[0]] = a[1];} );
  console.log(JSON.stringify(o,null,'  '));
}

//function keyExists(d,k) { try { d.get(k); return true; } catch(e) { return false; } }

function createResponse(respBody, respOpts, logMsg = '') {
  if (logMsg) {
    console.log(`Response: ${logMsg}`);
    if (!respOpts.headers) respOpts.headers = new Headers();
    respOpts.headers.set('X-Log-Msg', logMsg);
  }
  return new Response(respBody, respOpts);
}
