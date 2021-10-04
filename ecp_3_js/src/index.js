const excludedComponentNames = ['Edge Cloud Services', 'Nearline Cache', 'Fastly Systems', 'Business Continuity'];

function getInnerHtml(htmlText, tagName, fromIndex = 0) {
    if (fromIndex == -1) throw new Error(`From Index not found`);
    let openingTagStartIndex = htmlText.indexOf(`<${tagName}`, fromIndex);
    if (openingTagStartIndex == -1) throw new Error(`Start of Opening Tag not found`);
    let openingTagEndIndex = htmlText.indexOf(`>`, openingTagStartIndex);
    if (openingTagEndIndex == -1) throw new Error(`End of Opening Tag not found`);
    fromIndex = openingTagEndIndex + 1;
    let closingTagIndex, innerHtml;
    let iterationCount = 5;
    while(true) {
        closingTagIndex = htmlText.indexOf(`</${tagName}>`, openingTagEndIndex + 1);
        if (closingTagIndex == -1) throw new Error(`Closing Tag not found`);
        innerHtml = htmlText.substring(openingTagEndIndex + 1,closingTagIndex);
        let innerOpeningTagStartIndex = innerHtml.indexOf(`<${tagName}`);
        if (innerOpeningTagStartIndex == -1) break;
        openingTagStartIndex = closingTagIndex + 1;
        openingTagEndIndex = htmlText.indexOf(`>`, openingTagStartIndex);
        if (openingTagEndIndex == -1) throw new Error(`End of Opening Tag not found`);
        if (--iterationCount == 0) throw new Error(`Loop Iteration Limit Exceeded`);;
    }
    innerHtml = htmlText.substring(fromIndex,closingTagIndex).trim();
    return {fromIndex: fromIndex, toIndex: closingTagIndex, innerHtml: innerHtml};
}

function scrape(data) {
    const componentClasses = 'component-container border-color is-group';
    const componentClassesLegend = 'component-statuses-legend';
    let output = [];
    // Find containers
    let containers = [], tmpPosition;
    if ((tmpPosition = data.indexOf(componentClasses)) == -1) {
      console.log(data);
      throw new Error(`'component-statuses' DIV not found`);
    }
    for(; tmpPosition != -1; tmpPosition=data.indexOf(componentClasses, tmpPosition + 1)) {
        // Get fromIndex
        let divTagEndIndex = data.indexOf('>',tmpPosition) + 1;
        // Add toIndex value to previous container (if there is one)
        if (containers.length > 0) {
            containers[containers.length - 1].toIndex = data.lastIndexOf('</div>', divTagEndIndex);
        }
        containers.push({ fromIndex: divTagEndIndex })
    }
    // Add toIndex value to last container
    if ((tmpPosition = data.indexOf(componentClassesLegend)) == -1) throw new Error(`'component-statuses-legend' DIV not found`);
    let lastContainer = containers[containers.length - 1];
    if ((tmpPosition = data.lastIndexOf('</div>', tmpPosition)) < lastContainer.fromIndex) throw new Error(`Closing DIV #1 not found`);
    if ((tmpPosition = data.lastIndexOf('</div>', tmpPosition)) < lastContainer.fromIndex) throw new Error(`Closing DIV #2 not found`);
    containers[containers.length - 1].toIndex = tmpPosition;
    // Get information from each container
    containers.forEach( tmpContainer => {
        tmpContainer.name = null;
        tmpContainer.state = null;
        tmpContainer.children = [];
        try {
            let componentInnerContainerDiv = getInnerHtml(data, 'div', tmpContainer.fromIndex);
            let nameSpan = getInnerHtml(data, 'span', componentInnerContainerDiv.fromIndex);
            let spanWithName = getInnerHtml(data, 'span', data.indexOf('<span>',nameSpan.fromIndex));
            tmpContainer.name = spanWithName.innerHtml;
            if (!excludedComponentNames.includes(tmpContainer.name)) {
                let spanWithState = getInnerHtml(data, 'span', nameSpan.toIndex);
                tmpContainer.state = spanWithState.innerHtml;
                let ChildrenStartPosition = data.indexOf('child-components-container',tmpContainer.fromIndex);
                if (ChildrenStartPosition == -1) throw new Error(`'child-components-container' DIV not found`);
                let divStartPosition = ChildrenStartPosition;
                let childCount = 0;
                while (true) {
                    divStartPosition = data.indexOf('<div', divStartPosition + 1)
                    if (divStartPosition == -1 || divStartPosition > tmpContainer.toIndex) break;
                    ++childCount;
                    let childDiv = getInnerHtml(data, 'div', divStartPosition);
                    let nameSpan = getInnerHtml(data, 'span', childDiv.fromIndex);
                    let statusSpan = getInnerHtml(data, 'span', nameSpan.toIndex);
                    let popName = nameSpan.innerHtml, popCode = null;
                    let openingParen = popName.indexOf("("), closingParen = popName.indexOf(")");
                    if (openingParen != -1 && closingParen != 1) {
                        popCode = popName.substring(openingParen + 1, closingParen).trim().substr(0,3);
                        popName = popName.substring(0, openingParen).trim();
                    }
                    output.push( {region: tmpContainer.name, name: popName, code: popCode, status: statusSpan.innerHtml} );
                }
                tmpContainer.childCount = childCount;
            }
        } catch(e) {
            console.log(e.message);
        }
    });
    //console.log(JSON.stringify(output, null, '  '));
    return output;
}

addEventListener('fetch', async function handleRequest(event) {
  
  // NOTE: By default, console messages are sent to stdout (and stderr for `console.error`).
  // To send them to a logging endpoint instead, use `console.setEndpoint:
  // console.setEndpoint("my-logging-endpoint");

  // Get the client request from the event
  let req = event.request;
  let method = req.method;
  let url = new URL(req.url);
  let path = url.pathname;
  //let path = req.url.replace(/^https?:\/\/[^/]+\/?/i,'/').replace(/\?.*$/,'');
  console.log(`${method} ${path}`);

  // Make any desired changes to the client request.
  //req.headers.set("Host", "status.fastly.com");

  // Filter requests that have unexpected methods.
  if (method != 'GET') {
    event.respondWith(
      new Response("Method Not Allowed", { status: 405 })
    );
    return;
  }

  switch(path) {
    case '/':
      const dictSettings = new Dictionary('settings');
      let bereqHost = dictSettings.get('bereq_host');
      let debugOpts = dictSettings.get('debug_csv').split(',');

      // Force a PASS with a cache override.
      let cacheOverride = new CacheOverride("override", { ttl: 0 });

      let bereqOpts = {
        method: 'GET',
        headers: {'Host': bereqHost, 'Cache-Control': 'no-store, max-age=0'},
        backend: bereqHost.replace(/[\-.]/g,'_'),
        cacheOverride
      };
      let bereqUrl = `https://${bereqHost}/`;

      if (debugOpts.includes('remove_header')) {
        delete bereqOpts.headers.Host;
        console.log(`Host Header Removed: ${JSON.stringify(bereqOpts.headers)}`);
      }
      if (debugOpts.includes('remove_slash')) {
        bereqUrl = bereqUrl.replace(/\/$/,'');
        console.log(`URL Terminating Slash Removed: ${bereqUrl}`)
      }

      let resp = await fetch(bereqUrl, bereqOpts);

      let popStatus = [];
      resp.headers.set('X-Beresp-status',resp.status + '');
      if (resp.status == 200) {
        let respBody = await resp.text();
        popStatus = scrape(respBody);
      }

      event.respondWith(
        new Response(JSON.stringify(popStatus), { status: 200, headers: resp.headers })
      );
      break;
    default:
      event.respondWith(
        new Response("Page Not Found", { status: 404 })
      );
  }
});
