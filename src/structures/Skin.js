const avgPrices = require('../data/avgPrices.json');
const { getItemNum } = require('./ItemSales.js');
const { ArgumentError } = require('../errors/index.js');
const { resolveWeapon, resolveRarity } = {
    resolveWeapon(r) {
        if (r && r.constructor.name === 'Class') return r.weapon;
        if (typeof r === 'string') return new Weapon(r);
        return r;
    },
    resolveRarity: r => ['Uncommon', 'Rare', 'Epic', 'Legendary', 'Relic', 'Contraband'][r],
};

module.exports = class Skin {
    constructor(client, wResolvable, data) {
        Object.defineProperty(this, 'client', { value: client });
        URLs = getTexture(data)
        Texture_Default = URLs.t
        Texture_Emissive = URLs.e
        this.weapon = resolveWeapon(wResolvable);
        if (!this.weapon) throw new ArgumentError('CANNOT_RESOLVE', wResolvable, 'Weapon');
        this.name = data.name;
        this.id = data.id;
        this.season = data.seas || 1;
        this.rarityI = data.rarity;
        this.rarity = resolveRarity(data.rarity);
        this.authorUsername = data.creator || 'Krunker.io';
        this.glow = !!data.glow;
        this.keyword = data.keyW || null;
        this.texture = data.tex || null;
        this.limited = data.limT || null;
        this.textureImage = Texture_Default
        this.textureEmissive = this.glow ? Texture_Emissive : null;
        this.preview = getPreview(data)
        this.itemNum = getItemNum(this.name);
        this.estimatedPrice = avgPrices[this.itemNum];
    }
    toString() {
        return this.name;
    }
    async fetchAuthor() {
        this.author = await this.client.fetchPlayer(this.authorUsername);
        return this.author;
    }
};
const types = ["weapons/weapon_", "hats/hat_", "body/body_", "melee/melee_", "sprays/", "dyes/","waist/waist_","faces/face_"];

function getPreview(t) {
    return "https://assets.krunker.io/textures/"+(t.type&&4==t.type?"sprays/"+t.id:"previews/"+(t.type&&(3>t.type||4<t.type)?"cosmetics/"+t.type+"_"+t.id+(t.tex?"_"+t.tex:""):types[t.type||0]+(t.type&&3==t.type?t.id+(null==t.pat?null==t.tex?"":"_"+t.tex:"_c"+t.pat):(t.weapon||0)+"_"+(null==t.mid?null==t.pat?t.tex?t.tex:t.id:"c"+t.pat:"m"+t.mid+(null==t.midT?"":"_"+t.midT)))))+".png?build=u9K3c";
    
}
function getTexture(i){
    let texture = 'https://assets.krunker.io/textures/'
    let emissive 
    if (i.weapon){
        if (i.pat) texture+=`weapons/pat/${i.pat}`;
        if(i.id)texture+=`weapons/skins/weapon_${i.weapon}_${i.id}`;
        if (!i.id && i.midT && i.mid >= 0)texture+=`${types[0]}${i.weapon}_${i.midT}`;
        if(!i.id && !i.midT && i.mid >= 0)texture+=`${types[0]}${i.weapon}_${i.mid}`;
    }
    else  if (1<= i.type <= 7 && i.type != 5){
        if(i.pat)texture+=`weapons/pat/${i.pat}`
        if(i.id && i.tex) texture+=`${types[i.type]}${i.id}_${i.tex}`;
        else if(i.id && !i.tex) texture += `${types[i.type]}${i.id}`
        
    }
    emissive = texture + '_e.png'
    texture += '.png'
    if(i.type == 5){
        texture = `Shirt Color: ${toHexRGB(i.shirtCol)}\nSleeve Color: ${toHexRGB(i.sleeveCol)}\nPants Color: ${toHexRGB(i.pantsCol)}\nShoes Color: ${toHexRGB(i.shoeCol)}`
    }
    if(texture == 'https://assets.krunker.io/textures/.png' || texture.indexOf('undefined') > 0){
        console.log("ERROR SKIN TEXTURE NOT GENERATED",i)
        return "undefined"
    }
    return {e : emissive,t:texture}
}
class Weapon {
    constructor(name = 'Assault Rifle') {
        const pistol = {
            name: 'Pistol',
            class: null,
            swapTime: 350,
            aimSpeed: 120,
            speedMultiplier: 1.05,
            ammo: 10,
            reloadTime: 700,
            damage: {
                damage: 20,
                dropoff: 10,
                valueOf() {
                    return 20;
                },
                toString() {
                    return '20';
                },
            },
            range: 700,
            rateOfFire: 150,
            spread: 90,
            zoom: 1.4,
            recoil: 0.006,
            automatic: false,
            baseScore: 75,
            sight: null,
            devNumber: 3,
        };

        const deserteagle = {
            name: 'Desert Eagle',
            class: null,
            swapTime: 200,
            aimSpeed: 120,
            speedMultiplier: 1,
            ammo: 6,
            reloadTime: 1000,
            damage: {
                damage: 50,
                dropoff: 10,
                valueOf() {
                    return 50;
                },
                toString() {
                    return '50';
                },
            },
            range: 700,
            rateOfFire: 400,
            spread: 150,
            zoom: 1.4,
            recoil: 0.01,
            automatic: false,
            baseScore: 50,
            sight: null,
            devNumber: 11,
        };

        const alienblaster = {
            name: 'Alien Blaster',
            class: null,
            swapTime: 200,
            aimSpeed: 120,
            speedMultiplier: 1,
            ammo: 4,
            reloadTime: 1500,
            damage: {
                damage: 50,
                dropoff: 10,
                valueOf() {
                    return 50;
                },
                toString() {
                    return '50';
                },
            },
            range: 700,
            rateOfFire: 150,
            spread: 150,
            zoom: 1.4,
            recoil: 0.007,
            automatic: false,
            baseScore: 50,
            sight: null,
            devNumber: 12,
        };

        const combatknife = {
            name: 'Combat Knife',
            class: new Class('Runner'),
            baseScore: 150,
            damage: {
                damage: 50,
                dropoff: 0,
                toString: () => '50',
                valueOf: () => 50,
            },
        };

        const assaultrifle = {
            name: 'Assault Rifle',
            class: new Class('Triggerman'),
            swapTime: 300,
            aimSpeed: 130,
            speedMultiplier: 0.95,
            ammo: 30,
            reloadTime: 1200,
            damage: {
                dropoff: 5,
                damage: 23,
                valueOf() {
                    return 23;
                },
                toString() {
                    return '23';
                },
            },
            range: 700,
            rateOfFire: 110,
            spread: 100,
            zoom: 1.6,
            recoil: 0.003,
            automatic: true,
            baseScore: 50,
            sight: 'Red Dot',
            devNumber: 2,
            getSkin(n = Math.floor(Math.random() * 100)) {
                return 'http://assets.krunker.io/textures/weapons/skins/weapon_' + this.devNumber + '_' + n + '.png';
            },
        };

        const sniperrifle = {
            name: 'Sniper Rifle',
            class: new Class('Hunter'),
            swapTime: 300,
            aimSpeed: 120,
            speedMultiplier: 0.95,
            ammo: 3,
            reloadTime: 1500,
            damage: {
                dropoff: 30,
                damage: 100,
                valueOf() {
                    return 100;
                },
                toString() {
                    return '100';
                },
            },
            range: 1000,
            rateOfFire: 900,
            spread: 260,
            zoom: 2.7,
            recoil: 0.009,
            automatic: false,
            baseScore: 50,
            sight: 'Scope',
            devNumber: 1,
            getSkin(n = Math.floor(Math.random() * 100)) {
                return 'http://assets.krunker.io/textures/weapons/skins/weapon_' + this.devNumber + '_' + n + '.png';
            },
        };

        const submachinegun = {
            name: 'Submachine Gun',
            class: new Class('Run N Gun'),
            swapTime: 300,
            aimSpeed: 120,
            speedMultiplier: 1.04,
            ammo: 24,
            reloadTime: 1000,
            damage: {
                damage: 18,
                dropoff: 12,
                valueOf() {
                    return 18;
                },
                toString() {
                    return '18';
                },
            },
            range: 700,
            rateOfFire: 70,
            spread: 70,
            zoom: 1.65,
            recoil: 0.0034,
            automatic: true,
            baseScore: 50,
            sight: 'Red Dot',
            devNumber: 4,
            getSkin(n = Math.floor(Math.random() * 100)) {
                return 'http://assets.krunker.io/textures/weapons/skins/weapon_' + this.devNumber + '_' + n + '.png';
            },
        };

        const lightmachinegun = {
            name: 'Light Machine Gun',
            class: new Class('Spray N Pray'),
            swapTime: 700,
            aimSpeed: 200,
            speedMultiplier: 0.79,
            ammo: 60,
            reloadTime: 3500,
            damage: {
                damage: 20,
                dropoff: 10,
                valueOf() {
                    return 20;
                },
                toString() {
                    return '20';
                },
            },
            range: 700,
            rateOfFire: 120,
            spread: 300,
            zoom: 1.3,
            recoil: 0.0032,
            automatic: true,
            baseScore: 50,
            sight: 'Red Dot',
            devNumber: 5,
            getSkin(n = Math.floor(Math.random() * 100)) {
                return 'http://assets.krunker.io/textures/weapons/skins/weapon_' + this.devNumber + '_' + n + '.png';
            },
        };

        const shotgun = {
            name: 'Shotgun',
            class: new Class('Vince'),
            swapTime: 300,
            aimSpeed: 120,
            speedMultiplier: 1,
            ammo: 2,
            reloadTime: 1100,
            damage: {
                damage: 50,
                dropoff: 50,
                valueOf() {
                    return 50;
                },
                toString() {
                    return '50';
                },
            },
            range: 210,
            rateOfFire: 400,
            spread: 120,
            zoom: 1.25,
            recoil: 0.0016,
            automatic: false,
            baseScore: 50,
            sight: 'none',
            devNumber: 6,
            getSkin(n = Math.floor(Math.random() * 100)) {
                return 'http://assets.krunker.io/textures/weapons/skins/weapon_' + this.devNumber + '_' + n + '.png';
            },
        };

        const revolver = {
            name: 'Revolver',
            class: new Class('Detective'),
            swapTime: 200,
            aimSpeed: 120,
            speedMultiplier: 1.04,
            ammo: 6,
            reloadTime: 900,
            damage: {
                damage: 66,
                dropoff: 10,
                valueOf() {
                    return 66;
                },
                toString() {
                    return '66';
                },
            },
            range: 700,
            rateOfFire: 390,
            spread: 100,
            zoom: 1.25,
            recoil: 0.0013,
            automatic: false,
            baseScore: 50,
            sight: 'none',
            devNumber: 7,
            getSkin(n = Math.floor(Math.random() * 100)) {
                return 'http://assets.krunker.io/textures/weapons/skins/weapon_' + this.devNumber + '_' + n + '.png';
            },
        };

        const semiauto = {
            name: 'Semi Auto',
            class: new Class('Marksman'),
            swapTime: 300,
            aimSpeed: 120,
            speedMultiplier: 1,
            ammo: 8,
            reloadTime: 1500,
            damage: {
                damage: 34,
                dropoff: 0,
                valueOf() {
                    return 34;
                },
                toString() {
                    return '34';
                },
            },
            range: 1000,
            rateOfFire: 120,
            spread: 250,
            zoom: 2.1,
            recoil: 0.01,
            automatic: false,
            baseScore: 50,
            sight: 'Red Dot',
            devNumber: 8,
            getSkin(n = Math.floor(Math.random() * 100)) {
                return 'http://assets.krunker.io/textures/weapons/skins/weapon_' + this.devNumber + '_' + n + '.png';
            },
        };

        const rocketlauncher = {
            name: 'Rocket Launcher',
            class: new Class('Rocketeer'),
            swapTime: 600,
            aimSpeed: 200,
            speedMultiplier: 1.9,
            ammo: 2,
            reloadTime: 1600,
            damage: {
                damage: 127,
                dropoff: 60,
                valueOf() {
                    return 127;
                },
                toString() {
                    return '127';
                },
            },
            range: Infinity,
            rateOfFire: 1,
            spread: 120,
            zoom: 1.5,
            recoil: 0.008,
            automatic: false,
            baseScore: 50,
            sight: 'none',
            devNumber: 9,
            getSkin(n = Math.floor(Math.random() * 100)) {
                return 'http://assets.krunker.io/textures/weapons/skins/weapon_' + this.devNumber + '_' + n + '.png';
            },
        };

        const akimbouzi = {
            name: 'Akimbo Uzi',
            class: new Class('Agent'),
            swapTime: 300,
            aimSpeed: 120,
            speedMultiplier: 1.04,
            ammo: 6,
            reloadTime: 900,
            damage: {
                damage: 18 * 2,
                dropoff: 12,
                valueOf() {
                    return 18 * 2;
                },
                toString() {
                    return '18 * 2';
                },
            },
            range: 300,
            rateOfFire: 400,
            spread: 40,
            zoom: null,
            recoil: 0.0034,
            automatic: true,
            baseScore: 50,
            sight: null,
            devNumber: 10,
            getSkin(n = Math.floor(Math.random() * 100)) {
                return 'http://assets.krunker.io/textures/weapons/skins/weapon_' + this.devNumber + '_' + n + '.png';
            },
        };

        const crossbow = {
            name: 'Crossbow',
            class: new Class('Bowman'),
            swapTime: 200,
            aimSpeed: 120,
            speedMultiplier: 1,
            ammo: 1,
            reloadTime: 1000,
            damage: {
                damage: 200,
                dropoff: 0,
                valueOf() {
                    return 200;
                },
                toString() {
                    return '200';
                },
            },
            range: 300,
            rateOfFire: 150,
            spread: 700,
            zoom: 1.4,
            recoil: 0.007,
            automatic: false,
            baseScore: 50,
            sight: 'Red Dot',
            devNumber: 14,
            getSkin(n = Math.floor(Math.random() * 100)) {
                return 'http://assets.krunker.io/textures/weapons/skins/weapon_' + this.devNumber + '_' + n + '.png';
            },
        };

        const famas = {
            name: 'FAMAS',
            class: new Class('Detective'),
            swapTime: 300,
            aimSpeed: 130,
            speedMultiplier: 0.95,
            ammo: 30,
            reloadTime: 1200,
            damage: {
                damage: 28,
                dropoff: 5,
                valueOf() {
                    return 28;
                },
                toString() {
                    return '28';
                },
            },
            range: 700,
            rateOfFire: 280,
            spread: 90,
            zoom: 1.5,
            recoil: 0.0032,
            automatic: false,
            baseScore: 50,
            sight: 'none',
            devNumber: 13,
            getSkin(n = Math.floor(Math.random() * 100)) {
                return 'http://assets.krunker.io/textures/weapons/skins/weapon_' + this.devNumber + '_' + n + '.png';
            },
        };

        const obj = {
            pistol, deserteagle, deagle: deserteagle, alienblaster, assaultrifle, ak: assaultrifle, sniperrifle, sniper: sniperrifle, submachinegun, smg: submachinegun, lightmachinegun, lmg: lightmachinegun, shotgun, revolver, semiauto, rocketlauncher, famas, burst: famas, crossbow, bow: crossbow, combatknife, knife: combatknife, akimbouzi, uzi: akimbouzi,
        }[`${name}`.replace(/\s/g, '').toLowerCase()]
        || [ pistol, deserteagle, alienblaster, assaultrifle, sniperrifle, submachinegun, lightmachinegun, shotgun, revolver, semiauto, rocketlauncher, famas, crossbow, combatknife, akimbouzi ]
        	.find(e => e.devNumber == name);

        if (!obj) return;
        obj.toString = () => obj.name;
        for (const [ k, v ] of Object.entries(obj)) Object.defineProperty(this, k, { value: v, writable: false, enumerable: true });

        return obj;
    }
}

class Class {
    constructor(name = 'Triggerman') {
        const triggerman = {
            health: 100,
            name: 'Triggerman',
            secondary: true,
        };

        const hunter = {
            health: 60,
            name: 'Hunter',
            secondary: true,
        };

        const runngun = {
            health: 100,
            name: 'Run N Gun',
            secondary: false,
        };

        const spraynpray = {
            health: 170,
            name: 'Spray N Pray',
            secondary: true,
        };

        const vince = {
            health: 100,
            name: 'Vince',
            secondary: true,
        };

        const detective = {
            health: 100,
            name: 'Detective',
            secondary: false,
        };

        const marksman = {
            health: 90,
            name: 'Marksman',
            secondary: true,
        };

        const rocketeer = {
            health: 130,
            name: 'Rocketeer',
            secondary: true,
        };

        const agent = {
            health: 100,
            name: 'Agent',
            secondary: false,
        };

        const runner = {
            health: 100,
            name: 'Runner',
            secondary: false,
        };

        const bowman = {
            health: 100,
            name: 'Bowman',
            secondary: true,
        };

        const commando = {
            health: 100,
            name: 'Commando',
            secondary: true,
        };

        const obj = {
            triggerman, hunter, runngun, spraynpray, vince, detective, marksman, rocketeer, agent, runner, bowman, commando,
        }[name.replace(/\s/g, '').toLowerCase()];

        if (!obj) return;
        obj.toString = () => obj.name;
        for (const [ k, v ] of Object.entries(obj)) Object.defineProperty(this, k, { value: v, writable: false, enumerable: true });

        return obj;
    }
}