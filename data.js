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
  { id: "dzara", name: "ძარა და ოპტიკა", image: "" },
];

const PARTS = [
  {
    name: "სამუხრუჭე ხუნდები — წინაS",
    category: "muxruchi",
    price: 95,
    image: "images/brake-pads.jpg",
    description: "კერამიკული ხუნდები, დაბალი ხმაური და მტვერი",
  },
  {
    name: "სამუხრუჭე დისკი — წინა (წყვილი)",
    category: "muxruchi",
    price: 180,
    image: "images/brake-discs.jpg",
    description: "ვენტილირებადი დისკები, დიამეტრი 280 მმ",
  },
  {
    name: "სამუხრუჭე სითხე DOT-4",
    category: "muxruchi",
    price: 25,
    image: "images/brake-fluid.jpg",
    description: "1 ლიტრი, ABS სისტემებთან თავსებადი",
  },
  {
    name: "ამორტიზატორი — წინა",
    category: "sakidari",
    price: 140,
    image: "images/shock-absorber.jpg",
    description: "გაზო-ზეთოვანი ამორტიზატორი, მარცხენა/მარჯვენა",
  },
  {
    name: "სტაბილიზატორის ტკიპა",
    category: "sakidari",
    price: 35,
    image: "images/stabilizer-link.jpg",
    description: "გამაგრებული ტკიპა, კომპლექტში 2 ცალი",
  },
  {
    name: "ბურთულა (шаровая)",
    category: "sakidari",
    price: 45,
    image: "images/ball-joint.jpg",
    description: "ქვედა ბერკეტის ბურთულა, ჩაფხუტით",
  },
  {
    name: "აკუმულატორი 60Ah",
    category: "eleqtro",
    price: 230,
    image: "images/battery.jpg",
    description: "540A გამშვები დენი, 2 წლიანი გარანტია",
  },
  {
    name: "გენერატორი 90A",
    category: "eleqtro",
    price: 320,
    image: "images/alternator.jpg",
    description: "აღდგენილი, შემოწმებული სტენდზე",
  },
  {
    name: "სტარტერი",
    category: "eleqtro",
    price: 275,
    image: "images/starter.jpg",
    description: "1.4 kW, რედუქტორიანი",
  },
  {
    name: "ზეთის ფილტრი",
    category: "filtri",
    price: 18,
    image: "images/oil-filter.jpg",
    description: "ორიგინალის ანალოგი, ანტიდრენაჟული სარქველით",
  },
  {
    name: "ჰაერის ფილტრი",
    category: "filtri",
    price: 22,
    image: "images/air-filter.jpg",
    description: "მრავალშრიანი ფილტრის ელემენტი",
  },
  {
    name: "სალონის ფილტრი (ნახშირის)",
    category: "filtri",
    price: 28,
    image: "images/cabin-filter.jpg",
    description: "აქტიური ნახშირით, სუნის შთანთქმა",
  },
  {
    name: "საბურავი 205/55 R16",
    category: "saburavi",
    price: 190,
    image: "images/tire.jpg",
    description: "ზაფხულის საბურავი, 91V",
  },
  {
    name: "შენადნობის დისკი R17",
    category: "saburavi",
    price: 260,
    image: "images/alloy-wheel.jpg",
    description: "5x114.3, ET45, ვერცხლისფერი",
  },
  {
    name: "ძრავის ზეთი 5W-30 (4ლ)",
    category: "zeti",
    price: 75,
    image: "images/engine-oil.jpg",
    description: "სრულად სინთეტიკური, API SN",
  },
  {
    name: "ანტიფრიზი G12 (5ლ)",
    category: "zeti",
    price: 45,
    image: "images/coolant.jpg",
    description: "მზა ხსნარი, -37°C",
  },
  {
    name: "წინა ფარი",
    category: "dzara",
    price: 310,
    image: "images/headlight.jpg",
    description: "მარჯვენა მხარე, ჰალოგენური, ახალი",
  },
  {
    name: "გვერდითი სარკე",
    category: "dzara",
    price: 120,
    image: "images/mirror.jpg",
    description: "ელექტრო რეგულირებით და გათბობით",
  },
  {
    name: "წინა ბამპერი",
    category: "dzara",
    price: 280,
    image: "images/bumper.jpg",
    description: "დაუღებავი, სამღებროდ მზა",
  },
  {
    name: "ძრავი",
    category: "dzrava",
    price: 1000,
    image: "images/dzravi-mtww2smnaqi3.jpg",
    description: "",
  },
];
