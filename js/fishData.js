// Database species ikan, kelangkaan, berat, harga, dan karakteristik bertarung
const FISH_DATABASE = [
    {
        id: 'nila',
        name: 'Ikan Nila Danau',
        rarity: 'common',
        icon: '🐟',
        minWeight: 0.5,
        maxWeight: 2.5,
        basePrice: 40,
        xp: 15,
        stamina: 40,
        pullForce: 1.0,
        speed: 1.0,
        spot: ['lake', 'river'],
        description: 'Ikan air tawar yang sangat umum dijumpai di danau dan sungai tenang. Cocok untuk pemancing pemula.'
    },
    {
        id: 'lele',
        name: 'Ikan Lele Jumbo',
        rarity: 'common',
        icon: '🐟',
        minWeight: 1.2,
        maxWeight: 5.0,
        basePrice: 65,
        xp: 25,
        stamina: 55,
        pullForce: 1.2,
        speed: 1.1,
        spot: ['lake', 'river'],
        description: 'Memiliki kumis panjang dan daya tarik yang cukup kuat saat terjebak kail.'
    },
    {
        id: 'gurame',
        name: 'Ikan Gurame Super',
        rarity: 'common',
        icon: '🐠',
        minWeight: 1.0,
        maxWeight: 4.0,
        basePrice: 75,
        xp: 30,
        stamina: 50,
        pullForce: 1.1,
        speed: 0.9,
        spot: ['lake'],
        description: 'Ikan konsumsi favorit masyarakat dengan sisik lebar dan daging gurih.'
    },
    {
        id: 'sepat',
        name: 'Ikan Sepat Hias',
        rarity: 'common',
        icon: '🐠',
        minWeight: 0.2,
        maxWeight: 0.8,
        basePrice: 35,
        xp: 12,
        stamina: 30,
        pullForce: 0.8,
        speed: 1.3,
        spot: ['river', 'lake'],
        description: 'Ikan kecil lincah bertekstur warna cerah yang sering berenang bergerombol.'
    },
    {
        id: 'mas_dieng',
        name: 'Ikan Mas Dieng',
        rarity: 'rare',
        icon: '🐠',
        minWeight: 2.0,
        maxWeight: 7.5,
        basePrice: 160,
        xp: 60,
        stamina: 75,
        pullForce: 1.5,
        speed: 1.3,
        spot: ['lake'],
        description: 'Ikan mas legendaris dari dataran tinggi Dieng. Bersisik keemas keemasan.'
    },
    {
        id: 'kakap_merah',
        name: 'Ikan Kakap Merah',
        rarity: 'rare',
        icon: '🐟',
        minWeight: 3.0,
        maxWeight: 10.0,
        basePrice: 220,
        xp: 80,
        stamina: 90,
        pullForce: 1.8,
        speed: 1.4,
        spot: ['river', 'ocean'],
        description: 'Penghuni muara laut berkarang. Meronta sangat hebat ketika ditarik.'
    },
    {
        id: 'bawal_bintang',
        name: 'Bawal Bintang Laut',
        rarity: 'rare',
        icon: '🐡',
        minWeight: 2.5,
        maxWeight: 8.0,
        basePrice: 190,
        xp: 75,
        stamina: 85,
        pullForce: 1.6,
        speed: 1.6,
        spot: ['ocean'],
        description: 'Bentuk tubuh pipih dengan renangan super cepat yang bisa mengejutkan senar.'
    },
    {
        id: 'arwana_emas',
        name: 'Arwana Emas Kalimantan',
        rarity: 'epic',
        icon: '🐉',
        minWeight: 4.0,
        maxWeight: 12.0,
        basePrice: 650,
        xp: 220,
        stamina: 120,
        pullForce: 2.2,
        speed: 1.7,
        spot: ['lake', 'trench'],
        description: 'Raja air tawar yang melambangkan keberuntungan. Sisiknya memancarkan kilau emas murni.'
    },
    {
        id: 'tuna_biru',
        name: 'Tuna Sirip Biru Raksasa',
        rarity: 'epic',
        icon: '🐟',
        minWeight: 25.0,
        maxWeight: 90.0,
        basePrice: 850,
        xp: 280,
        stamina: 150,
        pullForce: 2.5,
        speed: 2.0,
        spot: ['ocean', 'trench'],
        description: 'Perenang samudra tercepat dengan daya tahan fisik yang sangat luar biasa.'
    },
    {
        id: 'marlin_biru',
        name: 'Marlin Biru Atlantik',
        rarity: 'epic',
        icon: '🗡️',
        minWeight: 30.0,
        maxWeight: 120.0,
        basePrice: 980,
        xp: 320,
        stamina: 170,
        pullForce: 2.8,
        speed: 2.2,
        spot: ['ocean', 'trench'],
        description: 'Memiliki paruh tajam bak pedang. Sering melompat tinggi keluar dari permukaan air.'
    },
    {
        id: 'hiu_martil',
        name: 'Hiu Martil Samudra',
        rarity: 'legendary',
        icon: '🦈',
        minWeight: 50.0,
        maxWeight: 200.0,
        basePrice: 2200,
        xp: 650,
        stamina: 230,
        pullForce: 3.4,
        speed: 2.4,
        spot: ['ocean', 'trench'],
        description: 'Predator laut dalam berwujud unik. Tarikannya sanggup putuskan senar biasa.'
    },
    {
        id: 'naga_mystik',
        name: 'Ikan Naga Mystik',
        rarity: 'legendary',
        icon: '🐲',
        minWeight: 40.0,
        maxWeight: 150.0,
        basePrice: 3000,
        xp: 850,
        stamina: 260,
        pullForce: 3.8,
        speed: 2.6,
        spot: ['trench'],
        description: 'Makhluk mitos laut dalam yang sangat jarang menampakkan diri di hadapan manusia.'
    },
    {
        id: 'megalodon',
        name: 'Megalodon Purba',
        rarity: 'mythic',
        icon: '🦈',
        minWeight: 300.0,
        maxWeight: 1000.0,
        basePrice: 10000,
        xp: 2500,
        stamina: 380,
        pullForce: 4.8,
        speed: 3.0,
        spot: ['trench'],
        description: 'Monster samudra zaman purba. Hanya pemancing legendaris dengan peralatan tercanggih yang sanggup menaklukkannya!'
    },
    {
        id: 'koi_mas',
        name: 'Ikan Koi Mas Hias',
        rarity: 'rare',
        icon: '🐠',
        minWeight: 1.5,
        maxWeight: 6.0,
        basePrice: 180,
        xp: 65,
        stamina: 70,
        pullForce: 1.4,
        speed: 1.2,
        spot: ['lake', 'crater_lake'],
        description: 'Ikan hias cantik bertotol merah emas. Dipercaya membawa keberuntungan bagi pemancingnya.'
    },
    {
        id: 'nila_emperor',
        name: 'Nila Merah Emperor',
        rarity: 'epic',
        icon: '🐟',
        minWeight: 5.0,
        maxWeight: 18.0,
        basePrice: 720,
        xp: 240,
        stamina: 130,
        pullForce: 2.3,
        speed: 1.8,
        spot: ['lake', 'toba_lake'],
        description: 'Raja ikan nila berukuran raksasa dengan corak sisik berkilau bagai api menyala.'
    },
    {
        id: 'monster_toba',
        name: 'Monster Danau Toba',
        rarity: 'legendary',
        icon: '🐉',
        minWeight: 80.0,
        maxWeight: 350.0,
        basePrice: 4500,
        xp: 1200,
        stamina: 290,
        pullForce: 4.0,
        speed: 2.7,
        spot: ['toba_lake', 'lake'],
        description: 'Makhluk purba penghuni kedalaman Danau Toba yang melegenda. Sangat bertenaga!'
    },

    // ===== IKAN LANGKA TAMBAHAN =====

    {
        id: 'belida_emas',
        name: 'Belida Emas Sumatera',
        rarity: 'rare',
        icon: '🐟',
        minWeight: 3.5,
        maxWeight: 12.0,
        basePrice: 280,
        xp: 95,
        stamina: 95,
        pullForce: 1.9,
        speed: 1.5,
        spot: ['river', 'lake'],
        description: 'Ikan bilah pipih bertubuh perak keemasan dari sungai Sumatera. Hampir punah dan sangat berharga.'
    },
    {
        id: 'sili_rainbow',
        name: 'Sili Pelangi Papua',
        rarity: 'rare',
        icon: '🌈',
        minWeight: 0.5,
        maxWeight: 2.0,
        basePrice: 320,
        xp: 85,
        stamina: 60,
        pullForce: 1.3,
        speed: 2.0,
        spot: ['river', 'lake'],
        description: 'Ikan kecil endemik Papua dengan sisik berwarna pelangi memukau. Sulit dijinakkan meski kecil.'
    },
    {
        id: 'coelacanth',
        name: 'Coelacanth Sulawesi',
        rarity: 'epic',
        icon: '🐠',
        minWeight: 40.0,
        maxWeight: 80.0,
        basePrice: 1800,
        xp: 550,
        stamina: 180,
        pullForce: 3.0,
        speed: 1.4,
        spot: ['ocean', 'trench'],
        description: 'Fosil hidup berusia 400 juta tahun yang ditemukan di perairan Sulawesi. Salah satu ikan paling langka di bumi.'
    },
    {
        id: 'pari_manta',
        name: 'Pari Manta Raja',
        rarity: 'epic',
        icon: '🦋',
        minWeight: 200.0,
        maxWeight: 800.0,
        basePrice: 2200,
        xp: 680,
        stamina: 200,
        pullForce: 3.3,
        speed: 1.8,
        spot: ['ocean', 'trench'],
        description: 'Raksasa elegan lautan tropis. Rentang sayapnya bisa melampaui 7 meter. Tarikannya seperti dihela kapal.'
    },
    {
        id: 'oarfish',
        name: 'Oarfish Penguasa Abyss',
        rarity: 'legendary',
        icon: '🐍',
        minWeight: 100.0,
        maxWeight: 400.0,
        basePrice: 5500,
        xp: 1500,
        stamina: 310,
        pullForce: 4.2,
        speed: 1.6,
        spot: ['trench'],
        description: 'Ikan ular terpanjang di dunia penghuni laut dalam. Dipercaya sebagai pertanda gempa oleh nelayan Jepang.'
    },
    {
        id: 'babirusa_laut',
        name: 'Ikan Babi Laut Arafura',
        rarity: 'legendary',
        icon: '🐗',
        minWeight: 60.0,
        maxWeight: 250.0,
        basePrice: 6000,
        xp: 1800,
        stamina: 340,
        pullForce: 4.5,
        speed: 2.9,
        spot: ['trench', 'ocean'],
        description: 'Predator misterius dari kedalaman Laut Arafura dengan taring melengkung bak babirusa. Belum pernah ditangkap hidup-hidup.'
    },
    {
        id: 'ikan_dewa',
        name: 'Ikan Dewa Cisolok',
        rarity: 'mythic',
        icon: '✨',
        minWeight: 15.0,
        maxWeight: 50.0,
        basePrice: 15000,
        xp: 4000,
        stamina: 420,
        pullForce: 5.0,
        speed: 3.5,
        spot: ['river', 'lake'],
        description: 'Ikan keramat dari mata air suci Cisolok, Sukabumi. Konon hanya muncul satu kali dalam seribu tahun di bawah cahaya bulan purnama.'
    },
    {
        id: 'leviathan',
        name: 'Leviathan Samudra Hindia',
        rarity: 'mythic',
        icon: '🌊',
        minWeight: 1000.0,
        maxWeight: 5000.0,
        basePrice: 50000,
        xp: 9999,
        stamina: 500,
        pullForce: 6.0,
        speed: 4.0,
        spot: ['trench'],
        description: 'Entitas laut purba dari mitologi nusantara. Getaran tarikannya dapat dirasakan hingga ke pantai. Hanya 1 pemancing per generasi yang bisa menangkapnya.'
    }
];

// Function helper to pick random fish based on spot & bait rating
function getRandomFish(spotId, baitRating = 1.0) {
    // Filter fish available in current spot
    const available = FISH_DATABASE.filter(f => f.spot.includes(spotId));
    
    // Weight probabilities based on rarity & bait rating
    const weightedList = [];
    available.forEach(fish => {
        let weight = 100;
        if (fish.rarity === 'common') weight = 60 / baitRating;
        else if (fish.rarity === 'rare') weight = 30 * baitRating;
        else if (fish.rarity === 'epic') weight = 12 * Math.pow(baitRating, 1.5);
        else if (fish.rarity === 'legendary') weight = 4 * Math.pow(baitRating, 2);
        else if (fish.rarity === 'mythic') {
            // Leviathan jauh lebih langka dari mythic lainnya
            weight = fish.id === 'leviathan'
                ? 0.3 * Math.pow(baitRating, 3)
                : 1.5 * Math.pow(baitRating, 2.5);
        }

        for (let i = 0; i < Math.max(1, Math.floor(weight)); i++) {
            weightedList.push(fish);
        }
    });

    const chosen = weightedList[Math.floor(Math.random() * weightedList.length)];
    // Randomize exact caught weight
    const exactWeight = (Math.random() * (chosen.maxWeight - chosen.minWeight) + chosen.minWeight).toFixed(2);
    // Price scales with weight
    const finalPrice = Math.floor(chosen.basePrice * (exactWeight / chosen.minWeight));
    
    return {
        ...chosen,
        caughtWeight: parseFloat(exactWeight),
        finalPrice: finalPrice
    };
}

window.FISH_DATABASE = FISH_DATABASE;
window.getRandomFish = getRandomFish;
