// ავტონაწილების მონაცემები
// ────────────────────────────────────────────────────────────
// ეს ფაილი დაგენერირდა ბექოფისიდან (admin.html).
// ხელით რედაქტირებაც შეიძლება, ოღონდ სტრუქტურა შეინარჩუნე.

// საიტის ზოგადი პარამეტრები
const SITE = {
  title: "AutoZona",
  tagline: "ნაწილების კატალოგი",
};

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
    images: [
      "images/5113-lp95-r18-mtxewhmq0kzd.jpg",
    ],
    description: "Size: 18x9.5 | Bolt Pattern: 10(114.3+120) | Offset: ET:12 | Finish: Dark Gunmetal / Lip Polish | Hub Bore: CB:73.1\nSize: 18x10.5 | Bolt Pattern: 10(114.3+120) | Offset: ET:15 | Finish: Dark Gunmetal",
  },
  {
    name: "RAYS 5113 R18 9.5 J 10.5 J Mat Bronze",
    category: "diskebi",
    price: 2200,
    images: [
      "images/rays-5113-mat-bronze-r18-mtxfohpvf2oj.jpg",
    ],
    description: "Size: 18x9.5 | Bolt Pattern: 10(114.3+120) | Offset: ET:12 | Finish: Mat Bronze / Lip Polish | Hub Bore: CB:73.1\n Size: 18x10.5 | Bolt Pattern: 10(114.3+120) | Offset: ET:15 | Finish: Mat Bronze",
  },
  {
    name: "XH657 R19   9.5J 11J  Mat Black",
    category: "diskebi",
    price: 2500,
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
    images: [
      "images/5825a-bmw-5x120-r20-8-5--mtxiltwohebm.jpg",
      "images/5825a-bmw-5x120-r20-8-5--mtxiltwp7smi.jpg",
      "images/5825a-bmw-5x120-r20-8-5--mtxiltwpvjn3.jpg",
    ],
    description: "5825A R20X8.5 J 5X120 ET:25  MB (CB:72.6)\n5825A R20X9.5 J 5X120 ET:40  MB (CB:72.6)",
  },
  {
    name: "5964 BMW 5X120 R19",
    category: "dzrava",
    price: 2500,
    images: [
      "images/5964-bmw-5x120-r19-mtxjlqc0775d.jpg",
      "images/5964-bmw-5x120-r19-mtxjlqc05yaq.jpg",
      "images/5964-bmw-5x120-r19-mtxjlqc1ijsf.jpg",
      "images/5964-bmw-5x120-r19-mtxjlqc1slzc.jpg",
      "images/5964-bmw-5x120-r19-mtxjlqc19gfh.jpg",
    ],
    description: "5964 BMW 5X120 R19 8J ET:30  R19 9J ET:44 MB (CB.72.6)",
  },
];
