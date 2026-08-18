// Katalog Toko Peralatan Mancing (Joran, Senar, Umpan, & Lokasi)
const SHOP_CATALOG = {
    rods: [
        {
            id: 'rod_bamboo',
            name: 'Joran Bambu Klasik',
            price: 0,
            icon: '🎣',
            power: 1.0,
            safeZoneBonus: 1.0,
            description: 'Joran tradisional dari bambu pilihan. Sederhana namun penuh kenangan.'
        },
        {
            id: 'rod_fiber',
            name: 'Joran Serat Kaca',
            price: 150,
            icon: '🎣',
            power: 1.3,
            safeZoneBonus: 1.15,
            description: 'Lebih lentur dan kuat menahan hentakan ikan sedang.'
        },
        {
            id: 'rod_carbon',
            name: 'Joran Carbon Fiber',
            price: 500,
            icon: '🎣',
            power: 1.8,
            safeZoneBonus: 1.35,
            description: 'Bahan karbon ringan dan kokoh untuk akurasi lemparan jarak jauh.'
        },
        {
            id: 'rod_titanium',
            name: 'Joran Titanium Pro',
            price: 1500,
            icon: '🎣',
            power: 2.5,
            safeZoneBonus: 1.6,
            description: 'Teknologi titanium tahan karat yang tangguh melawan ikan raksasa.'
        },
        {
            id: 'rod_cyber',
            name: 'Joran Cyber Neon',
            price: 4000,
            icon: '⚡',
            power: 3.5,
            safeZoneBonus: 2.0,
            description: 'Joran masa depan berdaya kejut elektromagnetik. Mengendalikan ikan monster dengan sangat mudah!'
        },
        {
            id: 'rod_abyssal',
            name: 'Joran Abyss Titanium-X',
            price: 12000,
            icon: '🔱',
            power: 4.5,
            safeZoneBonus: 2.5,
            description: 'Dirancang khusus untuk kedalaman palung. Diperkuat nano-composite yang mampu menahan tegangan ribuan newton.'
        },
        {
            id: 'rod_dragon',
            name: 'Joran Dragon Bone',
            price: 35000,
            icon: '🐲',
            power: 5.8,
            safeZoneBonus: 3.2,
            description: 'Diukir dari tulang naga laut purba. Beresonansi dengan ikan mitos dan memperlebar zona aman secara masif.'
        },
        {
            id: 'rod_leviathan',
            name: 'Joran Sang Leviathan',
            price: 100000,
            icon: '👑',
            power: 8.0,
            safeZoneBonus: 4.5,
            description: 'Satu-satunya joran yang pernah digunakan untuk mendekati Leviathan. Zona amannya hampir separuh gauge. Dibuat oleh pemancing legendaris yang tidak dikenal.'
        }
    ],
    lines: [
        {
            id: 'line_nylon',
            name: 'Senar Nilon Standard',
            price: 0,
            icon: '🧵',
            durability: 1.0,
            description: 'Senar standar lentur cocok untuk memancing santai.'
        },
        {
            id: 'line_braided',
            name: 'Senar Braided PE',
            price: 120,
            icon: '🧶',
            durability: 1.5,
            description: 'Anyaman serat rapat yang tidak mudah molor dan putus.'
        },
        {
            id: 'line_fluorocarbon',
            name: 'Senar Fluorocarbon',
            price: 400,
            icon: '〰️',
            durability: 2.2,
            description: 'Hampir tidak terlihat di dalam air dan sangat tahan gesekan batu karang.'
        },
        {
            id: 'line_kevlar',
            name: 'Benang Nano Kevlar',
            price: 1200,
            icon: '⛓️',
            durability: 3.5,
            description: 'Kekuatan tingkat militer. Mampu menahan giga tarikan monster laut.'
        },
        {
            id: 'line_spider_silk',
            name: 'Senar Sutra Laba-Laba Baja',
            price: 5000,
            icon: '🕸️',
            durability: 5.0,
            description: 'Hasil rekayasa bio-sintetis dari sutra laba-laba yang dilapisi baja nano. Lima kali lebih kuat dari baja dengan elastisitas sempurna.'
        },
        {
            id: 'line_mithril',
            name: 'Senar Mithril Crystalline',
            price: 18000,
            icon: '💎',
            durability: 7.5,
            description: 'Senar berbahan kristal mithril sintetis. Transparan di air, nyaris tidak mungkin putus. Bahkan Megalodon hanya bisa meronta.'
        },
        {
            id: 'line_cosmos',
            name: 'Senar Cosmic Fiber',
            price: 60000,
            icon: '🌌',
            durability: 12.0,
            description: 'Dibuat dari serat material luar angkasa. Kekuatannya melampaui batas fisika normal. Dirancang khusus untuk menahan Leviathan.'
        }
    ],
    baits: [
        {
            id: 'bait_worm',
            name: 'Cacing Sawah',
            price: 0,
            icon: '🪱',
            luckRating: 1.0,
            description: 'Umpan alami serbaguna favorit ikan-ikan biasa.'
        },
        {
            id: 'bait_shrimp',
            name: 'Udang Segar',
            price: 25,
            icon: '🦐',
            luckRating: 1.8,
            description: 'Aroma amis udang segar sangat disukai ikan bertipe Rare.'
        },
        {
            id: 'bait_gold_pellet',
            name: 'Pelet Emas Racikan',
            price: 75,
            icon: '🧆',
            luckRating: 2.8,
            description: 'Campuran bahan rahasia yang mengundang keberadaan ikan Epic.'
        },
        {
            id: 'bait_glowing',
            name: 'Umpan Glowing Neon',
            price: 200,
            icon: '🌟',
            luckRating: 4.5,
            description: 'Memancarkan cahaya memikat di kegelapan air untuk menarik ikan Legendary & Mythic!'
        },
        {
            id: 'bait_deep_scent',
            name: 'Esens Darah Cumi Raksasa',
            price: 600,
            icon: '🦑',
            luckRating: 7.0,
            description: 'Ekstrak feromon cumi kolosal dari kedalaman 2000m. Aroma mematikannya memancing predator laut dalam yang paling pemalu sekalipun.'
        },
        {
            id: 'bait_abyssal_lure',
            name: 'Umpan Bioluminescent Abyss',
            price: 1500,
            icon: '🪼',
            luckRating: 11.0,
            description: 'Umpan bionik berbentuk ubur-ubur bercahaya dari zona afotik. Frekuensi getarannya secara khusus memanggil makhluk mitos laut dalam.'
        },
        {
            id: 'bait_divine',
            name: 'Sesaji Ikan Dewa',
            price: 5000,
            icon: '🏺',
            luckRating: 18.0,
            description: 'Ramuan sakral dari bunga teratai emas, air mata buaya, dan akar pohon tua keramat. Konon hanya umpan ini yang dapat memancing Ikan Dewa Cisolok dan Leviathan.'
        }
    ],
    spots: [
        {
            id: 'lake',
            name: 'Danau Tenang',
            price: 0,
            reqLevel: 1,
            icon: '🏞️',
            bgGradient: ['#0f2027', '#203a43', '#2c5364'],
            waterColor: 'rgba(0, 180, 216, 0.6)',
            description: 'Danau jernih dilingkupi pepohonan asri & teratai floating. Tempat yang damai untuk memancing.'
        },
        {
            id: 'crater_lake',
            name: 'Danau Kawah Vulkanik',
            price: 350,
            reqLevel: 4,
            icon: '🌋',
            bgGradient: ['#0f3443', '#34e89e'],
            waterColor: 'rgba(52, 232, 158, 0.65)',
            description: 'Danau kawah vulkanik berwarna hijau zamrud dengan kabut hangat yang misterius.'
        },
        {
            id: 'toba_lake',
            name: 'Danau Toba Legendaris',
            price: 1200,
            reqLevel: 7,
            icon: '🏞️',
            bgGradient: ['#1a2a6c', '#b21f1f', '#fdbb2d'],
            waterColor: 'rgba(26, 42, 108, 0.75)',
            description: 'Danau vulkanik raksasa paling melegenda. Tempat tinggal Monster Danau Toba!'
        },
        {
            id: 'river',
            name: 'Muara Sungai Tropis',
            price: 250,
            reqLevel: 3,
            icon: '🏞️',
            bgGradient: ['#134e5e', '#71b280'],
            waterColor: 'rgba(16, 172, 132, 0.65)',
            description: 'Pertemuan air tawar dan laut. Beragam ikan menarik berenang di sini.'
        },
        {
            id: 'ocean',
            name: 'Laut Dalam Samudra',
            price: 800,
            reqLevel: 6,
            icon: '🌊',
            bgGradient: ['#021B79', '#0575E6'],
            waterColor: 'rgba(2, 62, 138, 0.75)',
            description: 'Ombak samudra yang menantang dengan kawanan ikan laut raksasa.'
        },
        {
            id: 'trench',
            name: 'Ocean Trench Misterius',
            price: 2500,
            reqLevel: 10,
            icon: '🌌',
            bgGradient: ['#000000', '#130cb7', '#52e5e7'],
            waterColor: 'rgba(5, 5, 25, 0.85)',
            description: 'Palung laut paling dalam tempat bersemayamnya makhluk purba dan mitos!'
        }
    ]
};

window.SHOP_CATALOG = SHOP_CATALOG;
