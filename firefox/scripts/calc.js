//SETDEX_SV = SETDEX[9];

const urlParams = new URLSearchParams(window.location.search);
if(urlParams.has("")) {

//console.debug("test");
window.alert = function() {};

var dic = ["pv","atk","def","spa","spd","spe"];
var team1=urlParams.get("team1");
var team2=urlParams.get("team2");
var poke1=urlParams.get("p1");
var poke2=urlParams.get("p2");
var boost1=JSON.parse(urlParams.get("boost1"));
var boost2=JSON.parse(urlParams.get("boost2"));
var hp1=urlParams.get("hp1");
var hp2=urlParams.get("hp2");


function test(fullSetName, boost, hp, a) {
	var pokemonName = fullSetName.substring(0, fullSetName.indexOf(" ("));
	var setName = fullSetName.substring(fullSetName.indexOf("(") + 1, fullSetName.lastIndexOf(")"));
	var pokemon = pokedex[pokemonName];
	if (pokemon) {
		var pokeObj = a.closest(".poke-info");
		var isAutoTera =
		(startsWith(pokemonName, "Ogerpon") && endsWith(pokemonName, "Tera")) ||
		pokemonName === 'Terapagos-Stellar';
		if (stickyMoves.getSelectedSide() === pokeObj.prop("id")) {
			stickyMoves.clearStickyMove();
		}
		pokeObj.find(".teraToggle").prop("checked", isAutoTera);
		pokeObj.find(".max").prop("checked", false);
		stellarButtonsVisibility(pokeObj, 0);
		pokeObj.find(".boostedStat").val("");
		pokeObj.find(".analysis").attr("href", smogonAnalysis(pokemonName));
		pokeObj.find(".type1").val(pokemon.types[0]);
		pokeObj.find(".type2").val(pokemon.types[1]);
		pokeObj.find(".hp .base").val(pokemon.bs.hp);
		var i;
		for (i = 0; i < LEGACY_STATS[gen].length; i++) {
			pokeObj.find("." + LEGACY_STATS[gen][i] + " .base").val(pokemon.bs[LEGACY_STATS[gen][i]]);
      pokeObj.find("." + LEGACY_STATS[gen][i] + " .boost").val(typeof(boost[dic[i]])==='undefined' ? 0 : boost[dic[i]]);
    }
		//pokeObj.find(".percent-hp").val(100);
		var maxHP = pokeObj.find(".max-hp").attr("data-prev");
    pokeObj.find(".current-hp").val(hp / 100 * maxHP);
		pokeObj.find(".status").val("Healthy");
		$(".status").change();
		var moveObj;
		var abilityObj = pokeObj.find(".ability");
		var itemObj = pokeObj.find(".item");
		var randset;
		if ($("#randoms").prop("checked")) {
			if (gen >= 8) {
				// The Gens 8 and 9 randdex contains information for multiple Random Battles formats for each Pokemon.
				// Duraludon, for example, has data for Randoms, Doubles Randoms, and Baby Randoms.
				// Therefore, the information for only the format chosen should be used.
				randset = randdex[pokemonName][setName];
			} else {
				randset = randdex[pokemonName];
			}
		}
		var regSets = pokemonName in setdex && setName in setdex[pokemonName];

		if (randset) {
			var listItems = randset.items ? randset.items : [];
			var listAbilities = randset.abilities ? randset.abilities : [];
			if (gen >= 3) a.closest('.poke-info').find(".ability-pool").show();
			a.closest('.poke-info').find(".extraSetAbilities").text(listAbilities.join(', '));
			if (gen >= 2) a.closest('.poke-info').find(".item-pool").show();
			a.closest('.poke-info').find(".extraSetItems").text(listItems.join(', '));
			if (gen !== 8 && gen !== 1) {
				a.closest('.poke-info').find(".role-pool").show();
				if (gen >= 9) a.closest('.poke-info').find(".tera-type-pool").show();
			}
			var listRoles = randset.roles ? Object.keys(randset.roles) : [];
			a.closest('.poke-info').find(".extraSetRoles").text(listRoles.join(', '));
			var listTeraTypes = [];
			if (randset.roles && gen >= 9) {
				for (var roleName in randset.roles) {
					var role = randset.roles[roleName];
					for (var q = 0; q < role.teraTypes.length; q++) {
						if (listTeraTypes.indexOf(role.teraTypes[q]) === -1) {
							listTeraTypes.push(role.teraTypes[q]);
						}
					}
				}
			}
			pokeObj.find(".teraType").val(listTeraTypes[0] || getForcedTeraType(pokemonName) || pokemon.types[0]);
			a.closest('.poke-info').find(".extraSetTeraTypes").text(listTeraTypes.join(', '));
		} else {
			a.closest('.poke-info').find(".ability-pool").hide();
			a.closest('.poke-info').find(".item-pool").hide();
			a.closest('.poke-info').find(".role-pool").hide();
			a.closest('.poke-info').find(".tera-type-pool").hide();
		}
		if (regSets || randset) {
			var set = regSets ? correctHiddenPower(setdex[pokemonName][setName]) : randset;
			if (regSets) {
				pokeObj.find(".teraType").val(set.teraType || getForcedTeraType(pokemonName) || pokemon.types[0]);
			}
			pokeObj.find(".level").val(set.level === undefined ? 100 : set.level);
			pokeObj.find(".hp .evs").val((set.evs && set.evs.hp !== undefined) ? set.evs.hp : 0);
			pokeObj.find(".hp .ivs").val((set.ivs && set.ivs.hp !== undefined) ? set.ivs.hp : 31);
			pokeObj.find(".hp .dvs").val((set.dvs && set.dvs.hp !== undefined) ? set.dvs.hp : 15);
			for (i = 0; i < LEGACY_STATS[gen].length; i++) {
				pokeObj.find("." + LEGACY_STATS[gen][i] + " .evs").val(
					(set.evs && set.evs[LEGACY_STATS[gen][i]] !== undefined) ?
						set.evs[LEGACY_STATS[gen][i]] : ($("#randoms").prop("checked") ? 84 : 0));
				pokeObj.find("." + LEGACY_STATS[gen][i] + " .ivs").val(
					(set.ivs && set.ivs[LEGACY_STATS[gen][i]] !== undefined) ? set.ivs[LEGACY_STATS[gen][i]] : 31);
				pokeObj.find("." + LEGACY_STATS[gen][i] + " .dvs").val(
					(set.dvs && set.dvs[LEGACY_STATS[gen][i]] !== undefined) ? set.dvs[LEGACY_STATS[gen][i]] : 15);
			}
			setSelectValueIfValid(pokeObj.find(".nature"), set.nature, "Hardy");
			var abilityFallback = (typeof pokemon.abilities !== "undefined") ? pokemon.abilities[0] : "";
			if ($("#randoms").prop("checked")) {
				setSelectValueIfValid(abilityObj, randset.abilities && randset.abilities[0], abilityFallback);
				setSelectValueIfValid(itemObj, randset.items && randset.items[0], "");
			} else {
				setSelectValueIfValid(abilityObj, set.ability, abilityFallback);
				setSelectValueIfValid(itemObj, set.item, "");
			}
			var setMoves = set.moves;
			if (randset) {
				if (gen === 8 || gen === 1) {
					setMoves = randset.moves;
				} else {
					setMoves = [];
					for (var role in randset.roles) {
						for (var q = 0; q < randset.roles[role].moves.length; q++) {
							var moveName = randset.roles[role].moves[q];
							if (setMoves.indexOf(moveName) === -1) setMoves.push(moveName);
						}
					}
				}
			}
			var moves = selectMovesFromRandomOptions(setMoves);
			for (i = 0; i < 4; i++) {
				moveObj = pokeObj.find(".move" + (i + 1) + " select.move-selector");
				moveObj.attr('data-prev', moveObj.val());
				setSelectValueIfValid(moveObj, moves[i], "(No Move)");
				moveObj.change();
			}
			if (randset) {
				a.closest('.poke-info').find(".move-pool").show();
				a.closest('.poke-info').find(".extraSetMoves").html(formatMovePool(setMoves));
			}
		} else {
			pokeObj.find(".teraType").val(getForcedTeraType(pokemonName) || pokemon.types[0]);
			pokeObj.find(".level").val(defaultLevel);
			pokeObj.find(".hp .evs").val(0);
			pokeObj.find(".hp .ivs").val(31);
			pokeObj.find(".hp .dvs").val(15);
			for (i = 0; i < LEGACY_STATS[gen].length; i++) {
				pokeObj.find("." + LEGACY_STATS[gen][i] + " .evs").val(0);
				pokeObj.find("." + LEGACY_STATS[gen][i] + " .ivs").val(31);
				pokeObj.find("." + LEGACY_STATS[gen][i] + " .dvs").val(15);
			}
			pokeObj.find(".nature").val("Hardy");
			setSelectValueIfValid(abilityObj, pokemon.abilities[0], "");
			if (startsWith(pokemonName, "Ogerpon-") && !startsWith(pokemonName, "Ogerpon-Teal")) {
				itemObj.val(pokemonName.split("-")[1] + " Mask");
			} else {
				itemObj.val("");
			}
			for (i = 0; i < 4; i++) {
				moveObj = pokeObj.find(".move" + (i + 1) + " select.move-selector");
				moveObj.attr('data-prev', moveObj.val());
				moveObj.val("(No Move)");
				moveObj.change();
			}
			if ($("#randoms").prop("checked")) {
				a.closest('.poke-info').find(".move-pool").hide();
			}
		}
		if (typeof getSelectedTiers === "function") { // doesn't exist when in 1vs1 mode
			var format = getSelectedTiers()[0];
			var is50lvl = startsWith(format, "VGC") || startsWith(format, "Battle Spot");
			//var isDoubles = format === 'Doubles' || has50lvl; *TODO*
			if (format === "LC") pokeObj.find(".level").val(5);
			if (is50lvl) pokeObj.find(".level").val(50);
			//if (isDoubles) field.gameType = 'Doubles'; *TODO*
		}
		var formeObj = a.siblings().find(".forme").parent();
		itemObj.prop("disabled", false);
		var baseForme;
		if (pokemon.baseSpecies && pokemon.baseSpecies !== pokemon.name) {
			baseForme = pokedex[pokemon.baseSpecies];
		}
		if (pokemon.otherFormes) {
			showFormes(formeObj, pokemonName, pokemon, pokemonName);
		} else if (baseForme && baseForme.otherFormes) {
			showFormes(formeObj, pokemonName, baseForme, pokemon.baseSpecies);
		} else {
			formeObj.hide();
		}
		calcHP(pokeObj);
		calcStats(pokeObj);
		abilityObj.change();
		itemObj.change();
		if (pokemon.gender === "N") {
			pokeObj.find(".gender").parent().hide();
			pokeObj.find(".gender").val("");
		} else pokeObj.find(".gender").parent().show();
	}
};

if (window.location.pathname=='/randoms.html') {

if (poke1 != null) {
  test(`${poke1} (Randoms)`, boost1, hp1, $("#s2id_autogen6"));
  //$("#s2id_autogen6").closest(".poke-info").find("." + LEGACY_STATS[gen][3] + " .boost").val("3");
  $("#p1").find("input.set-selector").val(`${poke1} Randoms`);

  $("#p1").find(".select2-chosen").first()[0].innerHTML=`${poke1} (Randoms)`;
}

if (poke2 != null) {
  test(`${poke2} (Randoms)`, boost2, hp2, $("#s2id_autogen9"));
  //$("#s2id_autogen9").closest(".poke-info").find("." + LEGACY_STATS[gen][3] + " .boost").val("3");

  $("#p2").find("input.set-selector").val(`${poke2} Randoms`);

  $("#p2").find(".select2-chosen").first()[0].innerHTML=`${poke2} (Randoms)`;

}

} else {

//console.debug(team1);
//console.debug(team2);
//console.debug(urlParams.get("gen"));

if (poke1 != null) {
  addSets(team1,"poke1");

  test(`${poke1} (p1)`, boost1, hp1, $("#s2id_autogen6"));

  //$("#s2id_autogen6").closest(".poke-info").find("." + LEGACY_STATS[gen][3] + " .boost").val("3");

  $("#p1").find("input.set-selector").val(`${poke1} p1`);


  $("#p1").find(".select2-chosen").first()[0].innerHTML=`${poke1} (p1)`;
}

if (p2 != null) {
  addSets(team2,"p2");

  test(`${poke2} (p2)`, boost2, hp2, $("#s2id_autogen9"));

  //$("#s2id_autogen9").closest(".poke-info").find("." + LEGACY_STATS[gen][3] + " .boost").val("3");

  $("#p2").find("input.set-selector").val(`${poke2} p2`);


  $("#p2").find(".select2-chosen").first()[0].innerHTML=`${poke2} (p2)`;

}

}

performCalculations();
//$(".set-selector").trigger("change")
};
