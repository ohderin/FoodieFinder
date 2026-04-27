export const RESTAURANT_COLORS: Record<string, { primary: string; light: string; dark: string }> = {
  // 🔴 Well-known Chains
  "raising-canes-sample": {
    primary: "#D71920",
    light: "#E63A47",
    dark: "#A01419",
  },
  "chickfila-highland": {
    primary: "#E51636",
    light: "#F03D50",
    dark: "#B3121B",
  },
  "five-guys": {
    primary: "#ED1B2F",
    light: "#F13D52",
    dark: "#C51725",
  },
  "smashburger": {
    primary: "#D2232A",
    light: "#E63F48",
    dark: "#9D191F",
  },
  "whataburger": {
    primary: "#FF7A00",
    light: "#FFB347",
    dark: "#CC6200",
  },
  "chipotle-highland": {
    primary: "#A81612",
    light: "#D41D1E",
    dark: "#7D1209",
  },
  "moes": {
    primary: "#FEC20E",
    light: "#FFD633",
    dark: "#C99A0B",
  },
  "mod-pizza": {
    primary: "#E1251B",
    light: "#F54B3F",
    dark: "#A91813",
  },
  "insomnia-cookies": {
    primary: "#4B2E2B",
    light: "#6B4D48",
    dark: "#2D1B18",
  },
  "sweetgreen-br": {
    primary: "#276E3F",
    light: "#3A8B54",
    dark: "#1F5530",
  },
  "cava": {
    primary: "#7A8F3A",
    light: "#96AB52",
    dark: "#5D6E2D",
  },

  // 🍕 Pizza / Italian
  "lit-pizza": {
    primary: "#DC662A",
    light: "#E8844D",
    dark: "#A84C1F",
  },
  "rotolos": {
    primary: "#612C2C",
    light: "#804040",
    dark: "#3F1A1A",
  },
  "pizza-byronz": {
    primary: "#D45550",
    light: "#E47070",
    dark: "#9D3D3D",
  },
  "reginellis": {
    primary: "#D83830",
    light: "#E85B54",
    dark: "#A42823",
  },
  "monjunis": {
    primary: "#FC0C2A",
    light: "#FD3A52",
    dark: "#BE0920",
  },
  "ginos": {
    primary: "#862F31",
    light: "#A64749",
    dark: "#5F2223",
  },
  "ruffinos": {
    primary: "#7F2330",
    light: "#9B4452",
    dark: "#591820",
  },

  // 🌮 Mexican / Tex-Mex
  "mestizo": {
    primary: "#02AFB2",
    light: "#2DD4D7",
    dark: "#018B8E",
  },
  "superior-grill": {
    primary: "#8C1711",
    light: "#AB3D32",
    dark: "#65100C",
  },
  "izzos": {
    primary: "#588541",
    light: "#72A857",
    dark: "#3F6230",
  },
  "govt-taco": {
    primary: "#8B6E43",
    light: "#A8875E",
    dark: "#654D2F",
  },
  "calientemex": {
    primary: "#00B1AE",
    light: "#2DD4D7",
    dark: "#008A87",
  },

  // 🍔 Burgers / Casual American
  "walk-ons": {
    primary: "#1D3557",
    light: "#3A5680",
    dark: "#141D2A",
  },
  "the-chimes": {
    primary: "#5A0106",
    light: "#7D2A2E",
    dark: "#3C0004",
  },
  "curbside": {
    primary: "#EC2728",
    light: "#F54B4C",
    dark: "#B91D1E",
  },
  "fat-cow": {
    primary: "#D4512C",
    light: "#E87044",
    dark: "#9D3920",
  },
  "mid-city-beer-garden": {
    primary: "#404325",
    light: "#5A6240",
    dark: "#282A18",
  },

  // 🍣 Sushi / Asian
  "tsunami": {
    primary: "#444444",
    light: "#666666",
    dark: "#222222",
  },
  "soji": {
    primary: "#426471",
    light: "#5F8397",
    dark: "#2E4857",
  },
  "ichiban": {
    primary: "#232323",
    light: "#505050",
    dark: "#0F0F0F",
  },
  "sushimasa": {
    primary: "#34495E",
    light: "#5A7A9A",
    dark: "#1F2A39",
  },
  "rockn-sake": {
    primary: "#2A121C",
    light: "#4A3447",
    dark: "#140809",
  },

  // 🦐 Seafood / Fine Dining
  "parrains": {
    primary: "#003015",
    light: "#1A5838",
    dark: "#001A0D",
  },
  "dragos": {
    primary: "#F90922",
    light: "#FB3B51",
    dark: "#BD0519",
  },
  "beausoleil": {
    primary: "#937843",
    light: "#B39963",
    dark: "#6B5A31",
  },
  "jubans": {
    primary: "#004248",
    light: "#1A6B77",
    dark: "#002830",
  },
  "cocha": {
    primary: "#542F2F",
    light: "#6F4646",
    dark: "#382020",
  },

  // 🥗 Healthy / Mediterranean / Modern
  "albasha": {
    primary: "#942F21",
    light: "#B84E37",
    dark: "#6B2216",
  },
  "fresh-junkie": {
    primary: "#598020",
    light: "#7BA538",
    dark: "#405B17",
  },
  "salad-station": {
    primary: "#125734",
    light: "#2E8B57",
    dark: "#0C3A23",
  },
  "zea-salads": {
    primary: "#FF5431",
    light: "#FF7B5C",
    dark: "#CC3C25",
  },
  "city-pork": {
    primary: "#666666",
    light: "#888888",
    dark: "#444444",
  },

  // ☕ Cafe / Breakfast / Dessert
  "louies-cafe": {
    primary: "#00AC8B",
    light: "#2DD4D7",
    dark: "#008A87",
  },
  "another-broken-egg": {
    primary: "#251F21",
    light: "#504448",
    dark: "#141013",
  },
  "simple-joes": {
    primary: "#F12330",
    light: "#F84C59",
    dark: "#B31823",
  },
  "coffee-call": {
    primary: "#0E6381",
    light: "#2A8AB5",
    dark: "#084759",
  },
  "magpie-cafe": {
    primary: "#0E3C4B",
    light: "#2A6580",
    dark: "#071F2A",
  },
  "counterspace": {
    primary: "#9468A4",
    light: "#B895C7",
    dark: "#6D4A80",
  },

  // Default fallback
  "default": {
    primary: "#D71920",
    light: "#E63A47",
    dark: "#A01419",
  },
};

export function getRestaurantTheme(restaurantId: string) {
  return RESTAURANT_COLORS[restaurantId] || RESTAURANT_COLORS["default"];
}
