// ავტონაწილების მონაცემები
// ────────────────────────────────────────────────────────────
// ეს ფაილი დაგენერირდა ბექოფისიდან (admin.html).
// ხელით რედაქტირებაც შეიძლება, ოღონდ სტრუქტურა შეინარჩუნე.

// საიტის ზოგადი პარამეტრები
const SITE = {
  title: "AutoZona",
  tagline: "ნაწილების კატალოგი",
};

// მთავარი გვერდის სლაიდერი (ბექოფისიდან იმართება)
const SLIDES = [
  {
    image: "images/slide-mtxhpgfbhb3p.jpg",
    title: "ფასდაკლებაააააააა",
    link: "",
  },
  {
    image: "images/slide-mtxhtsmbsoyn.jpg",
    title: "",
    link: "",
  },
];

const CATEGORIES = [
  { id: "dzrava", name: "ძრავი", image: "" },
  { id: "muxruchi", name: "სამუხრუჭე სისტემა", image: "" },
  { id: "sakidari", name: "საკიდარი", image: "" },
  { id: "eleqtro", name: "ელექტრო", image: "" },
  { id: "filtri", name: "ფილტრები", image: "" },
  { id: "saburavi", name: "საბურავები და დისკები", image: "" },
  { id: "zeti", name: "ზეთები და სითხეები", image: "" },
  { id: "dakidebis-sistema", name: "დაკიდების სისტემა", image: "" },
  { id: "dzara", name: "ძარა და ოპტიკა", image: "" },
  { id: "diskebi", name: "დისკები", image: "" },
];

const PARTS = [
  {
    name: "RAYS 5113 R18 9.5 J 10.5 J Dark Gunmetal",
    category: "diskebi",
    price: 2200,
    sale: 1500,
    images: [
      "images/5113-lp95-r18-mtxewhmq0kzd.jpg",
    ],
    description: "Size: 18x9.5 | Bolt Pattern: 10(114.3+120) | Offset: ET:12 | Finish: Dark Gunmetal / Lip Polish | Hub Bore: CB:73.1\nSize: 18x10.5 | Bolt Pattern: 10(114.3+120) | Offset: ET:15 | Finish: Dark Gunmetal",
  },
  {
    name: "RAYS 5113 R18 9.5 J 10.5 J Mat Bronze",
    category: "diskebi",
    price: 2200,
    sale: 0,
    images: [
      "images/rays-5113-mat-bronze-r18-mtxfohpvf2oj.jpg",
    ],
    description: "Size: 18x9.5 | Bolt Pattern: 10(114.3+120) | Offset: ET:12 | Finish: Mat Bronze / Lip Polish | Hub Bore: CB:73.1\n Size: 18x10.5 | Bolt Pattern: 10(114.3+120) | Offset: ET:15 | Finish: Mat Bronze",
  },
  {
    name: "XH657 R19   9.5J 11J  Mat Black",
    category: "diskebi",
    price: 2500,
    sale: 0,
    images: [
      "images/xh657-r19-mat-black-mtxg3ql4lybg.jpg",
      "images/xh657-r19-mat-black-mtxg4dzex6g2.jpg",
    ],
    description: "FR-XH657  SIZES: R19X9.5 J  & R19X11 J\nPCD: 5X114.3 ET: 20 & 25 CB: 73.1 FINISH: MATT MATTE BLACK WITH LIP LINE ALLOY WHEELS FOR NISSAN GTR, FORD MUSTANG, DODGE CHALLENGER, DODGE CHARGER AND LEXUS GS",
  },
  {
    name: "TE37 R19 9.5 J 10.5 J Matt Bronze",
    category: "diskebi",
    price: 2500,
    sale: 0,
    images: [
      "images/te37-r19-9-5-j-10-5-j-ma-mtxhgq5hssr4.jpg",
      "images/te37-r19-9-5-j-10-5-j-ma-mtxhgq5hi8or.jpg",
    ],
    description: "TE37 R19 9.5 J 10.5 J ET:22 (5.112) < (5.113.1)>(5.114.3) Matt Bronze  CB:73.1",
  },
  {
    name: "5825A BMW 5X120 R20 8.5 J 9.5 J",
    category: "diskebi",
    price: 2600,
    sale: 0,
    images: [
      "images/5825a-bmw-5x120-r20-8-5--mtxiltwohebm.jpg",
      "images/5825a-bmw-5x120-r20-8-5--mtxiltwp7smi.jpg",
      "images/5825a-bmw-5x120-r20-8-5--mtxiltwpvjn3.jpg",
    ],
    description: "5825A R20X8.5 J 5X120 ET:25  MB (CB:72.6)\n5825A R20X9.5 J 5X120 ET:40  MB (CB:72.6)",
  },
  {
    name: "lexus is 2013-2017 雷克萨斯isMBJ 机盖",
    category: "dzrava",
    price: 900,
    sale: 0,
    images: [
      "images/lexus-is-2013-2017-ismbj-mtybyyzfdpxd.jpg",
      "images/lexus-is-2013-2017-ismbj-mtybyyzfs7lb.jpg",
    ],
    description: "",
  },
  {
    name: "lexus GS 2012-2018 雷克萨斯GS改GSF机盖",
    category: "dzrava",
    price: 900,
    sale: 0,
    images: [
      "images/lexus-gs-2012-2018-gs-gs-mtybyyzfsqda.jpg",
      "images/lexus-gs-2012-2018-gs-gs-mtybyyzfc8sx.jpg",
    ],
    description: "",
  },
  {
    name: "LEXUS is 2013-2017 雷克萨斯isMBJ 机盖",
    category: "dzrava",
    price: 900,
    sale: 0,
    images: [
      "images/lexus-is-2013-2017-ismbj-mtybyyzf5btm.jpg",
      "images/lexus-is-2013-2017-ismbj-mtybyyzffke1.jpg",
    ],
    description: "",
  },
  {
    name: "lexus ct200 2011-2022 雷克萨斯CT200MBJ机盖",
    category: "dzrava",
    price: 900,
    sale: 0,
    images: [
      "images/lexus-ct200-2011-2022-ct-mtybyyzfwmtl.jpg",
      "images/lexus-ct200-2011-2022-ct-mtybyyzfnbbz.jpg",
    ],
    description: "",
  },
  {
    name: "lexus nx 雷克萨斯NX改MB就机盖",
    category: "dzrava",
    price: 900,
    sale: 0,
    images: [
      "images/lexus-nx-nx-mb-mtybyyzf71ft.jpg",
      "images/lexus-nx-nx-mb-mtybyyzftihc.jpg",
    ],
    description: "",
  },
  {
    name: "infinity q50 英菲尼迪q50MBJ机盖",
    category: "dzrava",
    price: 900,
    sale: 0,
    images: [
      "images/infinity-q50-q50mbj-mtybyyzfu8gf.jpg",
      "images/infinity-q50-q50mbj-mtybyyzf1ucu.jpg",
    ],
    description: "",
  },
  {
    name: "infiniti q60 英菲尼迪q60 GTS机盖",
    category: "dzrava",
    price: 1200,
    sale: 0,
    images: [
      "images/infiniti-q60-q60-gts-mtybyyzfjuno.jpg",
      "images/infiniti-q60-q60-gts-mtybyyzfe450.jpg",
    ],
    description: "",
  },
  {
    name: "infiniti q60 2016- 英菲尼迪q60 MBJ机盖",
    category: "dzrava",
    price: 900,
    sale: 0,
    images: [
      "images/infiniti-q60-2016-q60-mb-mtybyyzfxw6m.jpg",
      "images/infiniti-q60-2016-q60-mb-mtybyyzfx6yv.jpg",
    ],
    description: "",
  },
  {
    name: "toyota 86 subaru brz scion გამჭირვალე შუშის საფარი 2012-2020 丰田86 透明玻璃机盖",
    category: "dzrava",
    price: 900,
    sale: 0,
    images: [
      "images/toyota-86-subaru-brz-sci-mtybyyzf8mg9.jpg",
      "images/toyota-86-subaru-brz-sci-mtybyyzfv7i0.jpg",
    ],
    description: "",
  },
  {
    name: "oyota 86 subaru brz scion გამჭირვალე შუშის საფარი 2012-2020 丰田86 碳纤维机盖",
    category: "dzrava",
    price: 900,
    sale: 0,
    images: [
      "images/oyota-86-subaru-brz-scio-mtybyyzfttqz.jpg",
      "images/oyota-86-subaru-brz-scio-mtybyyzfwoxx.jpg",
    ],
    description: "",
  },
  {
    name: "AUDI A5 2017-2019 奥迪a5 MBJ机盖",
    category: "dzrava",
    price: 900,
    sale: 0,
    images: [
      "images/audi-a5-2017-2019-a5-mbj-mtybyyzf4akg.jpg",
      "images/audi-a5-2017-2019-a5-mbj-mtybyyzf3xg0.jpg",
    ],
    description: "",
  },
  {
    name: "Audi a7 2011-2016 奥迪q7 碳纤维机盖",
    category: "dzrava",
    price: 900,
    sale: 0,
    images: [
      "images/audi-a7-2011-2016-q7-mtybyyzfpjxw.jpg",
      "images/audi-a7-2011-2016-q7-mtybyyzfvbfp.jpg",
    ],
    description: "",
  },
  {
    name: "Audi a7 2017-2018 奥迪q7碳纤维机盖",
    category: "dzrava",
    price: 900,
    sale: 0,
    images: [
      "images/audi-a7-2017-2018-q7-mtybyyzf89tb.jpg",
      "images/audi-a7-2017-2018-q7-mtybyyzfovgu.jpg",
    ],
    description: "",
  },
  {
    name: "日产 Nissan370z 碳纤维机盖",
    category: "dzrava",
    price: 900,
    sale: 0,
    images: [
      "images/nissan370z-mtybyyzfcul7.jpg",
    ],
    description: "",
  },
  {
    name: "Audi AUDI A6 2012-2018 奥迪a6 透明机盖",
    category: "dzrava",
    price: 900,
    sale: 0,
    images: [
      "images/audi-audi-a6-2012-2018-a-mtybyyzf7s7l.jpg",
      "images/audi-audi-a6-2012-2018-a-mtybyyzfdznc.jpg",
    ],
    description: "",
  },
  {
    name: "INFINITI Q50 FENDER CARBON 英菲尼迪q50叶子板碳纤维",
    category: "dzrava",
    price: 800,
    sale: 0,
    images: [
      "images/infiniti-q50-fender-carb-mtybyyzf25af.jpg",
      "images/infiniti-q50-fender-carb-mtybyyzfsyxh.jpg",
    ],
    description: "",
  },
  {
    name: "Q50 BASE 2013-2017 FIBER 英菲尼迪Q50A款FRP前唇（普通版）",
    category: "dzrava",
    price: 300,
    sale: 0,
    images: [
      "images/q50-base-2013-2017-fiber-mtybyyzf0rkw.jpg",
      "images/q50-base-2013-2017-fiber-mtybyyzfbpkw.jpg",
    ],
    description: "",
  },
  {
    name: "Q50 BASE 2013-2017 FIBER 英菲尼迪Q50 B款FRP前唇（普通版）",
    category: "dzrava",
    price: 300,
    sale: 0,
    images: [
      "images/q50-base-2013-2017-fiber-mtybyyzfd5lx.jpg",
      "images/q50-base-2013-2017-fiber-mtybyyzfgrn1.jpg",
    ],
    description: "",
  },
  {
    name: "Q50 SPORT 2013 - 2017 FIBER 英菲尼迪Q50A款FRP前唇（运动通版）",
    category: "dzrava",
    price: 300,
    sale: 0,
    images: [
      "images/q50-sport-2013-2017-fibe-mtybyyzfvylu.jpg",
      "images/q50-sport-2013-2017-fibe-mtybyyzfa6tu.jpg",
    ],
    description: "",
  },
  {
    name: "Q50 BASE 2013-2017 CARBON  COMFORT VERSIA 英菲尼迪Q50 A款  前唇（普通版）",
    category: "dzrava",
    price: 800,
    sale: 0,
    images: [
      "images/q50-base-2013-2017-carbo-mtybyyzfeid8.jpg",
      "images/q50-base-2013-2017-carbo-mtybyyzfbzoz.jpg",
    ],
    description: "",
  },
  {
    name: "Q50 BASE 2013-2017 CARBON  英菲尼迪Q50 COMFORT VERSIA B款carbon前唇（普通版）",
    category: "dzrava",
    price: 800,
    sale: 0,
    images: [
      "images/q50-base-2013-2017-carbo-mtybyyzfucup.jpg",
      "images/q50-base-2013-2017-carbo-mtybyyzfv4h0.jpg",
    ],
    description: "",
  },
  {
    name: "Q50 SPORT 2013 - 2017 CARBON LUX VERSIA  英菲尼迪Q50A款carbon前唇（运动通版）",
    category: "dzrava",
    price: 800,
    sale: 0,
    images: [
      "images/q50-sport-2013-2017-carb-mtybyyzf5nbo.jpg",
      "images/q50-sport-2013-2017-carb-mtybyyzf3tgb.jpg",
    ],
    description: "",
  },
  {
    name: "Q50 BOLDING FIBER 英菲尼迪Q50裙边FRP",
    category: "dzrava",
    price: 500,
    sale: 0,
    images: [
      "images/q50-bolding-fiber-q50-fr-mtybyyzfbk6b.jpg",
      "images/q50-bolding-fiber-q50-fr-mtybyyzfye33.jpg",
    ],
    description: "",
  },
  {
    name: "Q50 BOLDING CARBON   英菲尼迪Q50裙边carbon",
    category: "dzrava",
    price: 1100,
    sale: 0,
    images: [
      "images/q50-bolding-carbon-q50-c-mtybyyzfaoy1.jpg",
      "images/q50-bolding-carbon-q50-c-mtybyyzf8pqv.jpg",
    ],
    description: "",
  },
  {
    name: "Q50 BASE VERSION 英菲尼迪Q50FRP后唇",
    category: "dzrava",
    price: 200,
    sale: 0,
    images: [
      "images/q50-base-version-q50frp-mtybyyzfxmab.jpg",
      "images/q50-base-version-q50frp-mtybyyzfuiw0.jpg",
    ],
    description: "",
  },
  {
    name: "FIBER 英菲尼迪Q50 经速版FRP后唇",
    category: "dzrava",
    price: 250,
    sale: 0,
    images: [
      "images/fiber-q50-frp-mtybyyzfp3rx.jpg",
      "images/fiber-q50-frp-mtybyyzfnpze.jpg",
    ],
    description: "",
  },
  {
    name: "FIBER 英菲尼迪Q50 带灯版FRP后唇",
    category: "dzrava",
    price: 300,
    sale: 0,
    images: [
      "images/fiber-q50-frp-mtybyyzf4a8h.jpg",
      "images/fiber-q50-frp-mtybyyzfz9y3.jpg",
    ],
    description: "",
  },
  {
    name: "CARBON 英菲尼迪Q50 经速版carbon后唇",
    category: "dzrava",
    price: 800,
    sale: 0,
    images: [
      "images/carbon-q50-carbon-mtybyyzf8i0c.jpg",
      "images/carbon-q50-carbon-mtybyyzfpshj.jpg",
    ],
    description: "",
  },
  {
    name: "CARBON 英菲尼迪Q50 带灯版carbon后唇",
    category: "dzrava",
    price: 800,
    sale: 0,
    images: [
      "images/carbon-q50-carbon-mtybyyzfzu5g.jpg",
      "images/carbon-q50-carbon-mtybyyzfd2x0.jpg",
    ],
    description: "",
  },
  {
    name: "英菲尼迪Q50 尾翼 FRP 8",
    category: "dzrava",
    price: 250,
    sale: 0,
    images: [
      "images/q50-frp-8-mtybyyzf99dh.jpg",
    ],
    description: "",
  },
  {
    name: "英菲尼迪Q50 尾翼 FRP 1",
    category: "dzrava",
    price: 300,
    sale: 0,
    images: [
      "images/q50-frp-1-mtybyyzfp24a.jpg",
    ],
    description: "",
  },
  {
    name: "英菲尼迪Q50 尾翼 FRP 2",
    category: "dzrava",
    price: 300,
    sale: 0,
    images: [],
    description: "",
  },
  {
    name: "英菲尼迪Q50 尾翼 FRP 3",
    category: "dzrava",
    price: 250,
    sale: 0,
    images: [],
    description: "",
  },
  {
    name: "英菲尼迪Q50 尾翼 FRP 4",
    category: "dzrava",
    price: 150,
    sale: 0,
    images: [
      "images/q50-frp-4-mtybyyzf8wlo.jpg",
    ],
    description: "",
  },
  {
    name: "英菲尼迪Q50 尾翼 FRP 5",
    category: "dzrava",
    price: 150,
    sale: 0,
    images: [],
    description: "",
  },
  {
    name: "英菲尼迪Q50 尾翼 FRP 7",
    category: "dzrava",
    price: 250,
    sale: 0,
    images: [],
    description: "",
  },
];
