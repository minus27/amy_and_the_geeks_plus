const createTextNode = t => document.createTextNode(t);

function parseLastOverrides(lastOverrides) {
  try {
    let o = JSON.parse(lastOverrides);
    $('#fsp-overrides')
      .html('')
      .append($(createTextNode('{')))
      .append($('<div>'))
      .append($(createTextNode('}')))
    let keys = Object.keys(o);
    keys.forEach((key,index) => {
      let val = o[key];
      let dq = (val == '-') ? `"` : '';
      let text = `"${key}":${dq}${val}${dq}`;
      if (index > 0) $('#fsp-overrides div').append($(createTextNode(',')));
      $('#fsp-overrides div').append($('<span>',{
        text:text, pop:key, status:val
      }));
      $('#fsp-overrides span').click(function() {
        $('select.pop').val($(this).attr('pop'));
        $('select.status').val('-');
      })
    });
  } catch(err) {
    $('#fsp-overrides').text(lastOverrides);
    console.error('Sorry, overrides parsing failed');
  }
}

async function initPopSelect() {
/*  
  if (pops.length == 0) {
    pops = ['bogus entry to force /noscrape'];
    await updatePopData(true);
  }
*/
  $('select.pop option:not(:first-of-type)').remove();
  Object.keys(popIndexes).sort().forEach( popCode => {
    $('select.pop').append($('<option>',{
      value:popCode,
      text:`${popCode} (${pops[popIndexes[popCode]].name})`
    }))
  });
}

function initStatusSelect() {
  $('select.status option:not(:first-of-type)').remove();
  statusValues.forEach( statusValue => {
    $('select.status').append($('<option>',{
      value:statusValue.index,
      text:`${statusValue.index} (${statusValue.name})`
    }))
  });
}

function initButtons() {
  $('#overrides-set').click(async function() {
    $(this).prop('disabled',true);
    await demo.setPop($('select.pop').val(), $('select.status').val(), false);
    parseLastOverrides(demo.lastOverrides);
    setTimeout(function(){
      parseLastOverrides(demo.lastOverrides);
      $('#overrides-set').prop('disabled',false);
    },1500);
  });
  $('#overrides-reset').click(function() {
    $('select.pop').val('*');
    $('select.status').val('-');
  });
  $('#fsp-monitor-buttons button').click(function() {
    if ($(this).hasClass('start')) popMonitor.start();
    if ($(this).hasClass('stop')) popMonitor.stop();
  });
  $('#the-wow').click(function(e) {
    if (e.shiftKey) {
      wow();
    } else {
      $('*').css("background-color", "yellow");
      setTimeout(function(){$('*').css("background-color", "");},3000);
    }
  });
}

async function initOverrides() {
  await demo.callApi();
  parseLastOverrides(demo.lastOverrides);
}

function initPanelElements() {
  const panelId = '#fastly-status-panel-container';
  if ($(panelId).length == 0) return;
  $(panelId)
    .append($('<section>',{id:'fsp-controls'}))
    .append($('<section>',{id:'fsp-overrides'}));
  $('#fsp-controls')
    .append($('<div>',{id:'fsp-pop-select'}))
    .append($('<div>',{id:'fsp-status-select'}))
    .append($('<div>',{id:'fsp-status-buttons'}))
    .append($('<div>',{id:'fsp-monitor-buttons'}))
    .append($('<div>',{id:'fsp-wow-button'}));
  $('#fsp-pop-select')
    .append($('<label>',{class:'pop', text:'POP:'}))
    .append($(createTextNode(' ')))
    .append($('<select>',{class:'pop'}))
    .children().last()
      .append($('<option>',{value:'*', text:'* (All POPs)'}));
  $('#fsp-status-select')
    .append($('<label>',{class:'status', text:'Status:'}))
    .append($(createTextNode(' ')))
    .append($('<select>',{class:'status'}))
    .children().last()
      .append($('<option>',{value:'-', text:'- (Delete Status)'}));
  $('#fsp-status-buttons')
    .append($('<button>',{id:'overrides-set', text:'Set'}))
    .append($(createTextNode(' ')))
    .append($('<button>',{id:'overrides-reset', text:'Reset'}));
  $('#fsp-monitor-buttons')
    .append($('<label>',{text:'Monitor:'}))
    .append($(createTextNode(' ')))
    .append($('<button>',{class:'start', text:'Start', disabled:''}))
    .append($(createTextNode(' ')))
    .append($('<button>',{class:'stop', text:'Stop', disabled:''}));
  $('#fsp-wow-button')
    .append($('<button>',{id:'the-wow', text:'WOW'}));
}

function initPanel() {
  initPanelElements();
  let id = setInterval(function(){
    if (pops.length == 0) return;
    clearInterval(id);
    initPopSelect();
  }, 10);
  initStatusSelect();
  initButtons();
  initOverrides();
}

var panel = {
  hide: function() { $('#fastly-status-panel-container').addClass('hidden') },
  show: function() { $('#fastly-status-panel-container').removeClass('hidden') },
}
var hidePanel = () => panel.hide(), showPanel = () => panel.show();
var panelHide = () => panel.hide(), panelShow = () => panel.show();
