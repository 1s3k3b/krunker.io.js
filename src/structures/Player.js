const { Class } = require('./ClassWeapon.js');
const Mod = require('./Mod.js');
const fetch = require('node-fetch');

const fromEntries = arr => arr.reduce((o, [ k, v ]) => {
    o[k] = v;
    return o;
}, {});

module.exports = class Player {
    async setup(client, data, { clan = false, mods = false } = {}) {
        const stats = JSON.parse(data.player_stats);
        const classes = ['Triggerman', 'Hunter', 'Run N Gun', 'Spray N Pray', 'Vince', 'Detective', 'Marksman', 'Rocketeer', 'Agent', 'Runner', 'Bowman', 'Commando'];
        const _playerClan = data.player_clan
            ? clan
                ? await client.fetchClan(data.player_clan)
                : data.player_clan
            : null;
        const _playerMods = mods
            ? await fetch('https://api.krunker.io/mods?accountId=' + data.player_id).then(
                async d =>
                    (await d.json()).data
                        .map(modData => new Mod(client, modData))
                        .filter(mod => mod.authorUsername === data.player_name),
            )
            : data.player_mods.map(m => m.mod_name);
        const _classes = fromEntries(
            Object.keys(stats || {})
                .filter(k => /c\d+/.test(k))
                .map(k => [
                    new Class(classes[k.substring(1)]).name,
                    new Class(classes[k.substring(1)], data),
                ]),
        );
        const level = Math.max(1, Math.floor(0.03 * Math.sqrt(data.player_score)));

        return {
            username: data.player_name,
            level,
            levelImage: `https://krunker.io/img/levels/${Math.min(level % 2 ? level : level - 1, 101)}.png`,
            levelProgress: Math.round(100 * ((0.03 * Math.sqrt(data.player_score)) - Math.floor(0.03 * Math.sqrt(data.player_score)))),
            score: data.player_score,
            displayName: (data.player_clan ? data.player_name + ' [' + data.player_clan + ']' : data.player_name),
            id: data.player_id,
            lastPlayedClass: new Class(classes[(stats || {}).c]),
            joinedAt: new Date(data.player_datenew),
            classes: stats && {
                ..._classes,
                lastPlayed: new Class(classes[stats.c], data),
                sorted: Object.values(_classes).sort((a, b) => b.score - a.score),
                highest: Object.values(_classes).sort((a, b) => b.score - a.score)[0],
                lowest: Object.values(_classes).sort((a, b) => a.score - b.score)[0],
            },
            mods: _playerMods,
            maps: data.player_maps.map(map => ({
                author: data.player_name,
                name: map.map_name,
                votes: map.map_votes,
                verified: !!map.map_verified,
                fetch: () => client.getMap(map.map_name),
            })),
            hacker: !!data.player_hack,
            region: data.player_region,
            regionImage: `https://krunker.io/img/flags/flag_${data.player_region}.png`,
            infected: !!data.player_infected,
            premium: !!data.player_premium,
            eggs: data.player_eventcount || 0,
            stats: stats && {
                timePlayed: {
                    ms: data.player_timeplayed,
                    mins: Math.floor(Math.floor(data.player_timeplayed / 1000) / 60) / 60,
                    hours: Math.floor(Math.floor(Math.floor(data.player_timeplayed / 1000) / 60) / 60) / 24,
                    days: Math.floor(Math.floor(Math.floor(Math.floor(data.player_timeplayed / 1000) / 60) / 60) / 24),

                    toString: () => Math.floor(Math.floor(Math.floor(Math.floor(data.player_timeplayed / 1000) / 60) / 60) / 24) + 'd ' + Math.floor(Math.floor(Math.floor(data.player_timeplayed / 1000) / 60) / 60) % 24 + 'h ' + Math.floor(Math.floor(data.player_timeplayed / 1000) / 60) % 60 + 'm',
                    valueOf: () => data.player_timeplayed,
                },
                wallbangs: stats.wb || 0,
                shots: stats.s,
                hits: stats.h,
                accuracy: Number((stats.h * 100 / stats.s).toFixed(2)),
                nukes: stats.n || 0,
                headshots: stats.hs || 0,
                melees: stats.mk || 0,
                kills: data.player_kills,
                deaths: data.player_deaths,
                kdr: Number((data.player_kills / data.player_deaths).toFixed(2)),
                gamesPlayed: data.player_games_played,
                wins: data.player_wins,
                losses: data.player_games_played - data.player_wins,
                wlr: Number((data.player_wins / (data.player_games_played - data.player_wins)).toFixed(2)),
                kpg: Number((data.player_kills / data.player_games_played).toFixed(2)),
                elo1: data.player_elo || 0,
                elo2: data.player_elo2 || 0,
                elo4: data.player_elo4 || 0,
                elo1Image: data.player_elo ? `https://krunker.io/img/ranks/icon_${Math.floor(Math.abs(data.player_elo - 119.99) / 120)}.png` : '',
                elo2Image: data.player_elo2 ? `https://krunker.io/img/ranks/icon_${Math.floor(Math.abs(data.player_elo2 - 119.99) / 120)}.png` : '',
                elo4Image: data.player_elo3 ? `https://krunker.io/img/ranks/icon_${Math.floor(Math.abs(data.player_elo4 - 119.99) / 120)}.png` : '',
                challengesLevel: data.player_chal || 0,
            },
            social: {
                clan: _playerClan,
                following: data.player_following || 0,
                followers: data.player_followed || 0,
                funds: data.player_funds || 0,
                verified: !!data.player_featured,
            },
        };
    }
};
