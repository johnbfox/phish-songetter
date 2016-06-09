/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui'),
  ajax = require('ajax');

var main = new UI.Card({
  title: 'Phish Songetter',
  body: 'Press the forward button to check song.',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();

main.on('click', 'select', function(e) {
     refreshWindow();
});


//Refresh the page with new song results
function refreshWindow(){
  var URL = "https://safe-tundra-67149.herokuapp.com/phish";

  ajax(
    {
      url: URL,
      type: 'json'
    },
    function(data) {
      console.log(data.data.setlist);
      if(data.data['is-phish-playing']){
        var setlist = parseSetlist(data);
        var resultsMenu = new UI.Menu({
          sections: [{
            title: 'Current Show',
            items: setlist
          }]
        });

        resultsMenu.on('select', function(e) {

          var detailCard = new UI.Card({
            title:e.item.title,
            subtitle:e.item.subtitle
          });
          detailCard.show();
        });
        resultsMenu.show();
      }else{
        var noShowPlayingCard = new UI.Card({
          title: 'No Show Currently',
          body: data.data['next-show-text'],
          subtitleColor: 'indigo', // Named colors
          bodyColor: '#9a0036' // Hex colors
        });
        noShowPlayingCard.show();
      }
    }
  );
}

// Helper function to parse setlist
function parseSetlist(response){
  console.log(response);
  var setlist = response.data.setlist;
  var parsedSetlist = [];
  for(var i = setlist.length-1; i >= 0; i--){
    var song = {
      title:setlist[i].text,
      subtitle:setlist[i].timestamp
    };
    parsedSetlist.push(song);
  }
  return parsedSetlist;
}
