//ME

var utm = "";
var battles_safety_check = {};

var config = {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true,

};

function stringify(obj) {
  let cache = [];
  let str = JSON.stringify(obj, function(key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
}

function InstaCalc(tempLink) {
  let arg = { ...tempLink };
  //console.debug(arg.tier);
  var param=(toID(arg.tier).includes('random')) ? `randoms.html?=1&gen=${encodeURIComponent(arg.gen)}&` : `?=1&gen=${encodeURIComponent(arg.gen)}&`;
  var weather=arg.weather;
  var pseudoweather=typeof(arg.pseudoWeather[0]==='undefined') ? "" : arg.pseudoweather[0];
  for (let i = 1; i < 3; i++) {
    txt="";
    //console.debug(eval("arg.p"+i));
    //console.debug(i);
    //myPokemon = JSON.parse(JSON.stringify(arg.myPokemon));
    if (eval(`arg.p${i}.active[0]`) === null) {
      continue;

    } else if (toID(arg.tier).includes('random')) {
      txt += `p${i}=` + ((eval(`arg.p${i}.active[0]`) === null) ? "" : eval(`arg.p${i}.active[0].speciesForme`)) + `&`;
      txt += `boost${i}=` + JSON.stringify(eval(`arg.p${i}.active[0].boosts`)) + `&`;
      txt += `hp${i}=` + JSON.stringify(eval(`arg.p${i}.active[0].hp`)) + `&`;
    } else if (arg.myPokemon != null && eval("arg.p"+i+".name")==app.user.attributes.name) {
      //alert("if myPoke");
      txt += `p${i}=` + eval(`arg.p${i}.active[0].speciesForme`) + `&`;
      txt += `boost${i}=` + JSON.stringify(eval(`arg.p${i}.active[0].boosts`)) + `&`;
      var team = Teams.unpack(battles_safety_check[arg.id]);
      for (var poke of team) {
        poke.name = `p${i}`;
      }
      txt += `team${i}=` + encodeURIComponent(Teams.export(team)) + `&`;
      //console.debug(battles_safety_check[arg.id]);
      //console.debug("TEST1");
    } else {
      var yourPokemon = [];
      for (const poke of eval(`arg.p${i}.pokemon`)){
        yourPokemon.push(JSON.parse(stringify(poke)));
        //var teste = (({ side, battle, scene, sprite, ...o}) => o)(app.curRoom.battle.p1.pokemon) // remove b and c

      };
      //console.debug(yourPokemon);
      txt += `p${i}=` + ((eval(`arg.p${i}.active[0]`) === null) ? "" : eval(`arg.p${i}.active[0].speciesForme`)) + `&`;
      txt += `boost${i}=` + JSON.stringify(eval(`arg.p${i}.active[0].boosts`)) + `&`;
      txt += `hp${i}=` + JSON.stringify(eval(`arg.p${i}.active[0].hp`)) + `&`;
      for (e of yourPokemon) {
        e.species = e.speciesForme;
        e.name = `p${i}`;
        e.moves = e.moveTrack;
        e.moveTrack.forEach(function(part, index, theArray) {
          e.moves[index] = e.moveTrack[index][0];
        });
      };
      //console.debug(e);
      txt += `team${i}=` + encodeURIComponent(eval(`Teams.export(yourPokemon)`)) + `&`
      //console.debug(txt);
    };
  param = param + txt;
};
  param = param.slice(0, -1);
  //console.debug("PARAM:");
  //console.debug(param);
  param.replaceAll("\n","%0A").replaceAll("\r","%0D");
  //console.debug(param);
  open(`https://calc.pokemonshowdown.com/${param}`);
};

var roomObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            // element added to DOM
            [].forEach.call(mutation.addedNodes, function(el) {
                if(el.classList != null && el.classList.contains('ps-room-opaque')) {
					//room.send("/hidereplay");
                    let truc = document.createElement('DIV');
                    truc.id = "instaCalc";
                    truc.classList.add("battle-controls");
                    truc.style.postion = "relative";
                    truc.style.top = "560px";
                    let button = document.createElement('BUTTON');
                    button.id = "instaCalc";
                    button.classList.add("button");
                    button.setAttribute("onclick","InstaCalc(app.curRoom.battle);");
                    let text = document.createTextNode("InstaCalc");
                    button.appendChild(text);
                    truc.appendChild(button);
					el.append(truc);
                }
            });
        }
    });
});

// Start Observer for new Battles
roomObserver.observe(document.body, config);

app.send = (function(previousFn){
  return function() {
    var result = previousFn.apply(this, arguments);
    if (arguments[0].includes("/utm")) {
      if (utm != null) {
        utm = arguments[0].replace("/utm ","");
        //alert(utm);
      };
    };
    return result;
  }
})(app.send);

app.receive = (function(previousFn){
  return function() {
    var result = previousFn.apply(this, arguments);
    //
    var data = arguments[0].split("|");
    var id = data[0].replace(">","").trim();
    if (!(id.includes("random"))) {
      if (arguments[0].includes("|init|battle") && data[4].includes(app.user.attributes.name)) {
        if (!(typeof cancel_rtb == "undefined")) {
          cancel_rtb();
        };
        battles_safety_check[id]=utm;
      }
    };
    return result;
  }
})(app.receive)
